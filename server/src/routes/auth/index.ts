import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import prisma from "../../../prisma";

const route = Router();

// route for testing path
route.get("/test", (req, res) => {
  res.status(200).send("done");
});

route.post("/registration", async (req, res, next) => {
  //get fields from request body
  const { first_name, last_name, email, password } = req.body;

  //try add a new user into bd
  const createdUser = await prisma.user.create({
    data: {
      first_name,
      last_name,
      email,
      password,
    },
  });

  console.log(`!!! CREATED A NEW USER ${createdUser}`);

  res.status(204).send(`REGISTRATION SUCCESSFUL`);
});

export default route;
