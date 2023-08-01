import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";

const DEFAULT_MESSAGES_LIMIT = 20;

const getChatMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { receiverId } = req.params;
  const limit  = req.query.limit as string;

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
    take: limit? parseInt(limit):DEFAULT_MESSAGES_LIMIT,
  });

  console.log(messages);

  res.status(StatusCodes.OK).send({
    status: "success",
    message: "massages found",
    data: [...messages],
  });
};

export default { getChatMessages };
