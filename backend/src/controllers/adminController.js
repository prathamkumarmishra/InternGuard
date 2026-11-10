const { body, param, query } = require('express-validator');
const Organization = require('../models/Organization');
const Internship = require('../models/Internship');
const Complaint = require('../models/Complaint');
const RiskAssessment = require('../models/RiskAssessment');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const dashboard = asyncHandler(async (req, res) => {
  const [totalOrganizations, verifiedOrganizations, pendingReviews, highRiskCases, complaints, internshipsAnalyzed, riskDistribution, complaintsByCategory, monthlyReports] = await Promise.all([
    Organization.countDocuments(), Organization.countDocuments({ verificationStatus: 'VERIFIED' }), Organization.countDocuments({ verificationStatus: { $in: ['PENDING', 'MANUAL_REVIEW', 'NEEDS_INFORMATION'] } }), Organization.countDocuments({ riskLevel: 'HIGH_RISK' }), Complaint.countDocuments(), Internship.countDocuments({ aiAnalysis: { $exists: true } }),
    Organization.aggregate([{ $group: { _id: '$riskLevel', count: { $sum: 1 } } }]), Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Complaint.aggregate([{ $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }, { $limit: 12 }])
  ]);
  res.json({ stats: { totalOrganizations, verifiedOrganizations, pendingReviews, highRiskCases, complaints, internshipsAnalyzed }, riskDistribution, complaintsByCategory, monthlyReports });
});

const reviews = asyncHandler(async (req, res) => {
  const organizations = await Organization.find({ $or: [{ riskLevel: 'HIGH_RISK' }, { verificationStatus: 'MANUAL_REVIEW' }] }).sort({ riskScore: -1 }).limit(50);
  res.json({ reviews: organizations });
});

const updateReview = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: req.body.status, moderationNote: req.body.moderationNote }, { new: true });
  if (!complaint) throw new AppError('Report not found.', 404);
  await AuditLog.create({ user: req.user._id, action: `Updated report to ${req.body.status}`, entity: 'Complaint', entityId: complaint._id, metadata: { moderationNote: req.body.moderationNote } });
  res.json({ complaint });
});

const updateOrganizationStatus = asyncHandler(async (req, res) => {
  const organization = await Organization.findByIdAndUpdate(req.params.id, { verificationStatus: req.body.verificationStatus }, { new: true });
  if (!organization) throw new AppError('Organization not found.', 404);
  await AuditLog.create({ user: req.user._id, action: `Changed verification status to ${req.body.verificationStatus}`, entity: 'Organization', entityId: organization._id });
  res.json({ organization });
});

const analytics = asyncHandler(async (req, res) => {
  const [topIndicators, verificationStatus, highRisk] = await Promise.all([
    RiskAssessment.aggregate([{ $unwind: '$signals' }, { $group: { _id: '$signals.signal', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]),
    Organization.aggregate([{ $group: { _id: '$verificationStatus', count: { $sum: 1 } } }]), Organization.find({ riskLevel: 'HIGH_RISK' }).sort({ riskScore: -1 }).limit(8)
  ]);
  res.json({ topIndicators, verificationStatus, highRisk });
});

const auditLogs = asyncHandler(async (req, res) => res.json({ logs: await AuditLog.find().populate('user', 'fullName email role').sort({ createdAt: -1 }).limit(100) }));
const reviewValidation = [param('id').isMongoId(), body('status').isIn(['PENDING', 'UNDER_REVIEW', 'VERIFIED_REPORT', 'REJECTED', 'RESOLVED']), body('moderationNote').optional().trim().isLength({ max: 1000 })];
const orgStatusValidation = [param('id').isMongoId(), body('verificationStatus').isIn(['PENDING', 'VERIFIED', 'NEEDS_INFORMATION', 'MANUAL_REVIEW'])];
module.exports = { dashboard, reviews, updateReview, updateOrganizationStatus, analytics, auditLogs, reviewValidation, orgStatusValidation };
