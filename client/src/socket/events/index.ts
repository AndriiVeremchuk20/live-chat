const SocketEvents = {
  connection: "connection",
  auth: "auth",
  chat: {
    join: "chat:join",
    leave: "chat:leave",
    new: "chat:new",
  },
  message: {
    send: "message:send",
    receive: "message:receive",
    delete: "message:delete",
    edit: "message:edit",
    read: "message:read",
  },
  subscribe: {
	subscribe: "subscribe",
	unsubscribe: "unsubscribe",
  },
  like: "like",
  online: "online",
  typing: "typing",
  ping: "ping",
  error: "socket_error",
};

export default SocketEvents;
