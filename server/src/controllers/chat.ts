import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma";

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const {receiverId} = req.params;
  if (!user) {
    return next("User not auth");
  }
  const chat = await prisma.chat.findFirst({where: {}})

};

export default { createChat };
