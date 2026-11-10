const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  type: { type: String, enum: ['URL', 'SCREENSHOT_METADATA', 'DOCUMENT_METADATA', 'TEXT'], default: 'TEXT' },
  reference: { type: String, required: true },
  description: String
}, { _id: false });

const complaintSchema = new mongoose.Schema({
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
  category: { type: String, enum: ['PAYMENT_REQUEST', 'FAKE_INTERNSHIP_OFFER', 'FAKE_INTERVIEW', 'CERTIFICATE_SCAM', 'NON_RESPONSE', 'IDENTITY_MISREPRESENTATION', 'MISLEADING_STIPEND', 'OTHER'], required: true, index: true },
  description: { type: String, required: true, maxlength: 5000 },
  experienceDate: Date,
  evidence: [evidenceSchema],
  status: { type: String, enum: ['PENDING', 'UNDER_REVIEW', 'VERIFIED_REPORT', 'REJECTED', 'RESOLVED'], default: 'PENDING', index: true },
  isPublicSummary: { type: Boolean, default: false },
  moderationNote: String,
  demoData: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
