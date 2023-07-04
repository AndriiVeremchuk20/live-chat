import { Router } from "express";
import prisma from "../../../prisma";
import checkSimilarEmails from "../../middleware/checkEmail";

const route = Router();

// route for testing path
route.get("/test", (req, res) => {
  res.status(200).send("done");
});

route.post("/registration", checkSimilarEmails, async (req, res, next) => {
  //get fields from request body
  const { first_name, last_name, email, uid } = req.body;

  //try add a new user into bd
  const createdUser = await prisma.user.create({
    data: {
      first_name,
      last_name,
      email,
	  uid
    },
  });

  console.info(`[!!!] CREATED A NEW USER ${createdUser}`);

  res.status(201).send({status: "success", message: `REGISTRATION SUCCESSFUL`});
});

export default route;
