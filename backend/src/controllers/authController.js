const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { getJwtSecret } = require('../middleware/auth');
const { cleanString } = require('../utils/validators');

async function login(req, res, next) {
  try {
    const identifier = cleanString(req.body.username || req.body.email, 160);
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/email and password are required.',
      });
    }

    const { rows } = await pool.query(
      'SELECT id, username, email, password_hash FROM admin_users WHERE username = $1 OR email = $2 LIMIT 1',
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, email, created_at FROM admin_users WHERE id = $1 LIMIT 1',
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      });
    }

    return res.json({
      success: true,
      admin: rows[0],
    });
  } catch (err) {
    return next(err);
  }
}

async function updatePassword(req, res, next) {
  try {
    const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';

    if (!currentPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required and new password must be at least 8 characters.',
      });
    }

    const { rows } = await pool.query(
      'SELECT id, password_hash FROM admin_users WHERE id = $1 LIMIT 1',
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin user not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [newHash, req.admin.id]);

    return res.json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { login, getMe, updatePassword };
