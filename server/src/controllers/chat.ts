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

  const userChats = await prisma.chat.findMany({
    where: {
      users: {
        some: { user_id: user.uid },
      },
    },
    select: {
      id: true,
      messages: {
        select: {
          id: true,
          text: true,
          sender: {
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				profile: true,
				created_at: true,
			}
		  },
          receiver: true,
		  sender_id: true,
		  receiver_id: true,
          created_at: true,
        },
        orderBy: [{ created_at: "desc" }],
        take: 1,
      },
    },
    take: 20,
  });

  const userChatsResponse = userChats.map((chat) => ({
    chat_id: chat.id,
    messages: chat.messages,
    //receiver: chat.users[0],
  }));

  res
    .status(StatusCodes.OK)
    .send({ status: "OK", message: "chats found", data: userChatsResponse });
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

export default { createChat, getUserChats };
