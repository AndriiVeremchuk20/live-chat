import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const foundUser = await prisma.user.findFirstOrThrow({ where: { id } });
    
	const foundUserProfile = await prisma.profile.findFirst({where: {user_id: id}});

	return res.status(StatusCodes.OK).send({
      status: "success",
      message: "user found",
      data: { ...foundUser, profile: {...foundUserProfile} },
    });
  } catch (error) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "User not found" });
  }
};

const getUserRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "Error", message: "user not authorized" });
  }

  const users = await prisma.user.findMany({
    where: { NOT: { id: user.uid } },
  });

	return res.status(StatusCodes.OK).send({status: "success", message: "users found", data: [...users]})
};

export default {
  getUserById,
  getUserRecommendations,
};
