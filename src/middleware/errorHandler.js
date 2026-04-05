'use strict';

const multer = require('multer');

/**
 * Centralized Express error-handling middleware.
 * Must be registered AFTER all routes (4-argument signature).
 *
 * Handles:
 *  - Multer-specific errors (file size exceeded, too many files, etc.)
 *  - Custom upload validation errors (INVALID_FILE_TYPE)
 *  - Generic application errors
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Multer built-in errors (e.g. LIMIT_FILE_SIZE)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Custom file-type rejection from fileFilter
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // 404 – resource not found
  if (err.status === 404) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: err.message || 'Resource not found',
      },
    });
  }

  // Generic server error — mask details in production
  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  return res.status(status).json({
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  });
}

module.exports = errorHandler;
