import express from 'express'

import jwtAuth from '../middleware/auth.js'
import upload from '../middleware/upload.js';
import { validateCreateProject, validateUpdateProject } from '../middleware/project.middleware.js';

import { createProject, deleteProject, getProjects, updateProject } from '../controller/projectController.js';

const router = express.Router();

router.get('/', jwtAuth, getProjects);
router.post('/', jwtAuth, upload.single('image'), validateCreateProject, createProject);
router.delete('/:id', jwtAuth, deleteProject);
router.put('/:id', jwtAuth, upload.single('image'), validateUpdateProject, updateProject);


export default router;