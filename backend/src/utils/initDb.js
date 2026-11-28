const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { buildPoolConfig } = require('../config/db');

async function ensureDatabaseReady() {
  const poolConfig = buildPoolConfig();
  if (!poolConfig) {
    throw new Error(
      'PostgreSQL / Supabase configuration missing. Set DATABASE_URL (or POSTGRES_URL) in Environment Variables.'
    );
  }

  const schemaPath = path.join(__dirname, '..', '..', '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', '..', '..', 'database', 'seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  const pool = new Pool(poolConfig);

  try {
    await pool.query(schemaSql);
    await pool.query(seedSql);

    const { rows: existingAdmins } = await pool.query('SELECT id FROM admin_users LIMIT 1');

    if (existingAdmins.length === 0) {
      const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@portfolio.local').trim();
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Portfolio2026!';
      const passwordHash = await bcrypt.hash(adminPassword, 12);

      await pool.query(
        'INSERT INTO admin_users (username, email, password_hash) VALUES ($1, $2, $3)',
        [adminUsername, adminEmail, passwordHash]
      );
      console.log(`[DB Init] Created initial admin user: ${adminUsername}`);
    }

    console.log('[DB Init] PostgreSQL / Supabase database is initialized and ready.');
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  ensureDatabaseReady()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('[DB Init Error]', err.message);
      process.exit(1);
    });
}

module.exports = { ensureDatabaseReady };
