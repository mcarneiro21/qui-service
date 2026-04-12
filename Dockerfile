# ─── Base ────────────────────────────────────────────────────────────────────
FROM node:20.11.1-alpine AS base

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

WORKDIR /app

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ─── Development ──────────────────────────────────────────────────────────────
FROM base AS dev

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm exec prisma generate

EXPOSE 5173 3001

ENTRYPOINT ["sh", "docker-entrypoint.sh"]

# ─── Build ────────────────────────────────────────────────────────────────────
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm exec prisma generate
RUN pnpm build

# ─── Production ───────────────────────────────────────────────────────────────
FROM base AS production

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

RUN pnpm exec prisma generate

EXPOSE 3001

CMD ["node", "dist/server/server/index.js"]
