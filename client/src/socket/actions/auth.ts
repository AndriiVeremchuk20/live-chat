import socket from "..";
import SocketEvents from "../events";

const auth = ({ user_id }: { user_id: string }) => {
  socket.emit(SocketEvents.auth, { user_id });
};

export { auth };
