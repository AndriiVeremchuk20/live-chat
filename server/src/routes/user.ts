import { Router } from "express";
import UserControllers from "../controllers/user";

const router = Router();

router.get("/", UserControllers.getUserRecommendations);
router.get("/:id", UserControllers.getUserById);
router.post("/theme", UserControllers.setUserChoosedTheme);

export default router;
