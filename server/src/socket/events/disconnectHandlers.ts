import { Server, Socket } from "socket.io";
import { usersSockets } from "../usersSockets";
import redisClient from "../../redis";
import getUserKey from "../../utils/getUserKey";

const disconnectHandlers = (io: Server, socket: Socket) => {
  const onDisconnect = async () => {
    const disconectedUser = usersSockets.get(socket.id);
    if (disconectedUser) {
      redisClient.del(getUserKey(disconectedUser));
      usersSockets.delete(socket.id);
    }
  };
  socket.on("disconnect", onDisconnect);
};

export default disconnectHandlers;
