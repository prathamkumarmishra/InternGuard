const { body, param, query } = require('express-validator');
const Organization = require('../models/Organization');
const Internship = require('../models/Internship');
const Complaint = require('../models/Complaint');
const RiskAssessment = require('../models/RiskAssessment');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const organizationValidation = [body('name').trim().isLength({ min: 2, max: 160 }), body('website').optional({ values: 'falsy' }).isURL({ protocols: ['http', 'https'], require_protocol: true }), body('officialEmail').optional({ values: 'falsy' }).isEmail(), body('state').optional().trim().isLength({ max: 80 })];

const createOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.create({ ...req.body, cin: req.body.cin?.toUpperCase(), verificationStatus: 'PENDING' });
  res.status(201).json({ organization });
});

const listOrganizations = asyncHandler(async (req, res) => {
  const { q, riskLevel, state, registrationStatus, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (riskLevel) filter.riskLevel = riskLevel;
  if (state) filter.state = state;
  if (registrationStatus) filter['registration.status'] = registrationStatus;
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { cin: new RegExp(q, 'i') }, { website: new RegExp(q, 'i') }, { officialEmail: new RegExp(q, 'i') }];
  const safeLimit = Math.min(50, Math.max(1, Number(limit)));
  const [organizations, total] = await Promise.all([Organization.find(filter).sort({ riskScore: -1, updatedAt: -1 }).skip((Math.max(1, Number(page)) - 1) * safeLimit).limit(safeLimit), Organization.countDocuments(filter)]);
  res.json({ organizations, pagination: { total, page: Number(page), limit: safeLimit, pages: Math.ceil(total / safeLimit) } });
});

const getOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) throw new AppError('Organization not found.', 404);
  const [internships, complaintSummary, assessments] = await Promise.all([
    Internship.find({ organization: organization._id }).sort({ createdAt: -1 }).limit(10),
    Complaint.aggregate([{ $match: { organization: organization._id } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
    RiskAssessment.find({ organization: organization._id }).sort({ createdAt: -1 }).limit(5)
  ]);
  res.json({ organization, internships, complaintSummary, assessments });
});

const updateOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!organization) throw new AppError('Organization not found.', 404);
  res.json({ organization });
});

module.exports = { createOrganization, listOrganizations, getOrganization, updateOrganization, organizationValidation, idValidation: [param('id').isMongoId()], listValidation: [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 })] };
