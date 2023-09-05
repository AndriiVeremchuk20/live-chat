import { Router, Request } from "express";
import LikeControllers from "../controllers/postLikes";

const router = Router();

router.get("/:post_id", LikeControllers.getPostLikes);
export default router;
