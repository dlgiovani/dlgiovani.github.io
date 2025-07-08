#!/bin/bash
set -e

echo "Building..."
npm run build

echo "Deploying..."

# Get original directory
ORIGINAL_DIR=$(pwd)
REPO_ROOT=$(cd .. && pwd)

# Use gh CLI to clone and deploy
gh repo clone dlgiovani/dlgiovani.github.io /tmp/deploy-repo
cd /tmp/deploy-repo

# Switch to gh-pages branch
git checkout gh-pages 2>/dev/null || git checkout --orphan gh-pages

# Clear existing content and copy new files
rm -rf * 2>/dev/null || true
cp -r "$REPO_ROOT/portfolio/dist"/* .

# Commit and push
git add .
git commit -m "Deploy portfolio $(date)"
git push origin gh-pages

# Cleanup and return
cd "$ORIGINAL_DIR"
rm -rf /tmp/deploy-repo

echo "✅ Deployed successfully!"
