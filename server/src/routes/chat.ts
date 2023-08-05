import { Router } from "express";
import ChatControllers from "../controllers/chat"

const router = Router();


router.post("/create_chat/", ChatControllers.createChat);
router.get("/metadata/:chat_id", ChatControllers.getChatMetadata);
//router.get("/messages/:reseiverId", ChatControllers.getChatMessages);

export default router;
