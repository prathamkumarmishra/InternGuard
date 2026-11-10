const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const registerValidation = [body('fullName').trim().isLength({ min: 2, max: 100 }), body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8, max: 128 }), body('role').optional().isIn(['STUDENT', 'ORGANIZATION'])];
const loginValidation = [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()];

function tokenFor(user) { return jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn }); }

const register = asyncHandler(async (req, res) => {
  if (await User.exists({ email: req.body.email })) throw new AppError('An account with this email already exists.', 409);
  const user = await User.create({ fullName: req.body.fullName, email: req.body.email, password: req.body.password, role: req.body.role || 'STUDENT' });
  res.status(201).json({ token: tokenFor(user), user });
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) throw new AppError('Email or password is incorrect.', 401);
  if (!user.isActive) throw new AppError('Your account is unavailable.', 401);
  res.json({ token: tokenFor(user), user: user.toJSON() });
});

const me = asyncHandler(async (req, res) => res.json({ user: req.user }));
module.exports = { register, login, me, registerValidation, loginValidation };
