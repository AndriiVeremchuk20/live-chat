import { Router } from "express";
import ProfileControllers from "../controllers/profile";
import multer from "multer";
import { storage } from "firebase-admin";

const router = Router();
const upload = multer(); // use for decode FormData

router.post("/", upload.single("avatar"), ProfileControllers.completeProfile);

export default router;
