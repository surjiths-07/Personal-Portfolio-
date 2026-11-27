const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

async function ensureDatabaseReady() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'portfolio_db';
  const useSsl = String(process.env.DB_SSL || '').toLowerCase() === 'true';

  const connectionConfig = {
    host,
    port,
    user,
    password,
    multipleStatements: true,
    charset: 'utf8mb4',
  };

  if (useSsl) {
    connectionConfig.ssl = {
      rejectUnauthorized: String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase() !== 'false',
    };
  }

  const connection = await mysql.createConnection(connectionConfig);

  try {
    const schemaPath = path.join(__dirname, '..', '..', '..', 'database', 'schema.sql');
    const seedPath = path.join(__dirname, '..', '..', '..', 'database', 'seed.sql');

    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    let seedSql = fs.readFileSync(seedPath, 'utf8');

    if (dbName !== 'portfolio_db') {
      schemaSql = schemaSql.replace(/portfolio_db/g, dbName);
      seedSql = seedSql.replace(/portfolio_db/g, dbName);
    }

    await connection.query(schemaSql);
    await connection.query(seedSql);

    // Ensure at least one admin account exists with a bcrypt-hashed password
    const [existingAdmins] = await connection.query(
      `SELECT id FROM \`${dbName}\`.admin_users LIMIT 1`
    );

    if (existingAdmins.length === 0) {
      const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@portfolio.local').trim();
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Portfolio2026!';
      const passwordHash = await bcrypt.hash(adminPassword, 12);

      await connection.query(
        `INSERT INTO \`${dbName}\`.admin_users (username, email, password_hash) VALUES (?, ?, ?)`,
        [adminUsername, adminEmail, passwordHash]
      );
      console.log(`[DB Init] Created initial admin user: ${adminUsername}`);
    }

    console.log(`[DB Init] Database "${dbName}" is initialized and ready.`);
  } finally {
    await connection.end();
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
