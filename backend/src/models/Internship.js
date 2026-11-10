const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true, maxlength: 10000 },
  stipend: { type: String, trim: true },
  duration: { type: String, trim: true },
  workMode: { type: String, enum: ['REMOTE', 'ONSITE', 'HYBRID', 'UNSPECIFIED'], default: 'UNSPECIFIED' },
  location: String,
  applicationMethod: String,
  recruiterEmail: String,
  recruiterPhone: String,
  status: { type: String, enum: ['ACTIVE', 'PAUSED', 'CLOSED'], default: 'ACTIVE' },
  aiAnalysis: mongoose.Schema.Types.Mixed,
  demoData: { type: Boolean, default: false }
}, { timestamps: true });

internshipSchema.index({ title: 'text', description: 'text', recruiterEmail: 'text' });
module.exports = mongoose.model('Internship', internshipSchema);
