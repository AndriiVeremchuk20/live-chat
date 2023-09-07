import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import SocketEvents from "./socketEvents";
import redisClient from "../redis";

// import socket events
import typingHandlers from "./handlers/typing";
import pingHandlers from "./handlers/ping";
import chatHandlers from "./handlers/chat";
import authHandler from "./handlers/auth";
import messageHandler from "./handlers/message";
import disconnectHandlers from "./handlers/disconnect";
import likeHandler from "./handlers/like";

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

const onConnection = (socket: Socket) => {
  authHandler(io, socket);
  pingHandlers(io, socket);
  chatHandlers(io, socket);
  messageHandler(io, socket);
  typingHandlers(io, socket);
  likeHandler(io, socket);
  disconnectHandlers(io, socket);
};

io.on(SocketEvents.connection, onConnection);

export { app, server };
