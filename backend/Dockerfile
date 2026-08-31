# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci --legacy-peer-deps

# Generate Prisma client
ENV DATABASE_URL=postgresql://placeholder:placeholder@placeholder:5432/placeholder
RUN node node_modules/prisma/build/index.js generate

COPY src ./src
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
RUN npm prune --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN mkdir -p logs uploads

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
