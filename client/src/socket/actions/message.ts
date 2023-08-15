import Message from "@/types/message.type";
import socket from "..";
import SocketEvents from "../events";

const onSendMessage = (payload: {
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
}) => {
  socket.emit(SocketEvents.message.send, { ...payload });
};

const onReseiveMessage = (callback: (message: Message) => void) => {
  socket.on(SocketEvents.message.receive, callback);
};

const onReadMessage = ({message_id}: {message_id: string}) => {
	socket.emit(SocketEvents.message.read.onRead, {message_id});
};

const onReadMessageResponse = (callback: ({id, isRead}:{id: string, isRead: boolean})=>void) => {
	socket.on(SocketEvents.message.read.onReadResponse, callback);
};

export { onSendMessage, onReseiveMessage, onReadMessage, onReadMessageResponse };
