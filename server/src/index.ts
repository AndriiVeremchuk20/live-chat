import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import verifyToken from "./middleware/verifyToken";
import logger from "./logger";
import { app, server } from "./socket";

// app routes
import ProfileRoutes from "./routes/profile";
import UserActionsRoute from "./routes/user";
import AuthRoute from "./routes/auth";
import ChatRoute from "./routes/chat";

const PORT = Number(process.env.PORT) || 5000;

app.use(express.static("public"))
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
app.use("/chat", ChatRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});
