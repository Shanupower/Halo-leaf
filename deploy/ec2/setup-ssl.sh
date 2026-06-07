#!/usr/bin/env bash
# Obtain Let's Encrypt cert and enable HTTPS in nginx.
# Usage: ./deploy/ec2/setup-ssl.sh shop.example.com admin@example.com
set -euo pipefail

DOMAIN="${1:?Usage: setup-ssl.sh <domain> <email>}"
EMAIL="${2:?Usage: setup-ssl.sh <domain> <email>}"

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

sudo apt-get update
sudo apt-get install -y certbot

sudo certbot certonly --standalone -d "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive

mkdir -p deploy/ec2/nginx/certs
sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" deploy/ec2/nginx/certs/
sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" deploy/ec2/nginx/certs/
sudo chown -R "$USER:$USER" deploy/ec2/nginx/certs

# Enable HTTPS block in nginx config (uncomment manually or use sed)
echo ""
echo "Certs copied to deploy/ec2/nginx/certs/"
echo "Edit deploy/ec2/nginx/default.conf:"
echo "  - Uncomment the HTTPS server block and the HTTP->HTTPS redirect"
echo "Then: docker compose -f docker-compose.prod.yml restart nginx"
echo ""
echo "Renewal cron example:"
echo "  0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/$DOMAIN/*.pem $ROOT/deploy/ec2/nginx/certs/ && docker compose -f $ROOT/docker-compose.prod.yml restart nginx"
