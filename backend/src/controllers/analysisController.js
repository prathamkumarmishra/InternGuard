const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { analyseInternship } = require('../services/aiService');

const internshipValidation = [body('description').trim().isLength({ min: 20, max: 10000 }), body('title').optional().trim().isLength({ max: 180 }), body('recruiter_email').optional({ values: 'falsy' }).isEmail()];

const analyseInternshipController = asyncHandler(async (req, res) => {
  const result = await analyseInternship(req.body);
  res.json({ result, disclaimer: 'This is an automated screening result, not a legal fraud determination.' });
});

const analyseComplaint = asyncHandler(async (req, res) => {
  const text = req.body.description || '';
  const categories = { PAYMENT_REQUEST: /fee|payment|deposit|money/i, CERTIFICATE_SCAM: /certificate/i, NON_RESPONSE: /no response|ghosted|unresponsive/i, IDENTITY_MISREPRESENTATION: /identity|impersonat/i };
  const category = Object.entries(categories).find(([, expression]) => expression.test(text))?.[0] || 'OTHER';
  res.json({ category, confidence: 0.65, explanation: 'Category suggestion based on the submitted text. A reviewer should confirm it.' });
});

module.exports = { analyseInternshipController, analyseComplaint, internshipValidation };
