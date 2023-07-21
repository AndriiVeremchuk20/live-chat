import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import cloudBucket from "../googleStorageCloud";
import { format } from "util";
import { v4 as uuid } from "uuid";
import prisma from "../../prisma";
import getGender from "../utils/getGender";

const completeProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  if (user) {
    let avatarStorageUrl: string | null = null;

    // check user
    const foundUser = await prisma.user.findFirst({ where: { id: user.uid } });
    if (!foundUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ status: "error", message: "user not found, try again later" });
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

    // callback to create a new user profile, after uploading avatar
    const addProfile = async () => {
      //adding user profile to DB
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

      // if user update their first or last name, update this fields
      if (
        foundUser?.first_name !== first_name &&
        foundUser?.last_name !== last_name
      ) {
        await prisma.user.update({
          where: { id: foundUser.id },
          data: { first_name, last_name },
        });
      }

      // add user profile to database
      const userProfile = await prisma.profile.create({
        data: {
          user_id: foundUser.id,
          avatar_path: avatarStorageUrl,
          age: parseInt(age),
          gender: getGender(gender),
          partner_gender: getGender(partner_gender),
          country,
          about_self,
          about_partner,
        },
      });

      return res.status(StatusCodes.OK).send({
        status: "success",
        message: "Profile added",
        data: { ...userProfile },
      });
    };

    //if the user did not send the file, just add profile info
    // check type of the file, (file must be "image" type)
    const newAvatar = req.file;

    // uploading avatar file and save image url
    if (newAvatar) {
      const fileUID = uuid();
      const fileFormat = newAvatar.originalname.split(".").reverse()[0];

      const blob = cloudBucket.file(`avatars/${fileUID}.${fileFormat}`);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.log(err);
      });

      blobStream.on("finish", async () => {
        // The public URL can be used to directly access the file via HTTP.
        avatarStorageUrl = format(
          `https://storage.googleapis.com/${cloudBucket.name}/${blob.name}`
        );

        //console.log(avatarStorageUrl);
        await addProfile();
      });

      blobStream.end(newAvatar.buffer);
    } else {
      await addProfile();
    }
  } else
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "User not identified" });
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (user) {
    let avatarStorageUrl: string | null = null;

    // check user
    const foundUser = await prisma.user.findFirst({ where: { id: user.uid } });
    if (!foundUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ status: "error", message: "user not found, try again later" });
    }

    //check profile
    const foundUserProfile = await prisma.profile.findFirst({
      where: { user_id: user.uid },
    });
    if (!foundUserProfile) {
      return res
        .status(StatusCodes.CONFLICT)
        .send({ status: "error", message: "Please create profile" });
    }

    // callback to update user profile, after uploading avatar
    const updateProfile = async () => {
      //update user profile in DB
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

      // if user update their first or last name, update this fields
      if (
        foundUser?.first_name !== first_name &&
        foundUser?.last_name !== last_name
      ) {
        await prisma.user.update({
          where: { id: foundUser.id },
          data: { first_name, last_name },
        });
      }

      // add user profile to database
      const userProfile = await prisma.profile.update({
        where: { user_id: user.uid },
        data: {
          user_id: foundUser.id,
          avatar_path: avatarStorageUrl,
          age: parseInt(age),
          gender: getGender(gender),
          partner_gender: getGender(partner_gender),
          country,
          about_self,
          about_partner,
        },
      });

      return res.status(StatusCodes.OK).send({
        status: "success",
        message: "Profile update",
        data: { ...userProfile },
      });
    };

    //if the user did not send the file, just update profile info
    // check type of the file, (file must be "image" type)
    const newAvatar = req.file;

    // uploading avatar file and save image url
    if (newAvatar) {
      const fileUID = uuid();
      const fileFormat = newAvatar.originalname.split(".").reverse()[0];

      const blob = cloudBucket.file(`avatars/${fileUID}.${fileFormat}`);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.log(err);
      });

      blobStream.on("finish", async () => {
        // The public URL can be used to directly access the file via HTTP.
        avatarStorageUrl = format(
          `https://storage.googleapis.com/${cloudBucket.name}/${blob.name}`
        );

        //console.log(avatarStorageUrl);
        await updateProfile();
      });

      blobStream.end(newAvatar.buffer);
    } else {
      await updateProfile();
    }
  } else
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ status: "error", message: "User not identified" });
};

export default {
  completeProfile,
  updateProfile,
};
