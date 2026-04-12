#!/bin/sh
set -e

echo "[entrypoint] Aplicando migrations..."
pnpm exec prisma migrate deploy

echo "[entrypoint] Rodando seed..."
pnpm db:seed

echo "[entrypoint] Iniciando aplicação..."
exec pnpm dev
