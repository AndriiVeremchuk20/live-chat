import { Router, Request } from "express";
import ProfileController from "../controllers/profile";
import multer, { FileFilterCallback } from "multer";

const router = Router();
const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(file.originalname);

    if (mimetype && extname) {
      return cb(null, true);
    }

    return cb(new Error("invalud file format"));
  },
}); // use for decode FormData

router.post(
  "/",
  uploadAvatar.single("avatar"),
  ProfileController.completeProfile
);
router.put("/", uploadAvatar.single("avatar"), ProfileController.updateProfile);

export default router;
