#!/usr/bin/env bash
# deploy.sh — build frontend + restart backend
# Run from anywhere; all paths are absolute.

set -euo pipefail

REPO=/home/opc/websites/dlgiovani.dev
FRONTEND=$REPO/portfolio
ADMIN=$REPO/admin
BACKEND=$REPO/backend
VENV=/opt/dlgiovani-venv

# ── pull latest ────────────────────────────────────────────────
echo "==> Pulling latest code..."
git -C "$REPO" pull origin main

# ── frontend ───────────────────────────────────────────────────
echo "==> Installing frontend dependencies..."
npm ci --prefix "$FRONTEND"

echo "==> Building frontend..."
PUBLIC_API_URL=https://dlgiovani.dev npm run build --prefix "$FRONTEND"
# dist/ is served directly by nginx — no reload needed

# ── admin (admin-session.dlgiovani.dev) ────────────────────────
echo "==> Building admin app..."
npm ci --prefix "$ADMIN"
npm run build --prefix "$ADMIN"
# admin/dist/ is served directly by nginx — no reload needed

# ── backend ────────────────────────────────────────────────────
if [ ! -d "$VENV" ]; then
  echo "==> Creating venv at $VENV..."
  sudo python3.12 -m venv "$VENV"
  sudo chown -R opc:opc "$VENV"
fi

echo "==> Installing backend dependencies..."
"$VENV/bin/pip" install -q -r "$BACKEND/requirements.txt"

echo "==> Running Alembic migrations..."
(cd "$BACKEND" && source "$VENV/bin/activate" && alembic upgrade head)

echo "==> Restarting API service..."
sudo systemctl restart dlgiovani-api
sudo systemctl is-active dlgiovani-api

echo ""
echo "Done. Verify with:"
echo "  curl https://dlgiovani.dev/api/health"
