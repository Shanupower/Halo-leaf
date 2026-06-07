#!/usr/bin/env bash
# Same as deploy.sh but uses sudo docker (ubuntu not in docker group).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

ENV_FILE="deploy/ec2/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Run ./deploy/ec2/init-env.sh first"
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

BACKEND_PORT="${BACKEND_PORT:-9000}"
FRONTEND_PORT="${FRONTEND_PORT:-9001}"

export VITE_API_BASE_URL="${VITE_API_BASE_URL:-$PUBLIC_URL}"
export VITE_IMAGE_BASE_URL="${VITE_IMAGE_BASE_URL:-$PUBLIC_URL}"

echo "==> Building frontend..."
npm ci
npm run build

echo "==> Starting halo-leaf Docker stack (isolated, ports ${BACKEND_PORT}/${FRONTEND_PORT})..."
sudo docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --build

echo "==> Waiting for health..."
for i in $(seq 1 60); do
  if curl -sf "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1 \
    && curl -sf "http://127.0.0.1:${FRONTEND_PORT}/health" >/dev/null 2>&1; then
    echo "Healthy."
    break
  fi
  sleep 5
  if [[ "$i" -eq 60 ]]; then
    echo "Health check failed. Logs:"
    sudo docker compose -f docker-compose.prod.yml logs --tail=50 backend nginx
    exit 1
  fi
done

echo "Storefront: ${PUBLIC_URL}"
echo "Backend:    http://127.0.0.1:${BACKEND_PORT}"
echo "Admin:      ${PUBLIC_URL}/app"
