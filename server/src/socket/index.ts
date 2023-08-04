import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import logger from "../logger";
import prisma from "../../prisma";
import UserSendMessageType from "../types/message";

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
io.on("connection", (socket) => {
  console.log("User is connected " + socket.id);
  // set user status online
  socket.on("online", async (user_id: string) => {
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

  socket.on("join_chat", async ({ chat_id }: { chat_id: string }) => {
    console.log("user Joined:  " + socket.id + " " + chat_id);
    socket.join(chat_id);
  });

  socket.on(
    "send_message",
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
      io.to(chat_id).emit("receive_message", {...newMessage});
    }
  );

  // sending message
  //socket.on("send_message", async (data: UserSendMessageType) => {
  //  console.log("Recived message: ", data);
  // !!! add check both users
  // adding message in database
  //const newMessage = await prisma.message.create({
  //  data: {
  //    text: data.text,
  //    sender_id: data.sender_id,
  //    receiver_id: data.receiver_id,
  // },
  //});

  //io.emit("receive_message", { ...newMessage });
  //});

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

    //io.emit("online-users", )
  });

  //socket.on("offline", async (user_id: string) => {
  // await prisma.user.update({
  // where: {
  // id: user_id,
  //},
  // data: {
  //  isOnline: false,
  //   },
  // });
  //});
});

export { app, server };
