const { pool } = require('../config/db');
const {
  cleanString,
  isValidEmail,
  isValidUrlOrPath,
  parseJsonArray,
  serializeJsonArray,
} = require('../utils/validators');
const { generateResumePdf } = require('../utils/resumePdf');

const ALLOWED_TIMELINE_TYPES = new Set([
  'education',
  'internship',
  'work',
  'certification',
  'achievement',
]);

async function getProfile(_req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM portfolio_profile ORDER BY id ASC LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Portfolio profile not found.' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    return next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const full_name = cleanString(req.body.full_name, 120);
    const professional_title = cleanString(req.body.professional_title, 200);
    const availability_badge = cleanString(req.body.availability_badge, 120);
    const is_available = req.body.is_available ? 1 : 0;
    const short_intro = cleanString(req.body.short_intro, 2000);
    const about_intro = cleanString(req.body.about_intro, 3000);
    const development_journey = cleanString(req.body.development_journey, 3000);
    const education_summary = cleanString(req.body.education_summary, 2000);
    const areas_of_interest = cleanString(req.body.areas_of_interest, 2000);
    const career_goals = cleanString(req.body.career_goals, 2000);
    const github_url = cleanString(req.body.github_url, 255);
    const linkedin_url = cleanString(req.body.linkedin_url, 255);
    const email = cleanString(req.body.email, 150);
    const location = cleanString(req.body.location, 120);
    const resume_url = cleanString(req.body.resume_url, 255) || '/api/profile/resume';
    const profile_image = cleanString(req.body.profile_image, 255) || '/images/hero-developer.png';

    if (!full_name || !professional_title || !short_intro) {
      return res.status(400).json({
        success: false,
        message: 'Full name, professional title, and short intro are required.',
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    if (
      !isValidUrlOrPath(github_url) ||
      !isValidUrlOrPath(linkedin_url) ||
      !isValidUrlOrPath(resume_url) ||
      !isValidUrlOrPath(profile_image)
    ) {
      return res.status(400).json({ success: false, message: 'Invalid URL format in profile links.' });
    }

    const [existing] = await pool.query('SELECT id FROM portfolio_profile ORDER BY id ASC LIMIT 1');
    if (existing.length === 0) {
      await pool.query(
        `INSERT INTO portfolio_profile (
          full_name, professional_title, availability_badge, is_available,
          short_intro, about_intro, development_journey, education_summary,
          areas_of_interest, career_goals, github_url, linkedin_url, email,
          location, resume_url, profile_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          full_name,
          professional_title,
          availability_badge,
          is_available,
          short_intro,
          about_intro,
          development_journey,
          education_summary,
          areas_of_interest,
          career_goals,
          github_url,
          linkedin_url,
          email,
          location,
          resume_url,
          profile_image,
        ]
      );
    } else {
      await pool.query(
        `UPDATE portfolio_profile SET
          full_name = ?, professional_title = ?, availability_badge = ?, is_available = ?,
          short_intro = ?, about_intro = ?, development_journey = ?, education_summary = ?,
          areas_of_interest = ?, career_goals = ?, github_url = ?, linkedin_url = ?, email = ?,
          location = ?, resume_url = ?, profile_image = ?
        WHERE id = ?`,
        [
          full_name,
          professional_title,
          availability_badge,
          is_available,
          short_intro,
          about_intro,
          development_journey,
          education_summary,
          areas_of_interest,
          career_goals,
          github_url,
          linkedin_url,
          email,
          location,
          resume_url,
          profile_image,
          existing[0].id,
        ]
      );
    }

    const [updated] = await pool.query('SELECT * FROM portfolio_profile ORDER BY id ASC LIMIT 1');
    return res.json({ success: true, data: updated[0] });
  } catch (err) {
    return next(err);
  }
}

async function downloadResume(_req, res, next) {
  try {
    const [[profileRows], [skills], [projectRows], [timeline]] = await Promise.all([
      pool.query('SELECT * FROM portfolio_profile ORDER BY id ASC LIMIT 1'),
      pool.query('SELECT name, category FROM skills ORDER BY sort_order ASC, id ASC'),
      pool.query('SELECT title, category, short_description, description, technologies FROM projects ORDER BY is_featured DESC, sort_order ASC, id ASC'),
      pool.query('SELECT section_type, title, organization, period, description FROM timeline_items ORDER BY sort_order ASC, id ASC'),
    ]);

    const profile = profileRows[0] || {
      full_name: 'Surjith',
      professional_title: 'Full Stack Developer | AI Enthusiast',
      short_intro: 'Full Stack Developer specializing in React, Node.js, Express, and MySQL.',
    };

    const projects = projectRows.map((p) => ({
      ...p,
      technologies: parseJsonArray(p.technologies),
    }));

    const pdfBuffer = generateResumePdf({ profile, skills, projects, timeline });
    const safeName = (profile.full_name || 'Developer').replace(/[^a-zA-Z0-9_-]+/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}_Resume.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    return next(err);
  }
}

async function getTimeline(_req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM timeline_items ORDER BY sort_order ASC, id ASC');
    const data = rows.map((row) => ({
      ...row,
      highlights: parseJsonArray(row.highlights),
    }));
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
}

async function createTimelineItem(req, res, next) {
  try {
    const section_type = cleanString(req.body.section_type, 40).toLowerCase();
    const title = cleanString(req.body.title, 200);
    const organization = cleanString(req.body.organization, 200);
    const period = cleanString(req.body.period, 100);
    const location = cleanString(req.body.location, 120);
    const description = cleanString(req.body.description, 2500);
    const highlights = serializeJsonArray(req.body.highlights);
    const sort_order = Number(req.body.sort_order || 0);

    if (!ALLOWED_TIMELINE_TYPES.has(section_type) || !title || !organization || !period || !description) {
      return res.status(400).json({
        success: false,
        message: 'Valid section_type, title, organization, period, and description are required.',
      });
    }

    const [result] = await pool.query(
      `INSERT INTO timeline_items (section_type, title, organization, period, location, description, highlights, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [section_type, title, organization, period, location, description, highlights, sort_order]
    );

    const [rows] = await pool.query('SELECT * FROM timeline_items WHERE id = ?', [result.insertId]);
    const item = rows[0];
    return res.status(201).json({
      success: true,
      data: { ...item, highlights: parseJsonArray(item.highlights) },
    });
  } catch (err) {
    return next(err);
  }
}

async function updateTimelineItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid timeline item ID.' });
    }

    const section_type = cleanString(req.body.section_type, 40).toLowerCase();
    const title = cleanString(req.body.title, 200);
    const organization = cleanString(req.body.organization, 200);
    const period = cleanString(req.body.period, 100);
    const location = cleanString(req.body.location, 120);
    const description = cleanString(req.body.description, 2500);
    const highlights = serializeJsonArray(req.body.highlights);
    const sort_order = Number(req.body.sort_order || 0);

    if (!ALLOWED_TIMELINE_TYPES.has(section_type) || !title || !organization || !period || !description) {
      return res.status(400).json({
        success: false,
        message: 'Valid section_type, title, organization, period, and description are required.',
      });
    }

    const [result] = await pool.query(
      `UPDATE timeline_items
       SET section_type = ?, title = ?, organization = ?, period = ?, location = ?, description = ?, highlights = ?, sort_order = ?
       WHERE id = ?`,
      [section_type, title, organization, period, location, description, highlights, sort_order, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Timeline item not found.' });
    }

    const [rows] = await pool.query('SELECT * FROM timeline_items WHERE id = ?', [id]);
    return res.json({
      success: true,
      data: { ...rows[0], highlights: parseJsonArray(rows[0].highlights) },
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteTimelineItem(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid timeline item ID.' });
    }

    const [result] = await pool.query('DELETE FROM timeline_items WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Timeline item not found.' });
    }

    return res.json({ success: true, message: 'Timeline item deleted.' });
  } catch (err) {
    return next(err);
  }
}

async function getLikes(_req, res, next) {
  try {
    const [rows] = await pool.query('SELECT likes_count FROM portfolio_likes WHERE id = 1 LIMIT 1');
    const likes = rows.length > 0 ? Number(rows[0].likes_count) : 0;
    return res.json({ success: true, likes });
  } catch (err) {
    return next(err);
  }
}

async function incrementLikes(_req, res, next) {
  try {
    await pool.query(
      'INSERT INTO portfolio_likes (id, likes_count) VALUES (1, 1) ON DUPLICATE KEY UPDATE likes_count = likes_count + 1'
    );
    const [rows] = await pool.query('SELECT likes_count FROM portfolio_likes WHERE id = 1 LIMIT 1');
    const likes = rows.length > 0 ? Number(rows[0].likes_count) : 1;
    return res.json({ success: true, likes });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  downloadResume,
  getTimeline,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  getLikes,
  incrementLikes,
};
