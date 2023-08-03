import { User, UsersOnChats } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";
import getUser from "../utils/isUser";
import { v4 } from "uuid";

const DEFAULT_MESSAGES_LIMIT = 20;

const getChatMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { receiverId } = req.params;
  const limit = req.query.limit as string;

  if (!user) {
    return next("User not auth");
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { sender_id: user.uid, receiver_id: receiverId },
        { receiver_id: user.uid, sender_id: receiverId },
      ],
    },
    orderBy: [
      {
        created_at: "asc",
      },
    ],
    take: limit ? parseInt(limit) : DEFAULT_MESSAGES_LIMIT,
  });

  console.log(messages);

  res.status(StatusCodes.OK).send({
    status: "success",
    message: "massages found",
    data: [...messages],
  });
};

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const { receiverId } = req.params;

  if (!user) {
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

  let chat = await prisma.chat.findFirst({
    where: {
      AND: [
        { users: { some: { user_id: currUser.id } } },
        { users: { some: { user_id: receiver.id } } },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!chat) {
    chat = await prisma.chat.create({
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
  }

  return res
    .status(StatusCodes.OK)
    .send({ status: "success", message: "chat", data: { chat_id: chat.id } });
};

const getChatMetadata = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const chat_id = req.params.chat_id as string;
  const limitMessages = req.query.limitMessages as string;

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "user not found" });
  }

  const chatInfo = await prisma.chat.findFirst({
    where: {
      id: chat_id,
    },
    select: {
      id: true,
      users: {
        where: {
          NOT: [{ user_id: user.uid }],
        },
        select: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              role: true,
              isOnline: true,
              created_at: true,
              profile: true,
            },
          },
        },
      },
      messages: {
        take: limitMessages ? parseInt(limitMessages) : DEFAULT_MESSAGES_LIMIT,
      },
    },
  });

  if (!chatInfo) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ satus: "not found", message: "chat not found" });
  }

	const recponseChatMetadata = {
		id: chatInfo.id,
		receiver: chatInfo.users[0].user,
		messages: chatInfo.messages,
	}

  res
    .status(StatusCodes.OK)
    .send({ status: "success", message: "chat found", data: { ...recponseChatMetadata} });
};

export default { getChatMessages, createChat, getChatMetadata };
