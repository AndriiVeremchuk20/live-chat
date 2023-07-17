import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma";

const checkProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
const {user} = req;

const foundUser = prisma.user.findFirst({where: {uid: user?.uid}})

};
