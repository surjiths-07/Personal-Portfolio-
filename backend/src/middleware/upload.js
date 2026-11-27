const fs = require('fs');
const os = require('os');
const path = require('path');
const multer = require('multer');

const isServerless = Boolean(process.env.VERCEL);
const uploadsDir = isServerless
  ? path.join(os.tmpdir(), 'portfolio-uploads')
  : path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const baseName =
      path
        .basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'project-image';
    cb(null, `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error('Only PNG, JPG, WEBP, and GIF image files are allowed.');
      error.statusCode = 400;
      return cb(error);
    }
    return cb(null, true);
  },
});

module.exports = { upload, uploadsDir };
