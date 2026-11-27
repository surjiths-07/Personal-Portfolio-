const { pool } = require('../config/db');
const {
  cleanString,
  parseJsonArray,
  serializeJsonArray,
  slugify,
  isValidUrlOrPath,
} = require('../utils/validators');

function formatProject(row) {
  return {
    ...row,
    is_featured: Boolean(row.is_featured),
    screenshots: parseJsonArray(row.screenshots),
    technologies: parseJsonArray(row.technologies),
    features: parseJsonArray(row.features),
    objectives: parseJsonArray(row.objectives),
    future_enhancements: parseJsonArray(row.future_enhancements),
  };
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug;
  let counter = 1;
  while (true) {
    const query = excludeId
      ? 'SELECT id FROM projects WHERE slug = ? AND id != ? LIMIT 1'
      : 'SELECT id FROM projects WHERE slug = ? LIMIT 1';
    const params = excludeId ? [candidate, excludeId] : [candidate];
    const [rows] = await pool.query(query, params);
    if (rows.length === 0) return candidate;
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }
}

async function getProjects(req, res, next) {
  try {
    const category = cleanString(req.query.category, 100);
    const featured = req.query.featured;

    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params = [];

    if (category && category.toLowerCase() !== 'all') {
      sql += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    if (featured === 'true' || featured === '1') {
      sql += ' AND is_featured = 1';
    }

    sql += ' ORDER BY is_featured DESC, sort_order ASC, id DESC';
    const [rows] = await pool.query(sql, params);
    return res.json({ success: true, data: rows.map(formatProject) });
  } catch (err) {
    return next(err);
  }
}

async function getProjectBySlugOrId(req, res, next) {
  try {
    const param = cleanString(req.params.slugOrId, 160);
    const isNumeric = /^\d+$/.test(param);

    const [rows] = await pool.query(
      isNumeric ? 'SELECT * FROM projects WHERE id = ? LIMIT 1' : 'SELECT * FROM projects WHERE slug = ? LIMIT 1',
      [isNumeric ? Number(param) : param]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.json({ success: true, data: formatProject(rows[0]) });
  } catch (err) {
    return next(err);
  }
}

function validateProjectPayload(body) {
  const title = cleanString(body.title, 200);
  const short_description = cleanString(body.short_description || body.description, 500);
  const description = cleanString(body.description || body.short_description, 5000);
  const category = cleanString(body.category, 180);
  const image = cleanString(body.image, 255) || '/images/codegen-cover.png';
  const github_url = cleanString(body.github_url, 255);
  const demo_url = cleanString(body.demo_url, 255);

  if (!title || !description || !category) {
    return { error: 'Project title, description, and category are required.' };
  }

  if (!isValidUrlOrPath(image) || !isValidUrlOrPath(github_url) || !isValidUrlOrPath(demo_url)) {
    return { error: 'Project image, GitHub URL, or Demo URL has an invalid format.' };
  }

  const screenshots = parseJsonArray(body.screenshots);
  const normalizedScreenshots = screenshots.length > 0 ? screenshots : [image];

  return {
    payload: {
      title,
      short_description,
      description,
      category,
      image,
      screenshots: JSON.stringify(normalizedScreenshots),
      technologies: serializeJsonArray(body.technologies),
      features: serializeJsonArray(body.features),
      problem_statement: cleanString(body.problem_statement, 3000),
      proposed_solution: cleanString(body.proposed_solution, 3000),
      objectives: serializeJsonArray(body.objectives),
      future_enhancements: serializeJsonArray(body.future_enhancements),
      github_url,
      demo_url,
      is_featured: body.is_featured ? 1 : 0,
      sort_order: Number(body.sort_order || 0),
    },
  };
}

async function createProject(req, res, next) {
  try {
    const { error, payload } = validateProjectPayload(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const requestedSlug = cleanString(req.body.slug, 150) || payload.title;
    const slug = await ensureUniqueSlug(slugify(requestedSlug));

    const [result] = await pool.query(
      `INSERT INTO projects (
        slug, title, short_description, description, category, image, screenshots,
        technologies, features, problem_statement, proposed_solution, objectives,
        future_enhancements, github_url, demo_url, is_featured, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        payload.title,
        payload.short_description,
        payload.description,
        payload.category,
        payload.image,
        payload.screenshots,
        payload.technologies,
        payload.features,
        payload.problem_statement,
        payload.proposed_solution,
        payload.objectives,
        payload.future_enhancements,
        payload.github_url,
        payload.demo_url,
        payload.is_featured,
        payload.sort_order,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    return res.status(201).json({ success: true, data: formatProject(rows[0]) });
  } catch (err) {
    return next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const [existingRows] = await pool.query('SELECT id, slug FROM projects WHERE id = ? LIMIT 1', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const { error, payload } = validateProjectPayload(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const requestedSlug = cleanString(req.body.slug, 150) || existingRows[0].slug || payload.title;
    const slug = await ensureUniqueSlug(slugify(requestedSlug), id);

    await pool.query(
      `UPDATE projects SET
        slug = ?, title = ?, short_description = ?, description = ?, category = ?,
        image = ?, screenshots = ?, technologies = ?, features = ?,
        problem_statement = ?, proposed_solution = ?, objectives = ?,
        future_enhancements = ?, github_url = ?, demo_url = ?, is_featured = ?, sort_order = ?
      WHERE id = ?`,
      [
        slug,
        payload.title,
        payload.short_description,
        payload.description,
        payload.category,
        payload.image,
        payload.screenshots,
        payload.technologies,
        payload.features,
        payload.problem_statement,
        payload.proposed_solution,
        payload.objectives,
        payload.future_enhancements,
        payload.github_url,
        payload.demo_url,
        payload.is_featured,
        payload.sort_order,
        id,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    return res.json({ success: true, data: formatProject(rows[0]) });
  } catch (err) {
    return next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    return next(err);
  }
}

function uploadProjectImage(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please select an image file to upload.',
    });
  }

  return res.status(201).json({
    success: true,
    imageUrl: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
}

module.exports = {
  getProjects,
  getProjectBySlugOrId,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
};
