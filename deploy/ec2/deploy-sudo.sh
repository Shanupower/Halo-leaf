#!/usr/bin/env bash
# Same as deploy-sudo.sh — delegates to batched deploy.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
bash "$DIR/deploy-all-batches.sh"
