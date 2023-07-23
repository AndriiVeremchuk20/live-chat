import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import AuthRoute from "./routes/auth";
import verifyToken from "./middleware/verifyToken";
import ProfileRoutes from "./routes/profile";
import UserActionsRoute from "./routes/user";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//add log error and error handler

//app routes
app.use("/auth", AuthRoute);

app.use(verifyToken); // cut off users without account

// private routes
app.use("/profile", ProfileRoutes);
app.use("/user-actions", UserActionsRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

io.on("connection", (socket) => {
  console.log("User is connected");
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
