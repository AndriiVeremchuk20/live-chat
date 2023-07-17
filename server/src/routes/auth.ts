
import { Router } from "express";
import checkSimilarEmailsMiddleware from "../middleware/checkEmail";
import verifyTokenMiddleware from "../middleware/verifyToken";
import authController from "../controllers/auth";


const route = Router();

route.get("/auth", verifyTokenMiddleware, authController.auth);
route.get("/google-auth", verifyTokenMiddleware, authController.authWithGoogle);
route.post("/registration", checkSimilarEmailsMiddleware, authController.registration);

export default route;
