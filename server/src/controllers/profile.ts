import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const completeProfile = async (req: Request, res: Response) => {
  const { user } = req;
	console.log(req.body);
	//console.log(req.headers["content-type"])
  if (user) {
    console.log("body = ", req.body);
	console.log("files = ", req.file);
    return res
      .status(StatusCodes.OK)
      .send({ status: "success", message: "normas" });
  }

  return res
    .status(StatusCodes.NOT_FOUND)
    .send({ status: "error", message: "User not identified" });
};

export default {
  completeProfile,
};
