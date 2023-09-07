import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";
import HttpError from "../error/HttpError";

const getPostLikes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    if (!user) {
      return next(new HttpError("Permission denied", StatusCodes.BAD_REQUEST));
    }

    const post_id = req.params.post_id as string;

    console.log(post_id);

    const likedUsers = await prisma.like.findMany({
      where: {
        post_id,
      },
      select: {
        user: true,
      },
    });

    const likedUsersResponse = likedUsers.map((user) => user.user);

    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "users found",
      data: [...likedUsersResponse],
    });
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }
};

export default { getPostLikes };
