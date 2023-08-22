import { Server, Socket } from "socket.io";
import SocketEvents from "../socketEvents";
import prisma from "../../../prisma";
import { usersSockets } from "../usersSockets";

const chatHandlers = (io: Server, socket: Socket) => {
  const onJoinToChat = async ({
    chat_id,
    user_id,
  }: {
    chat_id: string;
    user_id: string;
  }) => {
    const chatMetadata = await prisma.chat.findFirst({
      where: {
        id: chat_id,
        users: {
          some: {
            user_id: user_id,
          },
        },
      },
    });

    // if user not found in chat return socket_error (Private chat);
    if (!chatMetadata) {
      return socket.emit(SocketEvents.error, {
        status: "error",
        message: "Private chat",
      });
    }
    socket.join(chat_id);
  };

  const onNewChat = async ({
    chat_id,
    receiver_id,
  }: {
    chat_id: string;
    sender_id: string;
    receiver_id: string;
  }) => {
    // if the user is online join him to a new chat
    const receivesSocketId = [...usersSockets.entries()]
      .filter(({ 1: v }) => v === receiver_id)
      .map(([k]) => k);

    if (receivesSocketId) {
      io.to(receivesSocketId).socketsJoin(chat_id);
      socket.join(chat_id);
    }
  };

  const onLeave = async ({ chat_id }: { chat_id: string }) => {
    socket.leave(chat_id);
  };

  socket.on(SocketEvents.chat.join, onJoinToChat);
  socket.on(SocketEvents.chat.new, onNewChat);
  socket.on(SocketEvents.chat.leave, onLeave);
};

export default chatHandlers;
