import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import cloudBucket from "../googleStorageCloud";
import { format } from "util";
import { v4 as uuid } from "uuid";
import prisma from "../../prisma";
import getGender from "../utils/getGender";
import uploadToGCS from "../googleStorageCloud/fileOperations/uploadToGCS";

const completeProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "User not identified" });
  }

  //check profile
  const foundUserProfile = await prisma.profile.findFirst({
    where: { user_id: user.uid },
  });
  if (foundUserProfile) {
    return res
      .status(StatusCodes.CONFLICT)
      .send({ status: "error", message: "profile alredy create" });
  }

  const newAvatar = req.file;

  const {
    first_name,
    last_name,
    age,
    gender,
    partner_gender,
    country,
    about_self,
    about_partner,
  } = req.body;

  let avatar_path: string | null = null;

  if (newAvatar && newAvatar.buffer) {
    const filename = `${uuid()}.${
      newAvatar.originalname.split(".").reverse()[0]
    }`;
    try {
      avatar_path = (await uploadToGCS(
        newAvatar.buffer,
        "avatars",
        filename
      )) as string;
    } catch (error) {
      console.log(error);
      avatar_path = null;
    }
  }

  await prisma.user.update({
    where: { id: user.uid },
    data: { first_name, last_name, avatar_path },
  });

  // add user profile to database
  const userProfile = await prisma.profile.create({
    data: {
      user_id: user.uid,
      age: parseInt(age),
      gender: getGender(gender),
      partner_gender: getGender(partner_gender),
      country,
      about_self,
      about_partner,
    },
    select: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          created_at: true,
          avatar_path: true,
          profile: true,
          chats: {
            select: {
              chat_id: true,
            },
          },
        },
      },
    },
  });

  return res.status(StatusCodes.OK).send({
    status: "success",
    message: "Profile added",
    data: {
      ...userProfile.user,
      chats: userProfile.user.chats.map((chat) => chat.chat_id),
    },
  });
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "User not identified" });
  }

  //check profile
  const foundUserProfile = await prisma.profile.findFirst({
    where: { user_id: user.uid },
  });
  if (!foundUserProfile) {
    return res.status(StatusCodes.CONFLICT).send({
      status: "error",
      message: "profile not created, please crate your profile",
    });
  }

  const newAvatar = req.file;

  const {
    first_name,
    last_name,
    age,
    gender,
    partner_gender,
    country,
    about_self,
    about_partner,
  } = req.body;

  let avatar_path: string | null = null;

  if (newAvatar && newAvatar.buffer) {
    const filename = `${uuid()}.${
      newAvatar.originalname.split(".").reverse()[0]
    }`;
    try {
      avatar_path = (await uploadToGCS(
        newAvatar.buffer,
        "avatars",
        filename
      )) as string;
    } catch (error) {
      console.log(error);
      avatar_path = null;
    }
  }

  await prisma.user.update({
    where: { id: user.uid },
    data: { first_name, last_name, avatar_path },
  });

  // update user profile
  const userProfile = await prisma.profile.update({
    where: {
      user_id: user.uid,
    },
    data: {
      user_id: user.uid,
      age: parseInt(age),
      gender: getGender(gender),
      partner_gender: getGender(partner_gender),
      country,
      about_self,
      about_partner,
    },
    select: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          created_at: true,
          avatar_path: true,
          profile: true,
          chats: {
            select: {
              chat_id: true,
            },
          },
        },
      },
    },
  });

  return res.status(StatusCodes.OK).send({
    status: "success",
    message: "Profile update",
    data: {
      ...userProfile.user,
      chats: userProfile.user.chats.map((chat) => chat.chat_id),
    },
  });
};

export default {
  completeProfile,
  updateProfile,
};
