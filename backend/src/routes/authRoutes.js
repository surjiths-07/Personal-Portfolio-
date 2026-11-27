const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, getMe, updatePassword } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes and try again.',
  },
});

router.post('/login', loginLimiter, login);
router.get('/me', requireAuth, getMe);
router.put('/password', requireAuth, updatePassword);

module.exports = router;
