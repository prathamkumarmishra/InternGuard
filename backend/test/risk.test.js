const test = require('node:test');
const assert = require('node:assert/strict');
const { clamp, riskLevel } = require('../src/utils/risk');
const { ruleBasedAnalysis } = require('../src/services/aiService');

test('risk levels use documented prototype thresholds', () => {
  assert.equal(riskLevel(0), 'LOW_RISK');
  assert.equal(riskLevel(30), 'LOW_RISK');
  assert.equal(riskLevel(31), 'MEDIUM_RISK');
  assert.equal(riskLevel(60), 'MEDIUM_RISK');
  assert.equal(riskLevel(61), 'HIGH_RISK');
  assert.equal(riskLevel(100), 'HIGH_RISK');
});

test('clamp enforces boundaries correctly', () => {
  assert.equal(clamp(115, 0, 100), 100);
  assert.equal(clamp(-5, 0, 100), 0);
  assert.equal(clamp(50, 0, 100), 50);
  assert.equal(clamp(0, 0, 100), 0);
  assert.equal(clamp(100, 0, 100), 100);
});

test('rule fallback identifies payment and guarantee language as signals', () => {
  const result = ruleBasedAnalysis('Pay a registration fee for guaranteed placement.');
  assert.ok(result.matched_indicators.includes('registration fee'));
  assert.ok(result.matched_indicators.includes('guaranteed placement'));
  assert.ok(result.risk_score > 20, 'Score should be above 20 when suspicious phrases detected');
});

test('rule fallback assigns low risk to legitimate descriptions', () => {
  const result = ruleBasedAnalysis('Three month data analysis internship with monthly stipend and official offer letter after interview.');
  assert.equal(result.matched_indicators.length, 0);
  assert.ok(result.risk_score <= 30, 'Score should be 30 or below for legitimate descriptions');
  assert.equal(result.classification, 'LOW RISK');
});

test('rule fallback detects multiple suspicious phrases and elevates score', () => {
  const result = ruleBasedAnalysis('Pay registration fee for guaranteed placement. Limited seats. Contact us on WhatsApp only and make urgent payment.');
  assert.ok(result.matched_indicators.length >= 3, 'Should detect at least 3 indicators');
  assert.ok(result.risk_score >= 48, 'Score should be elevated with multiple phrases');
});

test('rule fallback always appends a safety disclaimer', () => {
  const result = ruleBasedAnalysis('Normal internship description with no suspicious content.');
  const lastExplanation = result.explanation[result.explanation.length - 1];
  assert.ok(lastExplanation.toLowerCase().includes('not a legal determination'), 'Should include safety disclaimer');
});
