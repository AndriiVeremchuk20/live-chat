import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import uploadToGCS from "../googleStorageCloud/fileOperations/uploadToGCS";
import { v4 as uuid } from "uuid";
import prisma from "../../prisma";

const addNewPost = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "user not found" });
  }

  const { description } = req.body;
  const post = req.file;

  if (!post || !post.buffer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ status: "error", message: "post missing" });
  }

  const fileUniqueName = uuid() + ".png";

  try {
    const postUrl = await uploadToGCS(post.buffer, "posts", fileUniqueName);
    const newPost = await prisma.post.create({
      data: {
        user_id: user.uid,
        file_path: postUrl as string,
        description: description ? description : null,
      },
	  select: {
		id: true,
		description: true,
		file_path: true,
		created_at: true,
		user_id: true,
		user: true, 
	  }
    });

    return res
      .status(StatusCodes.OK)
      .send({ status: "success", message: "post added", data: { ...newPost } });
  } catch (error) {
    return next(error);
  }
};

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "user not found" });
  }

  const posts = await prisma.post.findMany();

  return res.status(StatusCodes.OK).send({status: "success", message: "posts found", data: [...posts]});
};

export default { addNewPost, getPosts };
