const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const root = path.resolve(__dirname, '../../..');

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 8080),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/internguard',
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me-before-deploying',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  cppEnginePath: process.env.CPP_ENGINE_PATH || path.join(root, 'risk-engine', 'build', process.platform === 'win32' ? 'risk_engine.exe' : 'risk_engine'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};
