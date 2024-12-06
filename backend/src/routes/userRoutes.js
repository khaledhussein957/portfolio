import express from "express";

import { deleteUser, updateUser } from "../controller/userController.js";
import jwtAuth from "../middleware/auth.js";

const router = express.Router();

router.put("/:id",jwtAuth, updateUser);
router.delete("/:id",jwtAuth, deleteUser);


export default router;