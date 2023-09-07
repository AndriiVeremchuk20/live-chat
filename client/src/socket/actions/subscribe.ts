import socket from "..";
import SocketEvents from "../events";

const onSubscribe = ({
  subscriber_id,
  subscribedTo_id,
}: {
  subscriber_id: string;
  subscribedTo_id: string;
}) => {
  socket.emit(SocketEvents.subscribe.subscribe, {
    subscriber_id,
    subscribedTo_id,
  });
};

export { onSubscribe };
