const env = require('../config/env');

const suspiciousPhrases = [
  'registration fee', 'application fee', 'security deposit', 'processing fee', 'guaranteed placement',
  'guaranteed job', 'pay before joining', 'certificate fee', 'training fee', 'urgent payment', 'whatsapp only'
];

function ruleBasedAnalysis(description = '') {
  const normalized = description.toLowerCase();
  const matchedIndicators = suspiciousPhrases.filter((phrase) => normalized.includes(phrase));
  const score = Math.min(100, matchedIndicators.length * 17 + (/(urgent|immediately|limited seats)/.test(normalized) ? 8 : 0));
  const explanation = matchedIndicators.length
    ? matchedIndicators.map((phrase) => `Screening language matched: ${phrase}.`)
    : ['No common suspicious screening phrases were detected.'];
  explanation.push('This automated screening result is not a legal determination of fraud.');
  return {
    risk_probability: score / 100,
    risk_score: score,
    classification: score > 60 ? 'HIGH RISK' : score > 30 ? 'MEDIUM RISK' : 'LOW RISK',
    matched_indicators: matchedIndicators,
    explanation,
    model_version: 'Rule-based fallback v1',
    fallback: true
  };
}

async function analyseInternship(payload) {
  try {
    const response = await fetch(`${env.aiServiceUrl}/api/analyze/internship`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error('AI service response was unavailable');
    return { ...(await response.json()), fallback: false };
  } catch {
    return ruleBasedAnalysis(payload.description);
  }
}

async function analyseWebsite(payload) {
  try {
    const response = await fetch(`${env.aiServiceUrl}/api/analyze/website`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error('Website service response was unavailable');
    return { ...(await response.json()), fallback: false };
  } catch {
    const isHttps = /^https:\/\//i.test(payload.website || '');
    return {
      reachable: null,
      url: payload.website,
      signals: [{ signal: isHttps ? 'HTTPS submitted' : 'HTTPS not submitted', value: isHttps, source: 'Submitted website URL', confidence: 1, description: isHttps ? 'The submitted URL uses HTTPS.' : 'Use an HTTPS address where available.' }],
      score: isHttps ? 0 : 8,
      note: 'Live website analysis is currently unavailable; this result only evaluates the submitted URL.',
      fallback: true
    };
  }
}

module.exports = { analyseInternship, analyseWebsite, ruleBasedAnalysis };
