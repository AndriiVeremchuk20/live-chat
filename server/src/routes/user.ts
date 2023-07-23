import { Router } from "express";
import UserControllers from "../controllers/user";

const router = Router();

router.get("/", UserControllers.getUserRecommendations);
router.get("/:id", UserControllers.getUserById);


export default router;
