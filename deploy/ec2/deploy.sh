#!/usr/bin/env bash
# Build storefront + start production stack on EC2.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

ENV_FILE="deploy/ec2/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — copy deploy/ec2/env.production.example and fill in values."
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

if [[ -z "${POSTGRES_PASSWORD:-}" || "$POSTGRES_PASSWORD" == "change-me-long-random" ]]; then
  echo "Set a strong POSTGRES_PASSWORD in $ENV_FILE"
  exit 1
fi

if [[ -z "${JWT_SECRET:-}" || -z "${COOKIE_SECRET:-}" ]]; then
  echo "Set JWT_SECRET and COOKIE_SECRET in $ENV_FILE"
  exit 1
fi

BACKEND_PORT="${BACKEND_PORT:-9000}"
FRONTEND_PORT="${FRONTEND_PORT:-9001}"

echo "==> Checking host ports (will not stop other projects)..."
for PORT in "$BACKEND_PORT" "$FRONTEND_PORT"; do
  if command -v ss >/dev/null 2>&1; then
    IN_USE=$(ss -tlnH "sport = :$PORT" 2>/dev/null | wc -l | tr -d ' ')
  else
    IN_USE=$(netstat -tln 2>/dev/null | grep -c ":$PORT " || true)
  fi
  if [[ "$IN_USE" != "0" ]]; then
    OWNER=$(docker ps --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep ":$PORT->" || true)
    if [[ -n "$OWNER" ]] && echo "$OWNER" | grep -q "halo-leaf"; then
      echo "Port $PORT already used by halo-leaf (will recreate stack)."
    elif [[ -n "$OWNER" ]]; then
      echo "ERROR: Port $PORT is in use by another container: $OWNER"
      exit 1
    else
      echo "ERROR: Port $PORT is in use by a non-halo-leaf process. Change BACKEND_PORT/FRONTEND_PORT in $ENV_FILE"
      exit 1
    fi
  fi
done

echo "==> Building frontend..."
export VITE_API_BASE_URL="${VITE_API_BASE_URL:-$PUBLIC_URL}"
export VITE_IMAGE_BASE_URL="${VITE_IMAGE_BASE_URL:-$PUBLIC_URL}"
npm ci
npm run build

echo "==> Starting containers..."
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --build

echo "==> Waiting for services..."
BACKEND_PORT="${BACKEND_PORT:-9000}"
FRONTEND_PORT="${FRONTEND_PORT:-9001}"

for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1 \
    && curl -sf "http://127.0.0.1:${FRONTEND_PORT}/health" >/dev/null 2>&1; then
    echo "Backend (:${BACKEND_PORT}) and storefront (:${FRONTEND_PORT}) are healthy."
    break
  fi
  sleep 3
  if [[ "$i" -eq 30 ]]; then
    echo "Health check failed — check logs:"
    echo "  docker compose -f docker-compose.prod.yml logs backend nginx"
    exit 1
  fi
done

HOST="${PUBLIC_URL:-http://127.0.0.1:${FRONTEND_PORT}}"
echo ""
echo "Deploy complete."
echo "  Storefront:  ${HOST}"
echo "  Backend API: http://127.0.0.1:${BACKEND_PORT}"
echo "  Medusa Admin: ${HOST}/app  (or http://127.0.0.1:${BACKEND_PORT}/app)"
echo ""
echo "Run ./deploy/ec2/post-deploy.sh for DB migrations and admin user."
