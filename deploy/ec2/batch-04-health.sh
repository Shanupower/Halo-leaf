#!/usr/bin/env bash
# Batch 4: Wait for health endpoints.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
# shellcheck source=deploy/ec2/common.sh
source deploy/ec2/common.sh

echo "==> [4/6] Health check..."
if wait_for_health; then
  print_urls
  echo "Next: bash deploy/ec2/batch-05-migrate.sh"
else
  exit 1
fi
