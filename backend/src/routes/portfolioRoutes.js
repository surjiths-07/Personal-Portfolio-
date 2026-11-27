const express = require('express');
const {
  getProfile,
  updateProfile,
  downloadResume,
  getTimeline,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  getLikes,
  incrementLikes,
} = require('../controllers/portfolioController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', requireAuth, updateProfile);
router.get('/profile/resume', downloadResume);

router.get('/timeline', getTimeline);
router.post('/timeline', requireAuth, createTimelineItem);
router.put('/timeline/:id', requireAuth, updateTimelineItem);
router.delete('/timeline/:id', requireAuth, deleteTimelineItem);

router.get('/likes', getLikes);
router.post('/likes', incrementLikes);

module.exports = router;
