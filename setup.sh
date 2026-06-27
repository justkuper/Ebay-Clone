#!/bin/bash
set -e

SRC="$HOME/Claude/Projects/Ebay Clone"
DEST="$HOME/Documents/apps/Ebay-Clone"
REMOTE="https://github.com/justkuper/Ebay-Clone.git"

echo "📁 Creating destination folder..."
mkdir -p "$HOME/Documents/apps"

echo "🚚 Moving project to $DEST ..."
cp -R "$SRC" "$DEST"

echo "📦 Entering project directory..."
cd "$DEST"

echo "🔧 Initialising git repo..."
git init
git branch -M main

echo "➕ Staging all files..."
git add .

echo "💾 Creating initial commit..."
git commit -m "Initial commit — eBay Clone (React + Amplify)"

echo "🔗 Adding remote origin..."
git remote add origin "$REMOTE"

echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Your project is live at: $REMOTE"
echo "   Local copy: $DEST"
