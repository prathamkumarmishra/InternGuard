const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
  signal: { type: String, required: true },
  value: mongoose.Schema.Types.Mixed,
  source: { type: String, required: true },
  checkedAt: { type: Date, default: Date.now },
  confidence: { type: Number, min: 0, max: 1, default: 0.7 },
  description: String
}, { _id: false });

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  cin: { type: String, trim: true, sparse: true, index: true },
  website: { type: String, trim: true, lowercase: true, index: true },
  officialEmail: { type: String, trim: true, lowercase: true, index: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  state: { type: String, trim: true, index: true },
  industry: { type: String, trim: true },
  description: { type: String, maxlength: 2000 },
  registration: {
    status: { type: String, enum: ['VERIFIED', 'NEEDS_REVIEW', 'NOT_FOUND'], default: 'NEEDS_REVIEW', index: true },
    registrationDate: Date,
    roc: String,
    companyType: String,
    source: String,
    lastVerifiedAt: Date
  },
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'NEEDS_INFORMATION', 'MANUAL_REVIEW'], default: 'PENDING', index: true },
  riskScore: { type: Number, min: 0, max: 100, default: 0, index: true },
  riskLevel: { type: String, enum: ['LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK'], default: 'LOW_RISK', index: true },
  signals: [signalSchema],
  demoData: { type: Boolean, default: false }
}, { timestamps: true });

organizationSchema.index({ name: 'text', cin: 'text', website: 'text', officialEmail: 'text' });

module.exports = mongoose.model('Organization', organizationSchema);
module.exports.signalSchema = signalSchema;
