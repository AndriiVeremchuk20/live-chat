import { Router } from "express";
import ProfileControllers from "../controllers/profile";
import multer from "multer";

const router = Router();
const upload = multer(); // use for decode FormData 

router.post("/", upload.none(), ProfileControllers.completeProfile);

export default router;
