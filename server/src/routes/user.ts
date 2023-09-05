import { Router } from "express";
import UserControllers from "../controllers/user";
import PostRoute from "./post";
import LikeRoure from "./postLikes";

const router = Router();

router.use("/post", PostRoute);
router.use("/like", LikeRoure);

router.get("/", UserControllers.getUserRecommendations);
router.get("/search", UserControllers.searchUsers);
router.get("/:id", UserControllers.getUserById);

export default router;
