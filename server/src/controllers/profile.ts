import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const completeProfile = async (req: Request, res: Response) => {
  const { user } = req;
	//console.log(req.body);
	//console.log(req.headers["content-type"])
  if (user) {
    //console.log("body = ", req.body);
	//console.log("files = ", req.file);
   
	// check type of the file, (file must be "image" type)
	const newAvatar = req.file;

	// uploading avatar file and gtting image url
	

	//adding user profile to Db

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
