import express from 'express'

import {
    getSkills,
    addSkill,
    updateSkill,
    deleteSkill
} from '../controller/skillController.js';
import jwtAuth from '../middleware/auth.js';

const router = express.Router();

router.get('/', jwtAuth , getSkills);
router.post('/', jwtAuth , addSkill);
router.put('/:id', jwtAuth , updateSkill);
router.delete('/:id', jwtAuth , deleteSkill);

export default router;