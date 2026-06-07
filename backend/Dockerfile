FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* .npmrc ./
COPY patches ./patches
RUN npm ci || npm install

FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build \
  && ./node_modules/.bin/tsc medusa-config.ts --outDir . --rootDir . \
       --module commonjs --moduleResolution node --esModuleInterop \
       --skipLibCheck --target ES2021 --declaration false \
  && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/medusa-config.js ./medusa-config.js
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/src ./src

EXPOSE 9000
CMD ["npm", "run", "start"]
