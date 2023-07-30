import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRoute from "./routes/auth";
import verifyToken from "./middleware/verifyToken";
import ProfileRoutes from "./routes/profile";
import UserActionsRoute from "./routes/user";
import logger from "./logger";
import {app, server} from "./socket"

const PORT = Number(process.env.PORT) || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//add log error and error handler

//app routes
app.use("/auth", AuthRoute);

// cut off users without account
app.use(verifyToken);

// private routes
app.use("/profile", ProfileRoutes);
app.use("/user-actions", UserActionsRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});
