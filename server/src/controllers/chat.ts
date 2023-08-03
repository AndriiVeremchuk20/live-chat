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

  // generate id for chat
//	const chat_id = v4();

 const chat = await prisma.chat.create({
    data: {
	//id: chat_id,
      users: {
        create: [
			{
				user_id: currUser.id,
//				chat_id: chat_id,
			},
			{
				user_id: receiver.id,
//				chat_id: chat_id,
			},
		] as UsersOnChats[],
      },
    },
  });

  return res
    .status(StatusCodes.OK)
    .send({ status: "success", message: "chat", data: { ...chat } });
};

export default { getChatMessages, createChat };
