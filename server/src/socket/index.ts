import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import logger from "../logger";

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
  logger.info("User is connected " + socket.id);
});

export { app, server };
