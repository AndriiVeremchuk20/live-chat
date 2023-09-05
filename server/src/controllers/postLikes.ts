import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";

const getPostLikes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    if (!user) {
      throw new Error("access denied");
    }

    const post_id = req.params.post_id as string;
	
	console.log(post_id);

    const usersWhoLiked = await prisma.like.findMany({
      where: {
        post_id,
      },
      select: {
        user: true,
      },
    });

	console.log(usersWhoLiked);

    return res
      .status(StatusCodes.OK)
      .send({
        status: "success",
        message: "users found",
        data: [...usersWhoLiked],
      });
  } catch (error) {
    next(error);
  }
};

export default { getPostLikes };
