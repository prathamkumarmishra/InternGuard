const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const env = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const riskRoutes = require('./routes/riskRoutes');
const adminRoutes = require('./routes/adminRoutes');

function rejectUnsafeKeys(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    if (key.startsWith('$') || key.includes('.')) throw new Error('Unsafe input key');
    rejectUnsafeKeys(nested);
  }
}

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: env.frontendUrl.split(',').map((item) => item.trim()), credentials: true }));
  app.use(express.json({ limit: '250kb' }));
  app.use((req, res, next) => {
    try { rejectUnsafeKeys(req.body); next(); } catch { res.status(400).json({ error: { message: 'Unsafe input was rejected.' } }); }
  });
  if (env.nodeEnv !== 'test') app.use(morgan('dev'));
  app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.get('/health', (req, res) => res.json({ status: 'ok', service: 'internguard-api' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/organizations', organizationRoutes);
  app.use('/api/internships', internshipRoutes);
  app.use('/api/complaints', complaintRoutes);
  app.use('/api/verification', verificationRoutes);
  app.use('/api/analysis', analysisRoutes);
  app.use('/api/risk', riskRoutes);
  app.use('/api/admin', adminRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = createApp;
