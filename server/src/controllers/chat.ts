import {User} from "@prisma/client";
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
  const { receiverId } = req.params;

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "errror", message: "user not found" });
  }

  const currUser = await getUser({ id: user.uid });
  const receiver = await getUser({ id: receiverId });

  if (!receiverId&&!currUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "errror", message: "users not found" });
  }

  let chat = await prisma.chat.findFirst({
    where: {
      AND: [
        { users: { some: { id: currUser?.id } } },
        { users: { some: { id: receiver?.id } } },
      ],
    },
  });

  // if chat not found create a new chat
  if(!chat){
	chat = await prisma.chat.create({
		users: [currUser, receiver]
	})
  }

  return res.status(StatusCodes.OK).send({status: "success", message: "chat found/create", data: {...chat}});
};

export default { getChatMessages, createChat };
