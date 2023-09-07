import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma";
import checkSimilarEmails from "../middleware/checkEmail";
import verifyToken from "../middleware/verifyToken";
import { StatusCodes } from "http-status-codes";
import logger from "../logger";
import HttpError from "../error/HttpError";

const registration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { first_name, last_name, email, uid } = req.body;

  console.log(req.body);

  //add a new user into bd
  const createdUser = await prisma.user.create({
    data: {
      id: uid,
      first_name,
      last_name,
      email,
    },
  });

  logger.info(`[!!!] CREATED A NEW USER ${createdUser}`);

  res
    .status(StatusCodes.CREATED)
    .send({ status: "success", message: `REGISTRATION SUCCESSFUL` });
};

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (!user) {
    return next(new HttpError("Permission denied", StatusCodes.BAD_REQUEST));
  }

  try {
    const foundUser = await prisma.user.findFirstOrThrow({
      where: { id: user.uid },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        created_at: true,
        avatar_path: true,
        profile: true,
        chats: {
          select: {
            chat_id: true,
          },
        },
      },
    });

    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "auth success",
      data: {
        ...foundUser,
        chats: foundUser.chats.map((chat) => chat.chat_id),
      },
    });
  } catch (error) {
    return next(new HttpError("User not found", StatusCodes.NOT_FOUND));
  }
};

const authWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //add middleware to check auth type
  const { user } = req;
  if (!user) {
    return next(new HttpError("Permission denied", StatusCodes.BAD_REQUEST));
  }

  const checkUser = await prisma.user.findFirst({
    where: { id: user.uid },
  });

  if (checkUser) {
    // user auth
    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "auth with google success",
      data: { ...checkUser },
    });
  } else {
    // create a new user
    const newUser = await prisma.user.create({
      data: {
        id: user.uid,
        first_name: user?.name.split(" ")[0] as string,
        last_name: user?.name.split(" ")[1] as string,
        email: user.email as string,
      },
    });

    return res.status(StatusCodes.CREATED).send({
      status: "success",
      message: "auth with google success",
      data: { ...newUser },
    });
  }
};

export default { auth, authWithGoogle, registration };
