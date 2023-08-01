import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";

const getChatMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { receiverId } = req.params;
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
    take: 10,
  });

  res
    .status(StatusCodes.OK)
    .send({
      status: "success",
      message: "massages found",
      data: [...messages],
    });
};

export default { getChatMessages };
