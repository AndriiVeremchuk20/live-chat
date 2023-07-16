import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import cloudBucket from "../googleStorageCloud";
import {format} from "util"

const completeProfile = async (req: Request, res: Response) => {
  const { user } = req;
  //console.log(req.body);
  //console.log(req.headers["content-type"])
  if (user) {
    //console.log("body = ", req.body);
    //console.log("files = ", req.file);

    //if the user did not send the file, just add profile info

    // check type of the file, (file must be "image" type)
    const newAvatar = req.file;

    // uploading avatar file and gtting image url
    if (req.file) {
      const blob = cloudBucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.log(err);
      });

      blobStream.on("finish", () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = format(
          `https://storage.googleapis.com/${cloudBucket.name}/${blob.name}`
        );
        //return res.status(200).json({ publicUrl });
      });

      blobStream.end(req.file.buffer);
      console.log(req.file);
    }
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
