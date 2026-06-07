#!/usr/bin/env bash
# Batch 1: Build storefront only (no Docker). Low memory.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
# shellcheck source=deploy/ec2/common.sh
source deploy/ec2/common.sh
load_env

echo "==> [1/6] Building frontend (Vite)..."
npm ci
npm run build
echo "OK: dist/ ready. Next: bash deploy/ec2/batch-02-backend-image.sh"
