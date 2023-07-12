import { Router } from "express";
import prisma from "../../../prisma";
import checkSimilarEmails from "../../middleware/checkEmail";
import verifyToken from "../../middleware/verifyToken";
import { StatusCodes } from "http-status-codes";

const route = Router();

// route for testing path
route.get("/test", (req, res) => {
  res.status(200).send("done");
});

route.post("/registration", checkSimilarEmails, async (req, res, next) => {
  //get fields from request body
  const { first_name, last_name, email, uid } = req.body;

  console.log(req.body);

  //try add a new user into bd
  const createdUser = await prisma.user.create({
    data: {
      first_name,
      last_name,
      email,
      uid,
    },
  });

  console.info(`[!!!] CREATED A NEW USER ${createdUser}`);

  res
    .status(StatusCodes.CREATED)
    .send({ status: "success", message: `REGISTRATION SUCCESSFUL` });
});

route.get("/auth", verifyToken, async (req, res) => {
  const { user } = req;
  //console.log(user);
  if (user) {
    try {
      const foundUser = await prisma.user.findFirstOrThrow({
        where: { uid: user.uid },
      });
      return res.status(StatusCodes.OK).send({
        status: "success",
        message: "auth success",
        data: { ...foundUser },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ status: "error", message: "user not found, try later" });
    }
  }
  return res
    .status(401)
    .send({ status: "error", message: "permission denied" });
});

route.get("/google-auth", verifyToken, async (req, res) => {
  const { user } = req;

  if (user) {
    const checkUser = await prisma.user.findFirst({
      where: { uid: user?.uid },
    });

    if (checkUser) {
      // user auth
      return res.status(StatusCodes.OK).send({
        status: "success",
        message: "auth with google success",
        data: { ...checkUser },
      });
    } else {
      // create a new user
      const newUser = await prisma.user.create({
        data: {
          first_name: user?.name.split(" ")[0] as string,
          last_name: user?.name.split(" ")[1] as string,
          email: user?.email as string,
          uid: user?.uid as string,
        },
      });

      return res.status(StatusCodes.CREATED).send({
        status: "success",
        message: "auth with google success",
        data: { ...newUser },
      });
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).send({ status: "error", message: "auth error, try later" });
  }
});

export default route;
