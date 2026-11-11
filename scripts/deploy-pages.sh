#!/usr/bin/env bash
# Build for the GitHub Pages project path and publish dist/ to the gh-pages
# branch. Usage: ./scripts/deploy-pages.sh
set -euo pipefail

REPO="${REPO:-ernesto-pro/sick-luke-castle}"
REPO_NAME="${REPO##*/}"
ORIGIN="https://github.com/${REPO}.git"
SITE_URL="${VITE_SITE_URL:-https://${REPO%%/*}.github.io/${REPO_NAME}}"

cd "$(dirname "$0")/.."

BASE_PATH="/${REPO_NAME}/" VITE_SITE_URL="$SITE_URL" npm run build
touch dist/.nojekyll

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -R dist/. "$TMP"/
cd "$TMP"
git init -q -b gh-pages
git config user.name "ernesto-pro"
git config user.email "ernesto-pro@users.noreply.github.com"
git add -A
git commit -q -m "Deploy ${REPO_NAME}"
git remote add origin "$ORIGIN"
git push -f origin gh-pages

echo "Published: ${SITE_URL}/"
