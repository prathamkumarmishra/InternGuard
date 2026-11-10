const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  type: { type: String, enum: ['COMPANY', 'WEBSITE', 'IDENTITY', 'MANUAL'], required: true },
  status: { type: String, enum: ['MATCHED', 'PARTIAL_MATCH', 'NOT_FOUND', 'NEEDS_REVIEW', 'VERIFIED'], required: true },
  result: mongoose.Schema.Types.Mixed,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  source: String
}, { timestamps: true });

module.exports = mongoose.model('Verification', verificationSchema);
