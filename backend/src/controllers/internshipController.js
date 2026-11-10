const { body, param, query } = require('express-validator');
const Internship = require('../models/Internship');
const Organization = require('../models/Organization');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { analyseInternship } = require('../services/aiService');

const internshipValidation = [body('organization').isMongoId(), body('title').trim().isLength({ min: 2, max: 180 }), body('description').trim().isLength({ min: 20, max: 10000 }), body('workMode').optional().isIn(['REMOTE', 'ONSITE', 'HYBRID', 'UNSPECIFIED'])];

const createInternship = asyncHandler(async (req, res) => {
  if (!await Organization.exists({ _id: req.body.organization })) throw new AppError('Organization not found.', 404);
  const aiAnalysis = await analyseInternship(req.body);
  const internship = await Internship.create({ ...req.body, aiAnalysis });
  res.status(201).json({ internship });
});

const listInternships = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 12 } = req.query;
  const filter = q ? { $or: [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }, { recruiterEmail: new RegExp(q, 'i') }] } : {};
  const safeLimit = Math.min(50, Math.max(1, Number(limit)));
  const [internships, total] = await Promise.all([Internship.find(filter).populate('organization', 'name riskScore riskLevel verificationStatus').sort({ createdAt: -1 }).skip((Math.max(1, Number(page)) - 1) * safeLimit).limit(safeLimit), Internship.countDocuments(filter)]);
  res.json({ internships, pagination: { total, page: Number(page), limit: safeLimit, pages: Math.ceil(total / safeLimit) } });
});

const getInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id).populate('organization');
  if (!internship) throw new AppError('Internship not found.', 404);
  res.json({ internship });
});
module.exports = { createInternship, listInternships, getInternship, internshipValidation, idValidation: [param('id').isMongoId()], listValidation: [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 })] };
