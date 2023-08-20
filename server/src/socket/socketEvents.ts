const SocketEvents = {
  connection: "connection",
  auth: "auth",
  chat: {
    join: "join_chat",
    leave: "leave_chat",
	newChat: "new_chat",
  },
  message: {
    send: "send_message",
    receive: "receive_message",
    delete: "delete_message",
    edit: "edit_message",
	read:{
		onRead: "read_message",
		onReadResponse: "read_message_response",
	}
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
