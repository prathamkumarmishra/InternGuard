# Setup and deployment

1. Install Node.js 20+, Python 3.11+, MongoDB, CMake, and a C++17 compiler.
2. Copy each service’s `.env.example` to its runtime environment file and replace development values.
3. Run `npm install` at the repository root.
4. Create/activate a Python virtual environment and install `ai-service/requirements.txt`. For the AI test suite, install `ai-service/requirements-dev.txt` instead.
5. Build the engine with `npm run build:engine -w backend`.
6. Start MongoDB, then run `npm run seed` only in a development database.
7. Start FastAPI and `npm run dev`.

For containers use `docker compose up --build`, then seed with `docker compose exec backend npm run seed`. For production, serve Next.js and Express behind TLS, use managed MongoDB, replace synthetic company data with an authorized data import, configure logging/monitoring, and use a production secret manager.
