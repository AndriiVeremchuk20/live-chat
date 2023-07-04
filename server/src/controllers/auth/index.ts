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

route.get("/auth", verifyToken, (req, res) => {
  const { user } = req;
  if(user){
	const foundUser = prisma.user.findFirst({where: {uid: user.uid}});
	res.status(201).send({status: "", message: "", data: {...foundUser}})
  }
  return res.status(401).send({status: "", message: ""});
});

export default route;
