const SocketEvents = {
  connection: "connection",
  chat: {
    join: "join_chat",
	response: "response_user_join",
    leave: "leave_chat",
  },
  message: {
    send: "send_message",
    receive: "receive_message",
    delete: "delete_message",
    edit: "edit_message",
  },
  online: {
    online: "online",
    offline: "offline",
  },
  typingMessage: {
    typing: "typing",
    typing_response: "typing_response",
  },
  error: "socket_error",
};

export default SocketEvents;
