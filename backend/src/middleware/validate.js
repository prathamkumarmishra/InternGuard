const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return next(new AppError('Please correct the highlighted fields.', 422, result.array()));
  next();
};
