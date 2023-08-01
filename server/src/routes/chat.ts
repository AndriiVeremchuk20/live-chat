import { Router } from "express";
import ChatControllers from "../controllers/chat"

const router = Router();


router.get("/:reseiverId", ChatControllers.getChatMessages);

export default router;
