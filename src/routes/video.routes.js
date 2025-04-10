import { Router } from "express";
import { GetAllVideos, registerVideo } from "../controllers/video.controller.js";

const router = Router()


router.route("/register").post(registerVideo)
router.route("/").get(GetAllVideos)
export default router