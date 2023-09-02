import { Router } from "express";
import UserControllers from "../controllers/user";
import PostRoute from "./post";
import checkUser from "../middleware/checkUser";

const router = Router();

router.use("/post", PostRoute);

router.get("/", UserControllers.getUserRecommendations);
router.get("/search", UserControllers.searchUsers);
router.get("/:id", UserControllers.getUserById);

export default router;
