import { Server, Socket } from "socket.io";
import SocketEvents from "../socketEvents";
import {usersSockets} from "../usersSockets";

const authHandler = (io: Server, socket: Socket) => {
  const onAuth = ({ user_id }: { user_id: string }) => {
    usersSockets.set(socket.id, user_id);
  };

  socket.on(SocketEvents.auth, onAuth);
};

export default authHandler;
