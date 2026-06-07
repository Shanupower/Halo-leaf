#!/usr/bin/env bash
# First-time DB setup after containers are running.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

ENV_FILE="deploy/ec2/.env"
COMPOSE="docker compose -f docker-compose.prod.yml --env-file $ENV_FILE"

echo "==> Running Medusa migrations..."
$COMPOSE exec -T backend npx medusa db:migrate

echo ""
echo "==> Optional: seed India region + demo catalog (skip if client will add products manually)"
read -r -p "Run seed script? [y/N] " REPLY
if [[ "$REPLY" =~ ^[Yy]$ ]]; then
  $COMPOSE exec -T backend npm run seed
  $COMPOSE exec -T backend npm run configure:india || true
fi

echo ""
echo "==> Create admin user"
echo "Run interactively (recommended):"
echo "  $COMPOSE exec backend npx medusa user -e admin@yourdomain.com -p 'YourSecurePassword'"
echo ""
echo "==> Medusa Admin checklist (client / you)"
echo "  1. Open https://<your-domain>/app and sign in"
echo "  2. Settings → Publishable API Keys → create key → copy to deploy/ec2/.env VITE_MEDUSA_PUBLISHABLE_KEY"
echo "  3. Re-run ./deploy/ec2/deploy.sh to rebuild storefront with the key"
echo "  4. Add stock location (warehouse address + pincode)"
echo "  5. Add products, variants, weight/dimensions, prices, inventory"
echo "  6. Configure shipping options (manual now; Shiprocket after warehouse is ready)"
echo "  7. Enable Razorpay on India region"
echo ""
echo "Shiprocket webhook (later): https://<your-domain>/carrier-tracking/webhook"
