const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { buildPoolConfig } = require('../config/db');

function stripDatabaseSetupStatements(sql) {
  return sql
    .replace(/^\s*CREATE\s+DATABASE\b[\s\S]*?;\s*/gim, '')
    .replace(/^\s*USE\s+`?[\w-]+`?\s*;\s*/gim, '');
}

async function ensureDatabaseReady() {
  const poolConfig = buildPoolConfig();
  if (!poolConfig) {
    throw new Error('MySQL configuration missing. Set DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.');
  }

  const dbName = poolConfig.database || 'portfolio_db';
  const schemaPath = path.join(__dirname, '..', '..', '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', '..', '..', 'database', 'seed.sql');

  let schemaSql = fs.readFileSync(schemaPath, 'utf8');
  let seedSql = fs.readFileSync(seedPath, 'utf8');

  if (dbName !== 'portfolio_db') {
    schemaSql = schemaSql.replace(/portfolio_db/g, dbName);
    seedSql = seedSql.replace(/portfolio_db/g, dbName);
  }

  const baseConnConfig = {
    host: poolConfig.host,
    port: poolConfig.port,
    user: poolConfig.user,
    password: poolConfig.password,
    multipleStatements: true,
    charset: 'utf8mb4',
    ...(poolConfig.ssl ? { ssl: poolConfig.ssl } : {}),
  };

  let connection;
  let connectedDirectlyToDb = false;

  try {
    connection = await mysql.createConnection(baseConnConfig);
    await connection.query(schemaSql);
    await connection.query(seedSql);
  } catch (err) {
    if (connection) {
      await connection.end().catch(() => {});
    }
    // Managed MySQL hosts often disallow CREATE DATABASE; connect directly to the provisioned database.
    connection = await mysql.createConnection({ ...baseConnConfig, database: dbName });
    connectedDirectlyToDb = true;
    await connection.query(stripDatabaseSetupStatements(schemaSql));
    await connection.query(stripDatabaseSetupStatements(seedSql));
  }

  try {
    const tableRef = connectedDirectlyToDb ? 'admin_users' : `\`${dbName}\`.admin_users`;
    const [existingAdmins] = await connection.query(`SELECT id FROM ${tableRef} LIMIT 1`);

    if (existingAdmins.length === 0) {
      const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@portfolio.local').trim();
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Portfolio2026!';
      const passwordHash = await bcrypt.hash(adminPassword, 12);

      await connection.query(
        `INSERT INTO ${tableRef} (username, email, password_hash) VALUES (?, ?, ?)`,
        [adminUsername, adminEmail, passwordHash]
      );
      console.log(`[DB Init] Created initial admin user: ${adminUsername}`);
    }

    console.log(`[DB Init] Database "${dbName}" is initialized and ready.`);
  } finally {
    if (connection) {
      await connection.end().catch(() => {});
    }
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
