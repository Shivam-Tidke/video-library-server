import { Router } from "express";
import { registerCategory } from "../controllers/category.controller.js";


const router = Router()

router.route("/create").post(registerCategory)

export default router