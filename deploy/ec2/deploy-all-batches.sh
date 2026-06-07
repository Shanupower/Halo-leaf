#!/usr/bin/env bash
# Run all deploy batches in order (same as before, but split internally for logging).
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
bash "$DIR/batch-01-frontend.sh"
bash "$DIR/batch-02-backend-image.sh"
bash "$DIR/batch-03-start-stack.sh"
bash "$DIR/batch-04-health.sh"
bash "$DIR/batch-05-migrate.sh"
bash "$DIR/batch-06-admin.sh"
