import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import SocketEvents from "./socketEvents";
import redisClient from "../redis";

// import socket events
import typingHandlers from "./events/typingHandlers";
import pingHandlers from "./events/pingHandlers";
import chatHandlers from "./events/chatHandlers";
import authHandler from "./events/authHandlers";
import messageHandler from "./events/messageHandlers";
import disconnectHandlers from "./events/disconnectHandlers";

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
  disconnectHandlers(io, socket);
};

io.on(SocketEvents.connection, onConnection);

export { app, server };
