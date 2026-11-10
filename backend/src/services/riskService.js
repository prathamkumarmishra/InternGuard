const Complaint = require('../models/Complaint');
const RiskAssessment = require('../models/RiskAssessment');
const { analyseInternship } = require('./aiService');
const { runCppEngine } = require('./cppEngineService');
const { clamp, riskLevel } = require('../utils/risk');

const disclaimer = 'This platform provides automated screening signals based on available data and submitted information. Risk scores are not legal determinations of fraud and should be reviewed with supporting evidence.';

function recommendationSet({ registrationStatus, websiteScore, languageScore, complaintCount, matchedKeywords }) {
  const recommendations = [];
  if (registrationStatus !== 'VERIFIED') recommendations.push('Verify the organization\'s registration details using an authoritative source.');
  if (websiteScore > 5) recommendations.push('Review the public website and confirm that its organization and contact details are consistent.');
  if (languageScore > 10 || matchedKeywords?.length) recommendations.push('Do not make payment before independently verifying the internship and recruiter.');
  if (complaintCount > 0) recommendations.push('Review submitted evidence and complaint context before making a decision.');
  if (!recommendations.length) recommendations.push('Continue to verify official contacts and internship terms before applying.');
  return recommendations;
}

async function createRiskAssessment({ organization, internship, websiteAnalysis, description, recruiterEmail, recruiterPhone, requestedBy }) {
  const complaints = await Complaint.find({ organization: organization._id, status: { $in: ['PENDING', 'UNDER_REVIEW', 'VERIFIED_REPORT'] } });
  const paymentComplaints = complaints.filter((item) => item.category === 'PAYMENT_REQUEST').length;
  const ai = await analyseInternship({ description: description || internship?.description || '', title: internship?.title, recruiter_email: recruiterEmail || internship?.recruiterEmail, recruiter_phone: recruiterPhone || internship?.recruiterPhone });
  const cpp = await runCppEngine({
    companyName: organization.name,
    internshipDescription: description || internship?.description || '',
    complaintCount: complaints.length,
    paymentComplaints,
    websiteSignals: websiteAnalysis || {}
  });

  const companyVerification = organization.registration?.status === 'VERIFIED' ? 0 : organization.registration?.status === 'NOT_FOUND' ? 22 : 12;
  const websiteSignals = clamp(websiteAnalysis?.score || (websiteAnalysis?.fallback ? 8 : 0), 0, 20);
  const internshipLanguage = clamp(Math.max((ai.risk_score || 0) * 0.25, (cpp.keywordRisk || 0) * 0.25), 0, 25);
  const complaintPatterns = clamp(complaints.length * 3 + paymentComplaints * 3, 0, 20);
  const contactMismatch = recruiterEmail && organization.officialEmail && !recruiterEmail.toLowerCase().endsWith(organization.officialEmail.split('@')[1] || '') ? 5 : 0;
  const factors = { companyVerification, websiteSignals, internshipLanguage, complaintPatterns, identityConsistency: contactMismatch };
  const score = clamp(Object.values(factors).reduce((sum, factor) => sum + factor, 0), 0, 100);
  const signals = [
    ...(organization.signals || []),
    ...(websiteAnalysis?.signals || []),
    ...(ai.matched_indicators || []).map((indicator) => ({ signal: `Internship language: ${indicator}`, value: true, source: ai.model_version || 'Internship Risk Classifier', confidence: Math.min(0.95, ai.risk_probability || 0.7), description: `The submitted description includes a screening indicator: ${indicator}.` })),
    ...(cpp.riskSignals || []).map((signal) => ({ signal, value: true, source: cpp.engineVersion || 'C++ DSA risk engine', confidence: 0.75, description: signal })),
    ...(complaints.length ? [{ signal: `${complaints.length} platform report(s) require context review`, value: complaints.length, source: 'Platform-submitted reports', confidence: 0.8, description: 'Report counts are screening context and do not establish an allegation as fact.' }] : []),
    ...(contactMismatch ? [{ signal: 'Recruiter email needs verification', value: recruiterEmail, source: 'Submitted internship details', confidence: 0.75, description: 'The recruiter email domain does not match the submitted official organization email domain.' }] : [])
  ];
  const assessment = await RiskAssessment.create({
    requestedBy, organization: organization._id, internship: internship?._id, score, level: riskLevel(score), factors, signals,
    recommendations: recommendationSet({ registrationStatus: organization.registration?.status, websiteScore: websiteSignals, languageScore: internshipLanguage, complaintCount: complaints.length, matchedKeywords: cpp.matchedKeywords }),
    disclaimer, engineVersion: cpp.engineVersion, modelVersion: ai.model_version
  });
  organization.riskScore = score;
  organization.riskLevel = assessment.level;
  organization.signals = signals.slice(0, 12);
  await organization.save();
  return { assessment, ai, cpp, complaintCount: complaints.length };
}

module.exports = { createRiskAssessment, disclaimer };
