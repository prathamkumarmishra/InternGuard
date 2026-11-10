function clamp(value, min, max) {
  return Math.min(Math.max(Math.round(value || 0), min), max);
}

function riskLevel(score) {
  if (score <= 30) return 'LOW_RISK';
  if (score <= 60) return 'MEDIUM_RISK';
  return 'HIGH_RISK';
}

function presentRiskLevel(level) {
  return level.replace('_', ' ');
}

module.exports = { clamp, riskLevel, presentRiskLevel };
