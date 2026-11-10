const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} was not found.`, 404));
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  if (process.env.NODE_ENV !== 'test' && status >= 500) console.error(err);
  res.status(status).json({
    error: { message: status === 500 ? 'An unexpected server error occurred.' : err.message, details: err.details }
  });
}

module.exports = { notFound, errorHandler };
