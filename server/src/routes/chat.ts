import { Router } from "express";
import ChatControllers from "../controllers/chat"

const router = Router();


router.get("/:reseiverId", ChatControllers.createChat);
router.get("/messages/:reseiverId", ChatControllers.getChatMessages);

export default router;
