import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import uploadToGCS from "../googleStorageCloud/fileOperations/uploadToGCS";
import { v4 as uuid } from "uuid";
import prisma from "../../prisma";
import HttpError from "../error/HttpError";

const addNewPost = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
 if (!user) {
    return next(new HttpError("Permission denied", StatusCodes.BAD_REQUEST));
  }

  const { description } = req.body;
  const post = req.file;

  if (!post || !post.buffer) {
    return next(new HttpError("Post missing", StatusCodes.BAD_REQUEST));
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
      },
    });

    return res
      .status(StatusCodes.OK)
      .send({ status: "success", message: "post added", data: { ...newPost } });
  } catch (error) {
    return next( new HttpError("Server error", 500));
  }
};

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
   if (!user) {
    return next(new HttpError("Permission denied", StatusCodes.BAD_REQUEST));
  }

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      description: true,
      file_path: true,
      created_at: true,
      user_id: true,
      user: true,
      likes: true,
    },
    orderBy: [{ created_at: "desc" }],
  });

  const postsResponse = posts.map((post) => {
    const likes = post.likes.length;
    const isLiked = post.likes.some((like) => like.user_id === user.uid);

    return {
      ...post,
      likes,
      isLiked,
    };
  });

  return res
    .status(StatusCodes.OK)
    .send({
      status: "success",
      message: "posts found",
      data: [...postsResponse],
    });
};

export default { addNewPost, getPosts };
