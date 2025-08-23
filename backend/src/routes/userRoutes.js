import express from "express";

import { deleteUser, getUser, updateUser, changePassword } from "../controller/userController.js";

import upload from "../middleware/upload.js";
import { validateUpdateUser, validateChangePassword } from "../middleware/user.middleware.js";

const router = express.Router();

router.put("/update-profile", upload.single("image"), validateUpdateUser, updateUser);

router.put("/update-password", validateChangePassword, changePassword);

router.get("/", getUser);

router.delete("/", deleteUser);


export default router;