// middlevare for decoded firebase token
import { Request, Response, NextFunction } from "express";
import fireAuth from "../firebase";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization; //get header

  if (header && header.startsWith("Bearer ")) {
    const idToken = header.split("Bearer ")[1]; // get token
    try {
      const decodedToken = await fireAuth.verifyIdToken(idToken); // verifyToken
      console.log(decodedToken.email + "\n");
	  req.user = decodedToken;
    } catch (error) {
      console.log(error);
    }
  }

  return next();
};

export default verifyToken;
