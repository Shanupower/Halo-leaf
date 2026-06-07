#!/usr/bin/env bash
# Generate deploy/ec2/.env from template (run on server).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

PUBLIC_IP="${1:-65.2.154.229}"
ENV_FILE="deploy/ec2/.env"

cp deploy/ec2/env.production.example "$ENV_FILE"

JWT="$(openssl rand -hex 32)"
COOKIE="$(openssl rand -hex 32)"
PGPASS="$(openssl rand -hex 16)"

python3 <<PY
from pathlib import Path
p = Path("$ENV_FILE")
text = p.read_text()
text = text.replace("http://your-server:9001", f"http://${PUBLIC_IP}:9001")
text = text.replace("http://your-server:9000", f"http://${PUBLIC_IP}:9000")
text = text.replace("POSTGRES_PASSWORD=change-me-long-random", "POSTGRES_PASSWORD=${PGPASS}")
text = text.replace("JWT_SECRET=", "JWT_SECRET=${JWT}", 1)
text = text.replace("COOKIE_SECRET=", "COOKIE_SECRET=${COOKIE}", 1)
p.write_text(text)
print("Created", p)
PY

grep -E "^(PUBLIC_URL|BACKEND_PORT|FRONTEND_PORT)=" "$ENV_FILE"
