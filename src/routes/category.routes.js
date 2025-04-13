import { Router } from "express";
import { getAllCategories, registerCategory } from "../controllers/category.controller.js";


const router = Router()

router.route("/create").post(registerCategory)
router.route("/").get(getAllCategories)

export default router