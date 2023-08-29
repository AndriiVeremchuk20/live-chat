import Message from "@/types/message.type";
import socket from "..";
import SocketEvents from "../events";

// send message
const onSendMessage = (payload: {
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  text: string | null;
  image: File | null;
  reply_to_message_id: string | null;
}) => {
  socket.emit(SocketEvents.message.send, { ...payload });
};

// receive message
const onReseiveMessage = (callback: (message: Message) => void) => {
  socket.on(SocketEvents.message.receive, callback);
};

// read message
const onReadMessage = ({ message_id }: { message_id: string }) => {
  socket.emit(SocketEvents.message.read, { message_id });
};

const onReadMessageResponse = (
  callback: ({ id, isRead }: { id: string; isRead: boolean }) => void,
) => {
  socket.on(SocketEvents.message.read, callback);
};

// delete message

const onDeleteMessage = ({
  message_id,
  chat_id,
  deleter_id,
}: {
  message_id: string;
  chat_id: string;
  deleter_id: string;
}) => {
  socket.emit(SocketEvents.message.delete, { message_id, chat_id, deleter_id });
};

const onDeleteMessageResponse = (
  callback: ({ message_id }: { message_id: string }) => void,
) => {
  socket.on(SocketEvents.message.delete, callback);
};

export {
  onSendMessage,
  onReseiveMessage,
  onReadMessage,
  onReadMessageResponse,
  onDeleteMessage,
  onDeleteMessageResponse,
};
