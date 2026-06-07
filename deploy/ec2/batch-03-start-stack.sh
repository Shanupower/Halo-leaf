#!/usr/bin/env bash
# Batch 3: Start postgres, redis, backend, nginx (no rebuild).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
# shellcheck source=deploy/ec2/common.sh
source deploy/ec2/common.sh
require_ports_free

echo "==> [3/6] Starting halo-leaf stack (ports ${BACKEND_PORT}/${FRONTEND_PORT})..."
dc up -d
dc ps
echo "OK: containers started. Next: bash deploy/ec2/batch-04-health.sh"
