import socket from "..";
import SocketEvents from "../events";

const onTyping = ({
  chat_id,
  sender_id,
  isTyping,
}: {
  chat_id: string;
  sender_id: string;
  isTyping: boolean;
}) => {
  socket.emit(SocketEvents.typing, {
    chat_id,
    sender_id,
    isTyping,
  });
};

const onTypingResponse = (
  callback: ({
    sender_id,
    chat_id,
    isTyping,
  }: {
    sender_id: string;
    chat_id: string;
    isTyping: boolean;
  }) => void,
) => {
  socket.on(SocketEvents.typing, callback);
};

export { onTyping, onTypingResponse };
