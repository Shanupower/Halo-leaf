#!/usr/bin/env bash
# First-time DB setup after containers are running (uses sudo docker).
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
bash "$DIR/batch-05-migrate.sh"
bash "$DIR/batch-06-admin.sh"
