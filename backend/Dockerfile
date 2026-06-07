FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* .npmrc ./
COPY patches ./patches
RUN npm ci || npm install

FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/src ./src
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder /app/instrumentation.ts ./instrumentation.ts

EXPOSE 9000
CMD ["npm", "run", "start"]
