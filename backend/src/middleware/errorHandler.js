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

  if (code === 'ECONNREFUSED' || code === 'ETIMEDOUT' || code === 'ENOTFOUND' || code === 'ECONNRESET') {
    return {
      statusCode: 503,
      message: 'Cannot reach the MySQL database. Verify DATABASE_URL / DB_HOST, port, SSL, and network access.',
    };
  }

  if (code === 'ER_ACCESS_DENIED_ERROR') {
    return {
      statusCode: 503,
      message: 'MySQL authentication failed. Verify DB_USER and DB_PASSWORD (or DATABASE_URL).',
    };
  }

  if (code === 'ER_NO_SUCH_TABLE' || code === 'ER_BAD_DB_ERROR') {
    return {
      statusCode: 503,
      message: 'MySQL database or tables are not initialized. Set AUTO_INIT_DB=true or run npm run db:init.',
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
