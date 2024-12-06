import express from 'express'

import jwtAuth from '../middleware/auth.js'

import { createProject, deleteProject, getProjects, updateProject } from '../controller/projectController.js';

const router = express.Router();

router.get('/', jwtAuth , getProjects);
router.post('/', jwtAuth , createProject);
router.delete('/:id', jwtAuth , deleteProject);
router.put('/:id', jwtAuth , updateProject);


export default router;