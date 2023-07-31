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
  io.on("online", async (user_id: string) => {
    const updatedUser = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        isOnline: true,
      },
    });
    socket.broadcast.emit("online_user", updatedUser.id);
  });

  socket.on("send_message", async (data: UserSendMessageType) => {
    console.log("Recived message: ", data);

    // !!! add check both users
    // adding message in database
    const newMessage = await prisma.message.create({
      data: {
        text: data.text,
        sender_id: data.sender_id,
        reciver_id: data.receiver_id,
      },
    });

    io.emit("receive_message", { ...newMessage });
  });

  socket.on("disconnect", () => {
    console.log("user dosconnected");
    //io.emit("online-users", )
  });

  socket.on("offline", async (user_id: string) => {
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
