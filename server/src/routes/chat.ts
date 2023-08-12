import { Router } from "express";
import ChatControllers from "../controllers/chat";

const router = Router();

router.get("/", ChatControllers.getUserChats);
router.post("/", ChatControllers.createChat);
router.get("/:chat_id", ChatControllers.getChatMetadata);

export default router;
