#!/usr/bin/env bash
# Batch 6: Create admin user + post-deploy checklist.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
# shellcheck source=deploy/ec2/common.sh
source deploy/ec2/common.sh
load_env

echo "==> [6/6] Create Medusa admin user"
echo "Run (replace email/password):"
echo "  cd $ROOT"
echo "  sudo docker compose -f docker-compose.prod.yml --env-file deploy/ec2/.env exec backend npx medusa user -e admin@yourdomain.com -p 'YourSecurePassword'"
echo ""
print_urls
echo ""
echo "Admin checklist:"
echo "  1. Open ${PUBLIC_URL}/app and sign in"
echo "  2. Settings → Publishable API Keys → add to deploy/ec2/.env → re-run batch-01-frontend.sh + batch-03-start-stack.sh"
echo "  3. Add warehouse, products, Razorpay on India region"
echo "  4. Shiprocket later (after client data is ready)"
