import { disconnect } from "process";
import socket from "..";

const onDisconnect = () => {
  socket.disconnect();
};

export { onDisconnect };
