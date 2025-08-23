import express from 'express'

import {
    getSkills,
    addSkill,
    updateSkill,
    deleteSkill
} from '../controller/skillController.js';

import upload from '../middleware/upload.js';
import { validateCreateSkill, validateUpdateSkill } from '../middleware/skill.middleware.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', upload.single('icon'), validateCreateSkill, addSkill);
router.put('/:id', upload.single('icon'), validateUpdateSkill, updateSkill);
router.delete('/:id', deleteSkill);

export default router;