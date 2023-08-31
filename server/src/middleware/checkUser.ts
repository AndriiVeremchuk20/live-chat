import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "user not found" });
  }

  return next();
};

export default checkUser;
