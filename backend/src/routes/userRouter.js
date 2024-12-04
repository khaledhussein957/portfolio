import express from "express";

import { deleteUser, updateUser } from "../controller/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.put("/:id",verifyToken, updateUser);
router.delete("/:id",verifyToken, deleteUser);


export default router;