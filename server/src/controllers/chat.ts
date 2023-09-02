import { User, UsersOnChats } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";
import getUser from "../utils/isUser";

const DEFAULT_MESSAGES_LIMIT = 20;

const getUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "user not found" });
  }

  const lastmessagesOfUserChats = await prisma.chat.findMany({
    where: {
      users: {
        some: { user_id: user.uid },
      },
      messages: {
        some: {},
      },
    },
    select: {
      messages: {
        select: {
          id: true,
          text: true,
		  image_url: true,
          chat_id: true,
          isRead: true,
          sender: true,
          receiver: true,
          sender_id: true,
          receiver_id: true,
          created_at: true,
        },
        orderBy: [{ created_at: "desc" }],
        take: 1,
      },
    },
    orderBy: [{ created_at: "asc" }],
  });

  const userResponse = lastmessagesOfUserChats
    .map((message) => message.messages[0])
    .filter(Boolean);

  res
    .status(StatusCodes.OK)
    .send({ status: "OK", message: "chats found", data: userResponse });
};

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const { receiverId } = req.body;

  if (!user || !receiverId) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "errror", message: "user not found" });
  }

  const currUser = await getUser({ id: user.uid });
  const receiver = await getUser({ id: receiverId });

  if (!receiver || !currUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "errror", message: "users not found" });
  }

  const checkChat = await prisma.chat.findFirst({
    where: {
      AND: [
        { users: { some: { user_id: currUser.id } } },
        { users: { some: { user_id: receiver.id } } },
      ],
    },
    select: {
      id: true,
      users: {
        select: {
          user: {
            select: {
              first_name: true,
            },
          },
        },
      },
    },
  });

  console.table(checkChat);

  if (checkChat)
    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "chat",
      data: { chat_id: checkChat?.id },
    });

  if (!checkChat) {
    const chat = await prisma.chat.create({
      data: {
        users: {
          create: [
            {
              user_id: currUser.id,
            },
            {
              user_id: receiver.id,
            },
          ] as UsersOnChats[],
        },
      },
    });

    console.log("Create a new chat ");
    console.table(chat);

    return res
      .status(StatusCodes.OK)
      .send({ status: "success", message: "chat", data: { chat_id: chat.id } });
  }

  return res
    .status(StatusCodes.OK)
    .send({ status: "success", message: "chat" });
};

const getChatMetadata = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { chat_id } = req.params;
  const { user } = req;

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ satus: "error", message: "User not found" });
  }

  const chatMetadata = await prisma.chat.findFirst({
    where: {
      id: chat_id,
      users: {
        some: {
          user_id: user.uid,
        },
      },
    },
    select: {
      id: true,
      users: {
        where: {
          NOT: [{ user_id: user.uid }],
        },
        select: {
          user: true,
        },
      },
      messages: {
        select: {
          id: true,
          text: true,
          chat_id: true,
          created_at: true,
		  image_url: true,
          sender: true,
          receiver: true,
          sender_id: true,
          receiver_id: true,
          isRead: true,
		  reply_to: true,
        },
        orderBy: {
          created_at: "desc",
        },
        // take: DEFAULT_MESSAGES_LIMIT,
      },
    },
  });

  // if user not found in chat response error;
  if (!chatMetadata) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "not found", message: "chat not found" });
  }

  const responseChatMetadata = {
    id: chatMetadata.id,
    receiver: chatMetadata.users[0].user,
    messages: chatMetadata.messages.reverse(),
  };

  return res.status(StatusCodes.OK).send({
    status: "OK",
    message: "chat found",
    data: { ...responseChatMetadata },
  });
};

export default { createChat, getUserChats, getChatMetadata };
