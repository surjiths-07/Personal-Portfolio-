const fs = require('fs');
const path = require('path');
const multer = require('multer');

const isServerless = Boolean(process.env.VERCEL);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (!isServerless && !cloudinaryConfigured && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const diskStorage = multer.diskStorage({
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

// Vercel's function request limit is 4.5 MB. Keep the file limit below it to
// leave room for multipart/form-data overhead. Local disk uploads remain 5 MB.
const storage = isServerless || cloudinaryConfigured
  ? multer.memoryStorage()
  : diskStorage;

const upload = multer({
  storage,
  limits: {
    fileSize: isServerless ? 4 * 1024 * 1024 : 5 * 1024 * 1024,
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
