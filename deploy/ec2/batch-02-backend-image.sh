#!/usr/bin/env bash
# Batch 2: Build Medusa backend Docker image only (does not start containers).
# Heaviest step — run while ECS/PM2 can stay up; add swap if needed.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
# shellcheck source=deploy/ec2/common.sh
source deploy/ec2/common.sh
load_env

echo "==> [2/6] Building backend Docker image (single npm install in Dockerfile)..."
echo "    This may take 10–20 minutes on t3.medium. Only one npm ci runs now."
free -h || true
dc build --progress=plain backend
if ! sudo docker run --rm halo-leaf-backend:latest test -f /app/medusa-config.js; then
  echo "ERROR: Image missing /app/medusa-config.js — build did not compile config."
  exit 1
fi
echo "OK: backend image built. Next: bash deploy/ec2/batch-03-start-stack.sh"
