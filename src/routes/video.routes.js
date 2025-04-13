import { Router } from "express";
import { DeleteVideo, EditVideo, GetAllVideos, GetVideoById, registerVideo } from "../controllers/video.controller.js";

const router = Router()


router.route("/register").post(registerVideo)
router.route("/").get(GetAllVideos)
router.route("/delete-video/:id").delete(DeleteVideo)
router.route("/get-video/:id").get(GetVideoById)
router.route("/edit-video/:id").put(EditVideo)


export default router