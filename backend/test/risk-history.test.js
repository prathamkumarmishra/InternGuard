const test = require('node:test');
const assert = require('node:assert/strict');
const RiskAssessment = require('../src/models/RiskAssessment');
const riskRoutes = require('../src/routes/riskRoutes');

test('risk assessments retain the requesting user for account-scoped history', () => {
  const path = RiskAssessment.schema.path('requestedBy');
  assert.equal(path.instance, 'ObjectId');
  assert.equal(path.options.ref, 'User');
});

test('saved-history route is registered before the dynamic organization route', () => {
  const paths = riskRoutes.stack.filter((layer) => layer.route).map((layer) => layer.route.path);
  assert.ok(paths.indexOf('/history') >= 0);
  assert.ok(paths.indexOf('/history') < paths.indexOf('/:organizationId'));
});
