import { Router } from "express";
import ChatControllers from "../controllers/chat"

const router = Router();


router.post("/", ChatControllers.createChat);

export default router;
