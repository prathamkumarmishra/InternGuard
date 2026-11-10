const Organization = require('../models/Organization');

async function verifyCompany({ name, cin, website, email }) {
  const conditions = [];
  if (cin) conditions.push({ cin: cin.trim().toUpperCase() });
  if (name) conditions.push({ name: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
  if (website) conditions.push({ website: website.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '') });
  if (email) conditions.push({ officialEmail: email.toLowerCase() });
  const organization = conditions.length ? await Organization.findOne({ $or: conditions }) : null;

  if (!organization) {
    return {
      status: 'NOT_FOUND', organization: null, signals: [{ signal: 'Registration information could not be matched', source: 'Imported company dataset', confidence: 0.65, description: 'No matching record was found in the local imported dataset. Manual verification is recommended; this is not a fraud finding.' }]
    };
  }
  const source = organization.registration?.source || 'Imported company dataset';
  return {
    status: organization.registration?.status === 'VERIFIED' ? 'MATCHED' : 'NEEDS_REVIEW', organization,
    signals: [{ signal: organization.registration?.status === 'VERIFIED' ? 'Registration record matched' : 'Registration requires review', source, confidence: 0.8, description: organization.registration?.status === 'VERIFIED' ? 'Submitted information matches an imported organization record.' : 'A related organization record exists but its registration status needs review.' }]
  };
}

module.exports = { verifyCompany };
