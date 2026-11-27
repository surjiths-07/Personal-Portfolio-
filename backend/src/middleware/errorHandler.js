function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || (err.name === 'MulterError' ? 400 : 500);
  const message =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected server error occurred.'
      : err.message || 'An unexpected server error occurred.';

  if (statusCode >= 500) {
    console.error('[Server Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { notFoundHandler, errorHandler };
