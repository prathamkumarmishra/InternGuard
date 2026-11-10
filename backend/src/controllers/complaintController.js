const { body, param, query } = require('express-validator');
const Complaint = require('../models/Complaint');
const Organization = require('../models/Organization');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const categories = ['PAYMENT_REQUEST', 'FAKE_INTERNSHIP_OFFER', 'FAKE_INTERVIEW', 'CERTIFICATE_SCAM', 'NON_RESPONSE', 'IDENTITY_MISREPRESENTATION', 'MISLEADING_STIPEND', 'OTHER'];
const complaintValidation = [body('organization').isMongoId(), body('internship').optional({ values: 'falsy' }).isMongoId(), body('category').isIn(categories), body('description').trim().isLength({ min: 20, max: 5000 }), body('experienceDate').optional({ values: 'falsy' }).isISO8601()];

const createComplaint = asyncHandler(async (req, res) => {
  if (!await Organization.exists({ _id: req.body.organization })) throw new AppError('Organization not found.', 404);
  const complaint = await Complaint.create({ ...req.body, submittedBy: req.user._id, evidence: (req.body.evidence || []).slice(0, 5) });
  res.status(201).json({ complaint, message: 'Your report was submitted for review. It is not published as a factual finding.' });
});

const listComplaints = asyncHandler(async (req, res) => {
  const { category, status, organization, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (organization) filter.organization = organization;
  if (req.user?.role === 'STUDENT') filter.submittedBy = req.user._id;
  const safeLimit = Math.min(50, Math.max(1, Number(limit)));
  const [complaints, total] = await Promise.all([
    Complaint.find(filter).populate('organization', 'name riskScore riskLevel').populate('internship', 'title').sort({ createdAt: -1 }).skip((Math.max(1, Number(page)) - 1) * safeLimit).limit(safeLimit),
    Complaint.countDocuments(filter)
  ]);
  res.json({ complaints, pagination: { total, page: Number(page), limit: safeLimit, pages: Math.ceil(total / safeLimit) } });
});

const getComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate('organization', 'name riskScore riskLevel').populate('internship', 'title');
  if (!complaint) throw new AppError('Report not found.', 404);
  const isModerator = ['ADMIN', 'VERIFIER'].includes(req.user?.role);
  if (!isModerator && (!req.user || String(complaint.submittedBy) !== String(req.user._id))) throw new AppError('You do not have access to this report.', 403);
  res.json({ complaint });
});

module.exports = { createComplaint, listComplaints, getComplaint, complaintValidation, idValidation: [param('id').isMongoId()], listValidation: [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 })] };
