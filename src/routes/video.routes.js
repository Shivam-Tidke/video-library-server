import { Router } from "express";
import { registerVideo } from "../controllers/video.controller.js";

const router = Router()


router.route("/register").post(registerVideo)
export default router