const createApp = require('./app');
const { connectDatabase } = require('./config/db');
const env = require('./config/env');

async function start() {
  await connectDatabase();
  const app = createApp();
  const server = app.listen(env.port, () => console.log(`InternGuard API listening on port ${env.port}`));
  const shutdown = async () => { await new Promise((resolve) => server.close(resolve)); process.exit(0); };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch((error) => { console.error('Unable to start InternGuard API:', error.message); process.exit(1); });
