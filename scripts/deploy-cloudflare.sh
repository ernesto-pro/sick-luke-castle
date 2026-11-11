#!/usr/bin/env bash
# Publish the production build to Cloudflare Workers (static assets) and
# refresh the apex → www redirect worker.
# Usage: ./scripts/deploy-cloudflare.sh
set -euo pipefail

cd "$(dirname "$0")/.."

export VITE_SITE_URL="${VITE_SITE_URL:-https://www.sickluke.com}"

npm run build
npx wrangler deploy
npx wrangler deploy -c cloudflare/apex-redirect/wrangler.jsonc

echo "Live: https://www.sickluke.com/"
