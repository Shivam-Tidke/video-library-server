import { Router } from "express";
import { loginAdmin, logoutAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middlewares.js";

const router = Router()

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(verifyAdminJWT, logoutAdmin)


export default router