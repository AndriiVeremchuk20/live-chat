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
  online: "online",
  typing: "typing",
  ping: "ping",
  error: "socket_error",
  disconnect: "disconnect",
};

export default SocketEvents;
