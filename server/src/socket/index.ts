import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import logger from "../logger";
import prisma from "../../prisma";
import UserSendMessageType from "../types/message";
import SocketEvents from "./socketEvents";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// socket io
io.on(SocketEvents.connection, (socket) => {
  // user connected event
  logger.info("User connected, Socket ID:" + socket.id);

  // set user status online
  socket.on(SocketEvents.online.online, async (user_id: string) => {
    const updatedUser = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        isOnline: true,
        socket_id: socket.id,
      },
    });

    socket.broadcast.emit("online_user", updatedUser.id);
  });

  // --> join user  to chat
  socket.on(
    SocketEvents.chat.join,
    async ({ chat_id, user_id }: { chat_id: string; user_id: string }) => {
      // try found chat
      const checkUserChat = await prisma.chat.findFirst({
        where: {
          id: chat_id,
          users: { some: { user_id: user_id } },
        },
      });

      // if user not found in chat return socket_error (Private chat);
      if (!checkUserChat) {
        return socket.emit(SocketEvents.error, { message: "Private chat" });
      }

      // join user to chat
      logger.info(
        `user ${user_id} join to chat ${chat_id} with socket ${socket.id}`
      );
      socket.join(chat_id);
    }
  );

  // --> leave user from room
  socket.on(
    SocketEvents.chat.leave,
    async ({ chat_id }: { chat_id: string }) => {
      console.log("user leave from chat: " + socket.id);
      socket.leave(chat_id);
    }
  );

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
        },
      });
      console.table({ chat_id, sender_id, receiver_id, text });
      io.to(chat_id).emit(SocketEvents.message.receive, { ...newMessage });
    }
  );

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

		io.to(chat_id).emit(SocketEvents.typingMessage.typing_response,{sender_id, isTyping})
	}
  );

  socket.on("disconnect", async () => {
    // find user to chek
    const mbUser = await prisma.user.findFirst({
      where: {
        socket_id: socket.id,
      },
    });

    //chek user
    if (!mbUser) {
      logger.warn("user not found");
      return;
    }
    // set socket null, isOnline false
    await prisma.user.update({
      where: {
        id: mbUser.id,
      },
      data: {
        socket_id: null,
        isOnline: false,
      },
    });
  });

  socket.on(SocketEvents.online.offline, async (user_id: string) => {
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        isOnline: false,
      },
    });
  });
});

export { app, server };
