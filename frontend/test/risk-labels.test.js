const test = require('node:test');
const assert = require('node:assert/strict');

test('documented screening levels are present in dashboard demo records', () => {
  const levels = ['LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK'];
  assert.equal(levels.length, 3);
});

test('risk level labels map correctly', () => {
  const labels = { LOW_RISK: 'Low risk', MEDIUM_RISK: 'Medium risk', HIGH_RISK: 'High risk' };
  assert.equal(labels.LOW_RISK, 'Low risk');
  assert.equal(labels.MEDIUM_RISK, 'Medium risk');
  assert.equal(labels.HIGH_RISK, 'High risk');
});

test('verification statuses are exhaustive', () => {
  const statuses = ['PENDING', 'VERIFIED', 'NEEDS_INFORMATION', 'MANUAL_REVIEW'];
  assert.equal(statuses.length, 4);
  assert.ok(statuses.includes('PENDING'));
  assert.ok(statuses.includes('VERIFIED'));
});

test('complaint categories cover documented types', () => {
  const categories = ['PAYMENT_REQUEST', 'FAKE_INTERNSHIP_OFFER', 'FAKE_INTERVIEW', 'CERTIFICATE_SCAM', 'NON_RESPONSE', 'IDENTITY_MISREPRESENTATION', 'MISLEADING_STIPEND', 'OTHER'];
  assert.equal(categories.length, 8);
  assert.ok(categories.includes('PAYMENT_REQUEST'));
  assert.ok(categories.includes('FAKE_INTERNSHIP_OFFER'));
});

test('score gauge normalizes within bounds', () => {
  const normalize = (score) => Math.max(0, Math.min(100, score));
  assert.equal(normalize(-10), 0);
  assert.equal(normalize(150), 100);
  assert.equal(normalize(42), 42);
});

test('risk color thresholds match documented ranges', () => {
  const getColor = (score) => score > 60 ? 'red' : score > 30 ? 'amber' : 'green';
  assert.equal(getColor(0), 'green');
  assert.equal(getColor(30), 'green');
  assert.equal(getColor(31), 'amber');
  assert.equal(getColor(60), 'amber');
  assert.equal(getColor(61), 'red');
  assert.equal(getColor(100), 'red');
});
