import { Router } from "express";
import ProfileControllers from "../controllers/profile";

const router = Router();

router.post("/", ProfileControllers.completeProfile);

export default router;
