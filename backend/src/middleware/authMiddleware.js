const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) throw new AppError('Authentication is required.', 401);
  const payload = jwt.verify(auth.slice(7), env.jwtSecret);
  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new AppError('Your account is unavailable.', 401);
  req.user = user;
  next();
});

const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(new AppError('You do not have access to this resource.', 403));
  next();
};

module.exports = { authenticate, allowRoles };
