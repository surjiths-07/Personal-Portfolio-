const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  submitContactMessage,
  getContactMessages,
  toggleMessageRead,
  deleteContactMessage,
} = require('../controllers/contactController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact submissions from your IP. Please try again later.',
  },
});

router.post('/', contactLimiter, submitContactMessage);
router.get('/', requireAuth, getContactMessages);
router.patch('/:id/read', requireAuth, toggleMessageRead);
router.delete('/:id', requireAuth, deleteContactMessage);

module.exports = router;
