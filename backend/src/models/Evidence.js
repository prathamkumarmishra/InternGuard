const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', index: true },
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  signal: String,
  source: { type: String, required: true },
  url: String,
  description: String,
  checkedAt: { type: Date, default: Date.now },
  confidence: { type: Number, min: 0, max: 1, default: 0.7 }
}, { timestamps: true });

module.exports = mongoose.model('Evidence', evidenceSchema);
