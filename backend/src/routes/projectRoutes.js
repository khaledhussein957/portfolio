import express from 'express'

import upload from '../middleware/upload.js';
import { validateCreateProject, validateUpdateProject } from '../middleware/project.middleware.js';

import { createProject, deleteProject, getProjects, updateProject } from '../controller/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', upload.single('image'), validateCreateProject, createProject);
router.delete('/:id', deleteProject);
router.put('/:id', upload.single('image'), validateUpdateProject, updateProject);


export default router;