const express = require('express');
const {
  getProjects,
  getProjectBySlugOrId,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
} = require('../controllers/projectsController');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/', getProjects);
router.get('/:slugOrId', getProjectBySlugOrId);

router.post('/upload', requireAuth, upload.single('image'), uploadProjectImage);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

module.exports = router;
