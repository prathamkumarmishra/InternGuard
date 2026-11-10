const { connectDatabase } = require('../config/db');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Internship = require('../models/Internship');
const Complaint = require('../models/Complaint');
const RiskAssessment = require('../models/RiskAssessment');
const Verification = require('../models/Verification');
const AuditLog = require('../models/AuditLog');
const { riskLevel } = require('../utils/risk');

const names = ['Asterline Labs', 'BlueHarbor Systems', 'CivicGrid Technologies', 'Dawnbyte Studio', 'Evergreen Analytics', 'Farsight Learning', 'Greencrest Solutions', 'Horizonloop Innovations', 'Irisbridge Digital', 'Juniper Stack', 'Kitewave Technologies', 'LatticeSpring Labs', 'MosaicWorks', 'Northstar Dataworks', 'Orchid Vertex', 'Pinewell Solutions', 'QuasarBridge', 'Riverstone Digital', 'Solstice Techworks', 'TerraNova Learning'];
const states = ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana', 'Kerala', 'Gujarat', 'West Bengal'];
const categories = ['PAYMENT_REQUEST', 'FAKE_INTERNSHIP_OFFER', 'FAKE_INTERVIEW', 'CERTIFICATE_SCAM', 'NON_RESPONSE', 'IDENTITY_MISREPRESENTATION', 'MISLEADING_STIPEND', 'OTHER'];
const passwords = 'DemoOnly123!';

function assessmentFor(organization, index) {
  const score = organization.riskScore;
  const paymentSignal = score > 60 ? [{ signal: 'Payment-related language requires review', value: true, source: 'Synthetic demo record', confidence: 0.75, description: 'Synthetic demonstration signal; review supporting evidence in a live environment.' }] : [];
  return { organization: organization._id, score, level: riskLevel(score), factors: { companyVerification: score > 65 ? 15 : score > 35 ? 8 : 0, websiteSignals: index % 4 === 0 ? 10 : 2, internshipLanguage: score > 50 ? 16 : 4, complaintPatterns: score > 55 ? 12 : 2, identityConsistency: index % 5 === 0 ? 3 : 0 }, signals: paymentSignal, recommendations: ['Verify organization contacts independently before applying.', 'Review the available source and evidence context.'], engineVersion: 'Demo seed v1', modelVersion: 'Demo seed v1' };
}

async function seed() {
  await connectDatabase();
  await Promise.all([User.deleteMany({}), Organization.deleteMany({}), Internship.deleteMany({}), Complaint.deleteMany({}), RiskAssessment.deleteMany({}), Verification.deleteMany({}), AuditLog.deleteMany({})]);
  const users = await User.create([
    { fullName: 'Demo Student', email: 'student@demo.local', password: passwords, role: 'STUDENT' },
    { fullName: 'Demo Admin', email: 'admin@demo.local', password: passwords, role: 'ADMIN' },
    { fullName: 'Demo Verifier', email: 'verifier@demo.local', password: passwords, role: 'VERIFIER' },
    { fullName: 'Demo Organization', email: 'organization@demo.local', password: passwords, role: 'ORGANIZATION' }
  ]);
  const organizations = await Organization.create(names.map((name, index) => {
    const score = [12, 24, 38, 66, 52, 18, 75, 43, 28, 83, 49, 33, 14, 61, 44, 20, 72, 36, 56, 29][index];
    const registrationStatus = index % 6 === 0 ? 'NOT_FOUND' : index % 3 === 0 ? 'NEEDS_REVIEW' : 'VERIFIED';
    return { name, cin: `U${String(10000 + index).padStart(5, '0')}KA2025PTC${String(100000 + index)}`, website: `https://${name.toLowerCase().replace(/[^a-z]/g, '')}.demo.local`, officialEmail: `hello@${name.toLowerCase().replace(/[^a-z]/g, '')}.demo.local`, phone: `+91 90000 ${String(10000 + index).slice(-5)}`, address: `${index + 10} Demo Avenue, ${states[index % states.length]}`, state: states[index % states.length], industry: index % 2 ? 'Software Services' : 'Education Technology', description: `Synthetic demo organization record for ${name}. No claims about real entities are implied.`, registration: { status: registrationStatus, registrationDate: new Date(2020 + (index % 5), index % 12, 1), roc: `ROC ${states[index % states.length]}`, companyType: 'Private Company', source: 'Synthetic demo imported registry', lastVerifiedAt: new Date() }, verificationStatus: registrationStatus === 'VERIFIED' ? 'VERIFIED' : 'MANUAL_REVIEW', riskScore: score, riskLevel: riskLevel(score), demoData: true };
  }));
  const internshipDocs = [];
  for (let index = 0; index < 30; index += 1) {
    const organization = organizations[index % organizations.length];
    const risky = organization.riskScore > 60;
    internshipDocs.push({ organization: organization._id, title: `${['Software Engineering', 'Data Analysis', 'Product Design', 'Cybersecurity', 'Marketing'][index % 5]} Intern`, description: risky ? `Synthetic demo listing. Apply quickly for a guaranteed placement after an application fee. Contact our recruiter on WhatsApp only. This text is included to demonstrate screening indicators.` : `Synthetic demo listing for a supervised ${['software', 'data', 'design', 'security', 'marketing'][index % 5]} internship. Selection is based on skills and an interview. No payment is required to apply.`, stipend: index % 3 ? '₹12,000 / month' : 'Unpaid learning internship', duration: `${2 + (index % 5)} months`, workMode: ['REMOTE', 'ONSITE', 'HYBRID'][index % 3], location: states[index % states.length], applicationMethod: 'Official careers page', recruiterEmail: index % 7 === 0 ? `recruiter${index}@mail.demo` : organization.officialEmail, recruiterPhone: organization.phone, aiAnalysis: { risk_score: risky ? 72 : 12, classification: risky ? 'HIGH RISK' : 'LOW RISK', model_version: 'Demo seed v1' }, demoData: true });
  }
  const internships = await Internship.create(internshipDocs);
  const complaints = [];
  for (let index = 0; index < 50; index += 1) {
    const organization = organizations[(index * 3) % organizations.length];
    complaints.push({ submittedBy: users[0]._id, organization: organization._id, internship: internships[index % internships.length]._id, category: categories[index % categories.length], description: `Synthetic demo report ${index + 1}. This is non-identifying sample content for testing review workflows and must not be treated as a statement about a real organization.`, experienceDate: new Date(2025, index % 12, (index % 27) + 1), evidence: [{ type: 'TEXT', reference: 'Synthetic demo evidence reference', description: 'Metadata-only synthetic evidence.' }], status: ['PENDING', 'UNDER_REVIEW', 'VERIFIED_REPORT', 'REJECTED', 'RESOLVED'][index % 5], demoData: true });
  }
  await Complaint.create(complaints);
  await RiskAssessment.create(organizations.map((organization, index) => ({
    ...assessmentFor(organization, index),
    requestedBy: users[0]._id
  })));
  await Verification.create(organizations.map((organization) => ({ organization: organization._id, type: 'COMPANY', status: organization.registration.status === 'VERIFIED' ? 'MATCHED' : 'NEEDS_REVIEW', result: { demoData: true }, source: 'Synthetic demo imported registry' })));
  await AuditLog.create({ user: users[1]._id, action: 'Seeded synthetic demonstration dataset', entity: 'Organization', entityId: organizations[0]._id, metadata: { organizations: organizations.length, internships: internships.length, complaints: complaints.length } });
  console.log(`Seeded ${organizations.length} synthetic organizations, ${internships.length} internships, and ${complaints.length} reports.`);
  process.exit(0);
}

seed().catch((error) => { console.error(error); process.exit(1); });
