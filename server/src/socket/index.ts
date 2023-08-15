import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import logger from "../logger";
import prisma from "../../prisma";
import SocketEvents from "./socketEvents";
import redisClient from "../redis";
import getUserKey from "../utils/getUserKey";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

redisClient.connect();

const DEFAULT_MESSAGES_LIMIT = 20;

const usersSockets = new Map<string, string>();

// socket io
io.on(SocketEvents.connection, (socket) => {
  // user connected event
  logger.info("User connected, Socket ID:" + socket.id);
  socket.on(SocketEvents.auth, ({ user_id }: { user_id: string }) => {
    usersSockets.set(socket.id, user_id);
  });

  socket.on(SocketEvents.ping, async ({ user_id }: { user_id: string }) => {

	  //console.log("User ONLINE " + user_id);
    
	  try {
      await redisClient.set(getUserKey(user_id), "online", { EX: 30 });

      const onlineUsers = await redisClient.keys("user:*");
      
	  //console.table(onlineUsers);

      const usersWithChatTarget = await prisma.chat.findMany({
        where: {
          users: {
            some: { user_id: user_id },
          },
        },
        select: {
          users: {
            where: {
              NOT: [{ user_id }],
              user_id: {
                in: onlineUsers.map((key) => key.split(":")[1]),
              },
            },
            select: {
              user_id: true,
            },
            take: 1,
          },
        },
      });

      //console.table(usersWithChatTarget);

      const onlineUsersResponse = usersWithChatTarget
        .map((chat) => chat.users[0])
        .filter(Boolean)
        .map((user) => user.user_id);
      return socket.emit(SocketEvents.online, onlineUsersResponse);
    } catch (error) {
      logger.error(error);
      socket.emit(SocketEvents.error, {
        status: "error",
        message: "server error",
      });
    }
  });

  // --> join user  to chat
  socket.on(
    SocketEvents.chat.join,
    async ({ chat_id, user_id }: { chat_id: string; user_id: string }) => {
      const chatMetadata = await prisma.chat.findFirst({
        where: {
          id: chat_id,
          users: {
            some: {
              user_id: user_id,
            },
          },
        },
        // select: {
        //  id: true,
        //  users: {
        //   where: {
        //     NOT: [{ user_id: user_id }],
        //   },
        //   select: {
        //     user: {
        //       select: {
        //         id: true,
        //         first_name: true,
        //        last_name: true,
        //        email: true,
        //        role: true,
        //        created_at: true,
        //        profile: true,
        //      },
        //    },
        //  },
        // },
        // messages: {
        //   orderBy: {
        //     created_at: "desc",
        //   },
        //   take: DEFAULT_MESSAGES_LIMIT,
        // },
        //},
      });

      // if user not found in chat return socket_error (Private chat);
      if (!chatMetadata) {
        return socket.emit(SocketEvents.error, { message: "Private chat" });
      }

      //  const recponseChatMetadata = {
      //   id: chatMetadata.id,
      //   receiver: chatMetadata.users[0].user,
      //   messages: chatMetadata.messages.reverse(),
      // }

      // join user to chat
      logger.info(
        `user ${user_id} join to chat ${chat_id} with socket ${socket.id}`
      );

      socket.join(chat_id);
      //socket.emit("response_user_join", { ...recponseChatMetadata });
    }
  );

  // --> leave user from room
  socket.on(
    SocketEvents.chat.leave,
    async ({ chat_id }: { chat_id: string }) => {
      //console.log("user leave from chat: " + socket.id);
      socket.leave(chat_id);
    }
  );

  // send message event
  socket.on(
    SocketEvents.message.send,
    async ({
      chat_id,
      sender_id,
      receiver_id,
      text,
    }: {
      chat_id: string;
      sender_id: string;
      receiver_id: string;
      text: string;
    }) => {
      // add message to db
      const newMessage = await prisma.message.create({
        data: {
          chat_id,
          sender_id,
          receiver_id,
          text,
          isRead: false,
        },
        select: {
          id: true,
          chat_id: true,
          text: true,
          created_at: true,
          isRead: true,
          sender: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              created_at: true,
              profile: true,
            },
          },
          receiver_id: true,
          sender_id: true,
        },
      });
      console.table({ chat_id, sender_id, receiver_id, text });

      // send message to chat
      io.to(chat_id).emit(SocketEvents.message.receive, { ...newMessage });
    }
  );

  // on read message
  socket.on(
    SocketEvents.message.read.onRead,
    async ({ message_id }: { message_id: string }) => {
      try {
        const messageWithUpdateIsReadStatus = await prisma.message.update({
          where: { id: message_id },
          data: {
            isRead: true,
          },
          select: {
            id: true,
            chat_id: true,
            isRead: true,
          },
        });

        io.to(messageWithUpdateIsReadStatus.chat_id).emit(
          SocketEvents.message.read.onReadResponse,
          { ...messageWithUpdateIsReadStatus }
        );
      } catch (error) {
        socket.emit(SocketEvents.error, {
          type: "error",
          message: "server error",
        });
      }
    }
  );

  // user typing message
  socket.on(
    SocketEvents.typingMessage.typing,
    ({
      chat_id,
      sender_id,
      isTyping,
    }: {
      chat_id: string;
      sender_id: string;
      isTyping: boolean;
    }) => {
      //console.log("user typing")
      io.to(chat_id).emit(SocketEvents.typingMessage.typing_response, {
        sender_id,
        isTyping,
      });
    }
  );

  //on user disconnect
  socket.on("disconnect", async () => {
    const disconectedUser = usersSockets.get(socket.id);
    if (disconectedUser) {
      redisClient.del(getUserKey(disconectedUser));
      usersSockets.delete(socket.id);
    }
  });
});

export { app, server };
