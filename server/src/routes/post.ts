import { Router, Request } from "express";
import multer, { FileFilterCallback } from "multer";
import PostControllers from "../controllers/post";

const router = Router();

const uploadPost = multer({
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

// add a new post
router.post("/", uploadPost.single("post"), PostControllers.addNewPost);
router.get("/", PostControllers.getPosts);
export default router;
