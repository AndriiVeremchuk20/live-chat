import { Router } from "express";
import prisma from "../../../prisma";
import checkSimilarEmails from "../../middleware/checkEmail";
import verifyToken from "../../middleware/verifyToken";

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
    .status(201)
    .send({ status: "success", message: `REGISTRATION SUCCESSFUL` });
});

route.get("/auth", verifyToken, async(req, res) => {
  const { user } = req;
  //console.log(user);
  if (user) {
    try {
      const foundUser = await prisma.user.findFirstOrThrow({ where: { uid: user.uid } });
      return res.status(200).send({
        status: "success",
        message: "auth success",
        data: { ...foundUser },
      });
    } catch (error) {
      console.log(error);
	  return res.status(404).send({status: "error", message: "user not found, try later"})
    }
  }
  return res
    .status(401)
    .send({ status: "error", message: "permission denied" });
});

export default route;
