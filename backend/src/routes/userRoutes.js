import express from "express";

import { deleteUser, getUser, updateUser, changePassword } from "../controller/userController.js";

import jwtAuth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { validateUpdateUser, validateChangePassword } from "../middleware/user.middleware.js";

const router = express.Router();

router.put("/update-profile",jwtAuth, upload.single("image"), validateUpdateUser, updateUser);

router.put("/update-password",jwtAuth, validateChangePassword, changePassword);

router.get("/",jwtAuth, getUser);

router.delete("/",jwtAuth, deleteUser);


export default router;