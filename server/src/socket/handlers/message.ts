import { Server, Socket } from "socket.io";
import prisma from "../../../prisma";
import SocketEvents from "../socketEvents";
import { v4 as uuid } from "uuid";
import uploadToGCS from "../../googleStorageCloud/fileOperations/uploadToGCS";

const messageHandler = (io: Server, socket: Socket) => {
  const onSendMessage = async ({
    chat_id,
    sender_id,
    receiver_id,
    text,
    image,
    reply_to_message_id,
  }: {
    chat_id: string;
    sender_id: string;
    receiver_id: string;
    text: string | null;
    image: Buffer | null;
    reply_to_message_id: string | null;
  }) => {
    // check for text or image
    if (!text && !image) {
      return socket.emit(SocketEvents.error, {
        status: "error",
        message: "message is empty",
      });
    }

    // check if the image is being sent
    let imageUrl: any;
    if (image) {
      console.log("upload message image");
      imageUrl = await uploadToGCS(image, "chatImages", `${uuid()}.png`);
    }

    console.log("adding a new message");
    // add message to db
    const newMessage = await prisma.message.create({
      data: {
        chat_id,
        sender_id,
        receiver_id,
        reply_to_message_id,
        text,
        image_url: imageUrl as string,
        isRead: false,
      },
      select: {
        id: true,
        chat_id: true,
        text: true,
        image_url: true,
        created_at: true,
        isRead: true,
        sender: true,
        receiver: true,
        receiver_id: true,
        sender_id: true,
        reply_to: true,
      },
    });
    console.table({ chat_id, sender_id, receiver_id, text });

    // send message to chat
    io.to(chat_id).emit(SocketEvents.message.receive, { ...newMessage });
  };

  const onReadMessage = async ({ message_id }: { message_id: string }) => {
    try {
      const messageWithUpdateIsReadStatus = await prisma.message.update({
        where: { id: message_id },
        data: {
          isRead: true,
        },
        select: {
          id: true,
          chat_id: true,
          isRead: true,
        },
      });

      io.to(messageWithUpdateIsReadStatus.chat_id).emit(
        SocketEvents.message.read,
        { ...messageWithUpdateIsReadStatus }
      );
    } catch (error) {
      socket.emit(SocketEvents.error, {
        status: "error",
        message: "server error",
      });
    }
  };

  const onDeleteMessage = async ({
    message_id,
    chat_id,
    deleter_id,
  }: {
    message_id: string;
    chat_id: string;
    deleter_id: string;
  }) => {
    const checkMessageSender = await prisma.message.findUnique({
      where: {
        id: message_id,
      },
    });

    if (!checkMessageSender || checkMessageSender.sender_id !== deleter_id) {
      return socket.emit(SocketEvents.error, {
        status: "error",
        message: "Only the sender can delete the message.",
      });
    }

    const deletedMessage = await prisma.message.delete({
      where: {
        id: message_id,
      },
    });

    io.to(chat_id).emit(SocketEvents.message.delete, {
      message_id: deletedMessage.id,
    });
  };

  socket.on(SocketEvents.message.send, onSendMessage);
  socket.on(SocketEvents.message.delete, onDeleteMessage);
  socket.on(SocketEvents.message.read, onReadMessage);
};

export default messageHandler;
