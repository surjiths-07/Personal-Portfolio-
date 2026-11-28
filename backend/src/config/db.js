const { Pool } = require('pg');

function buildPoolConfig() {
  const connectionUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL ||
    '';

  const isVercel = Boolean(process.env.VERCEL);
  const sslEnv = String(process.env.DB_SSL || '').toLowerCase();

  if (!connectionUrl && isVercel && !process.env.PGHOST && !process.env.DB_HOST) {
    return null;
  }

  const baseOptions = {
    max: isVercel ? 5 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };

  if (connectionUrl) {
    const parsed = new URL(connectionUrl);
    const isLocalHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    const disableSsl = sslEnv === 'false' || parsed.searchParams.get('sslmode') === 'disable';

    const config = {
      ...baseOptions,
      connectionString: connectionUrl,
    };

    if (!disableSsl && (!isLocalHost || sslEnv === 'true' || isVercel)) {
      config.ssl = {
        rejectUnauthorized: String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'false').toLowerCase() === 'true',
      };
    }

    return config;
  }

  const host = process.env.PGHOST || process.env.DB_HOST || '127.0.0.1';
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';
  const disableSsl = sslEnv === 'false';

  const config = {
    ...baseOptions,
    host,
    port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
    user: process.env.PGUSER || process.env.DB_USER || 'postgres',
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.PGDATABASE || process.env.DB_NAME || 'postgres',
  };

  if (!disableSsl && (!isLocalHost || sslEnv === 'true' || isVercel)) {
    config.ssl = {
      rejectUnauthorized: String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'false').toLowerCase() === 'true',
    };
  }

  return config;
}

const poolConfig = buildPoolConfig();
const pool = poolConfig ? new Pool(poolConfig) : null;

function ensurePoolConfigured() {
  if (!pool) {
    const err = new Error(
      'PostgreSQL / Supabase database is not configured. Set DATABASE_URL (or POSTGRES_URL) in Vercel Environment Variables.'
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
  await activePool.query('SELECT 1');
  return true;
}

module.exports = { pool: safePool, testConnection, buildPoolConfig };
