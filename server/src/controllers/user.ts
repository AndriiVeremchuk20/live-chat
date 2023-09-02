import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const foundUser = await prisma.user.findFirstOrThrow({
      where: { id },
    });

    return res.status(StatusCodes.OK).send({
      status: "success",
      message: "user found",
      data: { ...foundUser },
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

  return res
    .status(StatusCodes.OK)
    .send({ status: "success", message: "users found", data: [...users] });
};

const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const query = req.query.query as string;

  if (!query) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      status: "error",
      message: "bad request, missing query params" + query,
    });
  }

  const foundUsers = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.uid,
      },
      OR: [
        {
          first_name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          last_name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  return res.status(StatusCodes.OK).send({
    status: "success",
    message: "search result",
    data: [...foundUsers],
  });
};

export default {
  getUserById,
  getUserRecommendations,
  searchUsers,
};
