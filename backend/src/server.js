const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { testConnection } = require('./config/db');
const { ensureDatabaseReady } = require('./utils/initDb');
const { uploadsDir } = require('./middleware/upload');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const projectsRoutes = require('./routes/projectsRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

function getAllowedOrigins() {
  const configured = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const vercelOrigins = [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : '',
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '',
  ].filter(Boolean);

  const defaults = ['http://localhost:5173', 'http://127.0.0.1:5173'];
  return new Set([...configured, ...vercelOrigins, ...defaults]);
}

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = getAllowedOrigins();
      const allowVercelPreview =
        Boolean(process.env.VERCEL) &&
        !process.env.CORS_ORIGIN &&
        typeof origin === 'string' &&
        origin.endsWith('.vercel.app');

      if (!origin || allowedOrigins.has('*') || allowedOrigins.has(origin) || allowVercelPreview) {
        return callback(null, true);
      }
      const corsError = new Error('Not allowed by CORS policy');
      corsError.statusCode = 403;
      return callback(corsError);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Serve uploaded project images
app.use('/uploads', express.static(uploadsDir));

app.get('/api', (_req, res) => {
  res.json({
    success: true,
    service: 'Personal Portfolio API',
    health: '/api/health',
  });
});

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await testConnection();
    res.json({
      success: true,
      status: 'ok',
      database: 'connected',
      runtime: process.env.VERCEL ? 'vercel-serverless' : 'node-server',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(err.statusCode || 503).json({
      success: false,
      status: 'degraded',
      database: 'disconnected',
      message: err.message,
    });
  }
});

// REST API routes
app.use('/api/auth', authRoutes);
app.use('/api', portfolioRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await ensureDatabaseReady();
  } catch (err) {
    console.warn('[Startup Warning] Could not auto-initialize MySQL:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Portfolio backend server running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
