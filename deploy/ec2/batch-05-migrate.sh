#!/usr/bin/env bash
# Batch 5: Database migrations (requires running backend).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
# shellcheck source=deploy/ec2/common.sh
source deploy/ec2/common.sh
load_env

echo "==> [5/6] Running Medusa migrations..."
dc exec -T backend npx medusa db:migrate
echo ""
echo "Optional seed (client adding products manually? skip with N):"
read -r -p "Run seed script? [y/N] " REPLY
if [[ "$REPLY" =~ ^[Yy]$ ]]; then
  dc exec -T backend npm run seed
  dc exec -T backend npm run configure:india || true
fi
echo "OK: migrations done. Next: bash deploy/ec2/batch-06-admin.sh"
