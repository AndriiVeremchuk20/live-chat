import { Router } from "express";
import UserControllers from "../controllers/user";
import checkUser from "../middleware/checkUser";

const router = Router();

router.get("/", UserControllers.getUserRecommendations);
router.get("/search", UserControllers.searchUsers);
router.get("/:id", UserControllers.getUserById);

export default router;
