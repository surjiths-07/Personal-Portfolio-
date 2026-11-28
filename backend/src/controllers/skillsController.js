const { pool } = require('../config/db');
const { cleanString } = require('../utils/validators');

async function getSkills(_req, res, next) {
  try {
    const { rows } = await pool.query('SELECT * FROM skills ORDER BY sort_order ASC, id ASC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
}

async function createSkill(req, res, next) {
  try {
    const name = cleanString(req.body.name, 100);
    const category = cleanString(req.body.category, 100);
    const icon = cleanString(req.body.icon, 60) || 'code';
    const sort_order = Number(req.body.sort_order || 0);

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Skill name and category are required.',
      });
    }

    const { rows } = await pool.query(
      'INSERT INTO skills (name, category, icon, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, icon, sort_order]
    );

    return res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    return next(err);
  }
}

async function updateSkill(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid skill ID.' });
    }

    const name = cleanString(req.body.name, 100);
    const category = cleanString(req.body.category, 100);
    const icon = cleanString(req.body.icon, 60) || 'code';
    const sort_order = Number(req.body.sort_order || 0);

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Skill name and category are required.',
      });
    }

    const { rows, rowCount } = await pool.query(
      'UPDATE skills SET name = $1, category = $2, icon = $3, sort_order = $4 WHERE id = $5 RETURNING *',
      [name, category, icon, sort_order, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    return next(err);
  }
}

async function deleteSkill(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid skill ID.' });
    }

    const { rowCount } = await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    return res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
