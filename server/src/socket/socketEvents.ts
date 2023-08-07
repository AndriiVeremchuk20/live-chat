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
	online: {
		online: "online",
		offline: "offline",
		online_users: "online_users",
	},
	typingMessage: {
		typing: "typing",
		typing_response: "typing_response",
	},
	error: "socket_error"
}

export default SocketEvents;
