import express from 'express'

import { verifyToken } from '../middleware/auth.js'

import { createProject, deleteProject, getProjects, updateProject } from '../controller/projectController.js';

const router = express.Router();

router.get('/', verifyToken , getProjects);
router.post('/', verifyToken , createProject);
router.delete('/:id', verifyToken , deleteProject);
router.put('/:id', verifyToken , updateProject);


export default router;