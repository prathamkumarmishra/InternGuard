FROM node:20-bookworm AS engine-build
RUN apt-get update && apt-get install -y --no-install-recommends cmake g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY risk-engine ./risk-engine
RUN cmake -S risk-engine -B risk-engine/build && cmake --build risk-engine/build --config Release

FROM node:20-bookworm-slim
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend ./
COPY --from=engine-build /app/risk-engine /app/risk-engine
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "src/server.js"]
