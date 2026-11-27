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

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
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

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await testConnection();
    res.json({
      success: true,
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
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
