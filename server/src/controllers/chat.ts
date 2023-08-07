import { User, UsersOnChats } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";
import getUser from "../utils/isUser";

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
    return res
      .status(StatusCodes.OK)
      .send({
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

export default { createChat };
