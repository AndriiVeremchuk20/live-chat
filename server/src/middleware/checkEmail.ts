import { Request, Response, NextFunction } from "express"
import prisma from "../../prisma";

// Middleware to check if the user's email is unique
// before creating a new user

const checkSimilarEmails = async (req:Request, res: Response, next: NextFunction) => {
	const {email} = req.body; // get email from request body

	const userWithEmail = await prisma.user.findFirst({where: {
	email
	}}); // try search user with email

	if(userWithEmail){ // if user found return error message
		return res.status(409).send({status: "error", message: `user with email ${email} alredy exist, try login in your account`});
	}
	return next();
}

export default checkSimilarEmails;
