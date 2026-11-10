const { spawn } = require('child_process');
const fs = require('fs');
const env = require('../config/env');

function fallback(input) {
  const description = String(input.internshipDescription || '').toLowerCase();
  const keywords = ['registration fee', 'application fee', 'security deposit', 'processing fee', 'guaranteed job', 'guaranteed placement', 'pay before joining', 'certificate fee', 'training fee', 'urgent payment', 'limited seats', 'whatsapp only', 'crypto payment'];
  const matchedKeywords = keywords.filter((keyword) => description.includes(keyword));
  return {
    keywordRisk: Math.min(100, matchedKeywords.length * 18),
    matchedKeywords,
    complaintRisk: Math.min(100, (Number(input.complaintCount) || 0) * 8 + (Number(input.paymentComplaints) || 0) * 10),
    relationshipRisk: 0,
    riskSignals: matchedKeywords.map((item) => `Screening phrase detected: ${item}`),
    engineVersion: 'Node fallback rules v1',
    fallback: true
  };
}

function runCppEngine(input) {
  return new Promise((resolve) => {
    if (!fs.existsSync(env.cppEnginePath)) return resolve(fallback(input));
    let settled = false;
    const finish = (result) => { if (!settled) { settled = true; resolve(result); } };
    const child = spawn(env.cppEnginePath, [], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    const timeout = setTimeout(() => { child.kill(); finish(fallback(input)); }, 5000);
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.on('error', () => { clearTimeout(timeout); finish(fallback(input)); });
    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0 || !stdout) return finish(fallback(input));
      try {
        const data = JSON.parse(stdout);
        if (data.error || typeof data.keywordRisk !== 'number') return finish(fallback(input));
        finish({ ...data, fallback: false });
      } catch {
        finish(fallback(input));
      }
    });
    child.stdin.end(JSON.stringify(input));
  });
}

module.exports = { runCppEngine };
