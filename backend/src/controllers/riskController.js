const { body, param, query } = require('express-validator');
const Organization = require('../models/Organization');
const Internship = require('../models/Internship');
const RiskAssessment = require('../models/RiskAssessment');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { createRiskAssessment, disclaimer } = require('../services/riskService');

const assessmentValidation = [body('organizationId').isMongoId(), body('internshipId').optional({ values: 'falsy' }).isMongoId(), body('description').optional().isString().isLength({ max: 10000 }), body('recruiterEmail').optional({ values: 'falsy' }).isEmail(), body('recruiterPhone').optional({ values: 'falsy' }).isString().isLength({ max: 40 }), body('websiteAnalysis').optional().isObject()];

const assess = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.body.organizationId);
  if (!organization) throw new AppError('Organization not found.', 404);
  const internship = req.body.internshipId ? await Internship.findById(req.body.internshipId) : null;
  if (req.body.internshipId && !internship) throw new AppError('Internship not found.', 404);
  const result = await createRiskAssessment({ organization, internship, websiteAnalysis: req.body.websiteAnalysis, description: req.body.description, recruiterEmail: req.body.recruiterEmail, recruiterPhone: req.body.recruiterPhone, requestedBy: req.user._id });
  res.status(201).json({ ...result, disclaimer });
});

const listHistory = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const [assessments, total] = await Promise.all([
    RiskAssessment.find({ requestedBy: req.user._id })
      .populate('organization', 'name riskScore riskLevel')
      .populate('internship', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    RiskAssessment.countDocuments({ requestedBy: req.user._id })
  ]);
  res.json({ assessments, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
});

const getByOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.organizationId);
  if (!organization) throw new AppError('Organization not found.', 404);
  const assessments = await RiskAssessment.find({ organization: organization._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ organization: { id: organization._id, name: organization.name, riskScore: organization.riskScore, riskLevel: organization.riskLevel }, assessments, disclaimer });
});

module.exports = {
  assess,
  listHistory,
  getByOrganization,
  assessmentValidation,
  historyValidation: [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 })],
  idValidation: [param('organizationId').isMongoId()]
};
