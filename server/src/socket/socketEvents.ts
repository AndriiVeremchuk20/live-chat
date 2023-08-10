const SocketEvents = {
  connection: "connection",
  chat: {
    join: "join_chat",
    leave: "leave_chat",
  },
  message: {
    send: "send_message",
    receive: "receive_message",
    delete: "delete_message",
    edit: "edit_message",
  },
  online: "online",
  typingMessage: {
    typing: "typing",
    typing_response: "typing_response",
  },
  ping: "user_ping",
  error: "socket_error",
};

export default SocketEvents;
