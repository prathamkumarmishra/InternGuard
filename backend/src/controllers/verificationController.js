const { body } = require('express-validator');
const Organization = require('../models/Organization');
const Verification = require('../models/Verification');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyCompany } = require('../services/companyVerificationService');
const { analyseWebsite } = require('../services/aiService');

const companyValidation = [body('name').optional().trim().isLength({ min: 2, max: 160 }), body('cin').optional().trim().isLength({ min: 4, max: 32 }), body('website').optional({ values: 'falsy' }).isURL({ protocols: ['http', 'https'], require_protocol: true }), body('email').optional({ values: 'falsy' }).isEmail()];
const websiteValidation = [body('website').isURL({ protocols: ['http', 'https'], require_protocol: true }), body('companyName').optional().trim().isLength({ max: 160 }), body('organizationId').optional().isMongoId()];

const company = asyncHandler(async (req, res) => {
  if (!req.body.name && !req.body.cin && !req.body.website && !req.body.email) throw new AppError('Provide at least one company identifier.', 422);
  const result = await verifyCompany(req.body);
  if (result.organization) await Verification.create({ organization: result.organization._id, type: 'COMPANY', status: result.status, result, performedBy: req.user?._id, source: result.signals[0]?.source });
  res.json({ ...result, disclaimer: 'A dataset match is a screening result and should be confirmed with the cited source where required.' });
});

const website = asyncHandler(async (req, res) => {
  const result = await analyseWebsite({ website: req.body.website, company_name: req.body.companyName });
  if (req.body.organizationId && await Organization.exists({ _id: req.body.organizationId })) {
    await Verification.create({ organization: req.body.organizationId, type: 'WEBSITE', status: result.reachable === true ? 'PARTIAL_MATCH' : 'NEEDS_REVIEW', result, performedBy: req.user?._id, source: 'Public website analysis' });
  }
  res.json({ result, disclaimer: 'Website checks inspect publicly available pages only. They do not test security or establish an organization\'s legal status.' });
});

module.exports = { company, website, companyValidation, websiteValidation };
