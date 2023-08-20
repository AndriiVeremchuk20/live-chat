import {Theme} from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../prisma";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const foundUser = await prisma.user.findFirstOrThrow({
      where: { id },
      select: {
        first_name: true,
        last_name: true,
        id: true,
        email: true,
        profile: true,
      },
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
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      created_at: true,
      profile: true,
    },
  });

  return res
    .status(StatusCodes.OK)
    .send({ status: "success", message: "users found", data: [...users] });
};

const setUserChoosedTheme = async(req: Request, res: Response, next: NextFunction)=>{
	const {user} = req;
	const {theme} = req.body;

	if(!user){
	return res.status(404).send({status: "error", message: "user not found"});
	}

	const choosedTheme = theme === "dark"?Theme.DARK:Theme.LIGHT;

	await prisma.user.update({
		where:{id: user.uid},
		data: {theme: choosedTheme},
	});

	res.status(201).send({status: "success", message: "theme update", data: {theme: choosedTheme}})
}

export default {
  getUserById,
  getUserRecommendations,
  setUserChoosedTheme,
};
