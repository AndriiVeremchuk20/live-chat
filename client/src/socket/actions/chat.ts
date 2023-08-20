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

const onLeaveChat = ({ chat_id }: { chat_id: string }) => {
  socket.emit(SocketEvents.chat.leave, { chat_id: chat_id });
};

const onNewChat = ({chat_id, receiver_id}: {chat_id: string, receiver_id: string}) => {
 socket.emit(SocketEvents.chat.newChat, {chat_id, receiver_id});
};

export { onJoinChat, onLeaveChat, onNewChat };
