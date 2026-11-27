const mysql = require('mysql2/promise');

function buildPoolConfig() {
  const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || '';
  const useSsl = String(process.env.DB_SSL || '').toLowerCase() === 'true';
  const isVercel = Boolean(process.env.VERCEL);

  if (!connectionUrl && isVercel && !process.env.DB_HOST) {
    return null;
  }

  const baseOptions = {
    waitForConnections: true,
    connectionLimit: isVercel ? 5 : 10,
    queueLimit: 0,
    connectTimeout: 10000,
    enableKeepAlive: true,
    charset: 'utf8mb4',
  };

  if (connectionUrl) {
    const parsed = new URL(connectionUrl);
    const dbName = parsed.pathname.replace(/^\/+/, '') || process.env.DB_NAME || 'portfolio_db';
    const sslMode = (parsed.searchParams.get('ssl-mode') || parsed.searchParams.get('ssl') || '').toLowerCase();
    const shouldUseSsl = useSsl || sslMode === 'required' || sslMode === 'true';

    const config = {
      ...baseOptions,
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: dbName,
    };

    if (shouldUseSsl) {
      config.ssl = {
        rejectUnauthorized: String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase() !== 'false',
      };
    }

    return config;
  }

  const config = {
    ...baseOptions,
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
  };

  if (useSsl) {
    config.ssl = {
      rejectUnauthorized: String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase() !== 'false',
    };
  }

  return config;
}

const poolConfig = buildPoolConfig();
const pool = poolConfig ? mysql.createPool(poolConfig) : null;

function ensurePoolConfigured() {
  if (!pool) {
    const err = new Error(
      'MySQL database is not configured. Set DATABASE_URL (or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME) in Vercel Environment Variables.'
    );
    err.statusCode = 503;
    throw err;
  }
  return pool;
}

const safePool = new Proxy(
  {},
  {
    get(_target, prop) {
      const activePool = ensurePoolConfigured();
      const value = activePool[prop];
      return typeof value === 'function' ? value.bind(activePool) : value;
    },
  }
);

async function testConnection() {
  const activePool = ensurePoolConfigured();
  const connection = await activePool.getConnection();
  try {
    await connection.query('SELECT 1');
    return true;
  } finally {
    connection.release();
  }
}

module.exports = { pool: safePool, testConnection, buildPoolConfig };
