import { Request, Response, NextFunction } from "express";
import {StatusCodes} from "http-status-codes";

const completeProfile = async(req: Request, res:Response) => {

	const {user} = req;
	if(user){
		const {first_name, last_name, age, country, gender, partner_gender, about_self, about_partner} = req.body;
		if(first_name && last_name && age && country&& gender&& partner_gender&& about_self&&about_partner){
			console.log("all done");
			return res.status(StatusCodes.OK).send({status: "success", message: "normas"});
		}
		else{
			console.log(req.body)
		}

	}
	
	return res.status(StatusCodes.NOT_FOUND).send({status: "error", message: "User not identified"})
}

export default {
	completeProfile,
}
