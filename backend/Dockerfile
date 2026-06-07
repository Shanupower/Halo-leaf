FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* .npmrc ./
COPY patches ./patches
RUN npm ci || npm install

FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

COPY package.json package-lock.json* .npmrc ./
COPY patches ./patches
RUN npm ci --omit=dev || npm install --omit=dev
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/src ./src
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder /app/instrumentation.ts ./instrumentation.ts

EXPOSE 9000
CMD ["npm", "run", "start"]
