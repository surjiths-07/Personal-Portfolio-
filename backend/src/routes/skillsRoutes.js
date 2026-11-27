const express = require('express');
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillsController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSkills);
router.post('/', requireAuth, createSkill);
router.put('/:id', requireAuth, updateSkill);
router.delete('/:id', requireAuth, deleteSkill);

module.exports = router;
