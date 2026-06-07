#!/usr/bin/env bash
# Shared helpers for batched EC2 deploy scripts.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="${ROOT}/deploy/ec2/.env"
COMPOSE_FILE="${ROOT}/docker-compose.prod.yml"

load_env() {
  if [[ ! -f "$ENV_FILE" ]]; then
    echo "Missing $ENV_FILE — run: bash deploy/ec2/init-env.sh <public-ip>"
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
}

dc() {
  sudo docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "$@"
}

require_ports_free() {
  load_env
  for PORT in "$BACKEND_PORT" "$FRONTEND_PORT"; do
    if ss -tln 2>/dev/null | grep -q ":${PORT} "; then
      if dc ps --format '{{.Names}} {{.Ports}}' 2>/dev/null | grep -q ":${PORT}->"; then
        echo "Port $PORT in use by halo-leaf (ok if restarting)."
      else
        echo "ERROR: Port $PORT is used by another app. Change BACKEND_PORT/FRONTEND_PORT in $ENV_FILE"
        exit 1
      fi
    fi
  done
}

wait_for_health() {
  load_env
  echo "==> Waiting for backend (:${BACKEND_PORT}) and storefront (:${FRONTEND_PORT})..."
  for i in $(seq 1 60); do
    if curl -sf "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1 \
      && curl -sf "http://127.0.0.1:${FRONTEND_PORT}/health" >/dev/null 2>&1; then
      echo "Healthy."
      return 0
    fi
    sleep 5
  done
  echo "Health check failed. Recent logs:"
  dc logs --tail=40 backend nginx || true
  return 1
}

print_urls() {
  load_env
  echo "Storefront: ${PUBLIC_URL}"
  echo "Backend:    http://127.0.0.1:${BACKEND_PORT}"
  echo "Admin:      ${PUBLIC_URL}/app"
}
