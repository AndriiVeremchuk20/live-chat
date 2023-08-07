import Chat from "@/types/chat.type";
import socket from "..";
import SocketEvents from "../events";

const onJoinChat = ({
  chat_id,
  user_id,
}: {
  chat_id: string;
  user_id: string;
}) => {
  socket.emit(SocketEvents.chat.join, { chat_id: chat_id, user_id: user_id });
};

const joinChatResponse = (callback: (chat: Chat)=>void) => {
	socket.on(SocketEvents.chat.response, callback);
} 

const onLeaveChat = ({ chat_id }: { chat_id: string }) => {
  socket.emit(SocketEvents.chat.leave, { chat_id: chat_id });
};

export { onJoinChat, onLeaveChat, joinChatResponse };
