const mongoose = require('mongoose');
const { signalSchema } = require('./Organization');

const riskAssessmentSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
  score: { type: Number, required: true, min: 0, max: 100, index: true },
  level: { type: String, enum: ['LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK'], required: true, index: true },
  factors: {
    companyVerification: { type: Number, min: 0, max: 30 },
    websiteSignals: { type: Number, min: 0, max: 20 },
    internshipLanguage: { type: Number, min: 0, max: 25 },
    complaintPatterns: { type: Number, min: 0, max: 20 },
    identityConsistency: { type: Number, min: 0, max: 5 }
  },
  signals: [signalSchema],
  recommendations: [String],
  disclaimer: { type: String, default: 'This platform provides automated screening signals based on available data and submitted information. Risk scores are not legal determinations of fraud and should be reviewed with supporting evidence.' },
  engineVersion: String,
  modelVersion: String
}, { timestamps: true });

module.exports = mongoose.model('RiskAssessment', riskAssessmentSchema);
