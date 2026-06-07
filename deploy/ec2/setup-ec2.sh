#!/usr/bin/env bash
# One-time EC2 bootstrap (Ubuntu 22.04/24.04). Run as ubuntu or ec2-user with sudo.
set -euo pipefail

echo "==> Installing Docker..."
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER" || true
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin should be included with Docker CE."
  exit 1
fi

echo "==> Installing Node.js 20 (frontend build)..."
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "==> Creating cert directory..."
mkdir -p deploy/ec2/nginx/certs

if [[ ! -f deploy/ec2/.env ]]; then
  cp deploy/ec2/env.production.example deploy/ec2/.env
  echo ""
  echo "Created deploy/ec2/.env — edit PUBLIC_URL, secrets, and payment keys before deploying."
fi

echo ""
echo "Next steps:"
echo "  1. Edit deploy/ec2/.env with real values"
echo "  2. Open EC2 security group: 22 (your IP), 9000 and 9001 from 0.0.0.0/0"
echo "  3. Point DNS A record to this instance Elastic IP"
echo "  4. Run: ./deploy/ec2/deploy.sh"
echo "  5. After deploy: ./deploy/ec2/post-deploy.sh"
echo ""
echo "Log out and back in if docker group was added."
