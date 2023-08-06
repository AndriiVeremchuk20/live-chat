import socket from "..";
import SocketEvents from "../events";

const onTyping = ({chat_id, sender_id, isTyping}: {chat_id: string, sender_id: string, isTyping: boolean}) => {
	socket.emit(SocketEvents.typingMessage.typing, {chat_id, sender_id, isTyping});
};

const onTypingResponse = (callback: ({sender_id, isTyping}: {sender_id: string, isTyping: boolean})=>void) => {
	socket.on(SocketEvents.typingMessage.typing_response, callback);
};

export {onTyping, onTypingResponse}
