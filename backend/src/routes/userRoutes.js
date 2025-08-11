import express from "express";

import { deleteUser, getUser, updateUser, changePassword } from "../controller/userController.js";
import jwtAuth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.put("/update-profile",jwtAuth, upload.single("image"), updateUser);

router.put("/update-password",jwtAuth, changePassword);

router.get("/",jwtAuth, getUser);

router.delete("/",jwtAuth, deleteUser);


export default router;