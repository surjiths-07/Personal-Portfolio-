function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function getSafeErrorDetails(err) {
  const code = err?.code || '';

  if (err?.statusCode && err.statusCode < 500) {
    return { statusCode: err.statusCode, message: err.message || 'Bad request.' };
  }

  if (err?.statusCode === 503) {
    return { statusCode: 503, message: err.message };
  }

  if (
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    code === 'ECONNRESET' ||
    code === 'ENETUNREACH'
  ) {
    return {
      statusCode: 503,
      message: 'Cannot reach the PostgreSQL / Supabase database. Verify DATABASE_URL, SSL, and network access.',
    };
  }

  if (code === '28P01' || code === '28000') {
    return {
      statusCode: 503,
      message: 'PostgreSQL / Supabase authentication failed. Verify your DATABASE_URL credentials.',
    };
  }

  if (code === '42P01' || code === '3D000') {
    return {
      statusCode: 503,
      message: 'PostgreSQL tables are not initialized. Set AUTO_INIT_DB=true or run database/schema.sql.',
    };
  }

  if (code === '23505') {
    return {
      statusCode: 409,
      message: 'A record with this unique value already exists.',
    };
  }

  const statusCode = err.statusCode || (err.name === 'MulterError' ? 400 : 500);
  const message =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected server error occurred.'
      : err.message || 'An unexpected server error occurred.';

  return { statusCode, message };
}

function errorHandler(err, _req, res, _next) {
  const { statusCode, message } = getSafeErrorDetails(err);

  if (statusCode >= 500) {
    console.error('[Server Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { notFoundHandler, errorHandler };
