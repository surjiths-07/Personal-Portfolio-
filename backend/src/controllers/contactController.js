const { pool } = require('../config/db');
const { cleanString, isValidEmail } = require('../utils/validators');

function looksLikeSpam(text) {
  const urlMatches = text.match(/https?:\/\/|www\./gi) || [];
  if (urlMatches.length > 3) return true;
  if (/(.)\1{14,}/.test(text)) return true;
  return false;
}

async function submitContactMessage(req, res, next) {
  try {
    // Honeypot check (invisible field in UI; bots often fill it)
    const honeypot = cleanString(req.body.website || req.body.company_hp, 200);
    if (honeypot) {
      return res.status(400).json({
        success: false,
        message: 'Submission rejected by spam filter.',
      });
    }

    const name = cleanString(req.body.name, 120);
    const email = cleanString(req.body.email, 160);
    const subject = cleanString(req.body.subject, 200);
    const message = cleanString(req.body.message, 4000);

    if (!name || name.length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide your name (at least 2 characters).' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!subject || subject.length < 3) {
      return res.status(400).json({ success: false, message: 'Please provide a subject (at least 3 characters).' });
    }
    if (!message || message.length < 10) {
      return res.status(400).json({ success: false, message: 'Please enter a message (at least 10 characters).' });
    }

    if (looksLikeSpam(`${subject} ${message}`)) {
      return res.status(400).json({
        success: false,
        message: 'Message flagged by basic spam protection. Please remove excessive links or repeated characters.',
      });
    }

    const ipAddress = cleanString(req.ip || req.socket?.remoteAddress || '', 64);

    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message, ip_address) VALUES (?, ?, ?, ?, ?)',
      [name, email, subject, message, ipAddress]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      data: {
        id: result.insertId,
        name,
        email,
        subject,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function getContactMessages(_req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
}

async function toggleMessageRead(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid message ID.' });
    }

    const isRead = req.body.is_read !== undefined ? (req.body.is_read ? 1 : 0) : null;
    if (isRead === null) {
      await pool.query('UPDATE contact_messages SET is_read = NOT is_read WHERE id = ?', [id]);
    } else {
      await pool.query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [isRead, id]);
    }

    const [rows] = await pool.query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    return next(err);
  }
}

async function deleteContactMessage(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid message ID.' });
    }

    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  submitContactMessage,
  getContactMessages,
  toggleMessageRead,
  deleteContactMessage,
};
