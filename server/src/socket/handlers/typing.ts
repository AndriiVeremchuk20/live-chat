import { Server, Socket } from "socket.io";
import SocketEvents from "../socketEvents";

const typingHandlers = (io: Server, socket: Socket) => {
  const onTypingMessage = ({
    chat_id,
    sender_id,
    isTyping,
  }: {
    chat_id: string;
    sender_id: string;
    isTyping: boolean;
  }) => {
    const typingResponse = {
      sender_id,
      chat_id,
      isTyping,
    };

    io.to(chat_id).emit(SocketEvents.typing, typingResponse);
  };

  socket.on(SocketEvents.typing, onTypingMessage);
};

export default typingHandlers;
