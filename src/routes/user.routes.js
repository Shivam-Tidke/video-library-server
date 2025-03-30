import { Router } from "express";
import { GetallUsers, registerUser } from "../controllers/user.controller.js";

const router = Router()



router.route("/register").post(registerUser)
router.route("/").get(GetallUsers)
export default router


