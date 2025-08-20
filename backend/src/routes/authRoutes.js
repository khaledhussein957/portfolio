import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
} from "../controller/authController.js";

import jwtAuth from "../middleware/auth.js";
import { validateRegisterUser, validateLogin } from "../middleware/user.middleware.js";


const router = express.Router();

router.get("/check-auth", jwtAuth, checkAuth);

router.post("/signup", validateRegisterUser, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
