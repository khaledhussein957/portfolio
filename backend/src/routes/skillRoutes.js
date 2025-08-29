import express from 'express'

import {
    getSkills,
    addSkill,
    updateSkill,
    deleteSkill
} from '../controller/skillController.js';

import upload from '../middleware/upload.js';
import jwtAuth from "../middleware/auth.js";
import { validateCreateSkill, validateUpdateSkill } from '../middleware/skill.middleware.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', jwtAuth, upload.single('icon'), validateCreateSkill, addSkill);
router.put('/:id', jwtAuth, upload.single('icon'), validateUpdateSkill, updateSkill);
router.delete('/:id', jwtAuth, deleteSkill);

export default router;