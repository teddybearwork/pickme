import { logger } from '../index.js';

export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  } else if (err.code === '23505') { // PostgreSQL unique violation
    statusCode = 409;
    message = 'Resource already exists';
    code = 'DUPLICATE_RESOURCE';
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Referenced resource not found';
    code = 'FOREIGN_KEY_ERROR';
  } else if (err.code === '23502') { // PostgreSQL not null violation
    statusCode = 400;
    message = 'Required field missing';
    code = 'REQUIRED_FIELD_MISSING';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
  }

  res.status(statusCode).json({
    error: message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};