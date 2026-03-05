#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# start.sh — Launch the AI Driver Safety System
# ──────────────────────────────────────────────────────────────────────
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  AI-based Driver Safety & Risk Prediction System        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── 1. Check Python ──
if ! command -v python3 &>/dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+."
    exit 1
fi

# ── 2. Install Python dependencies ──
echo "📦 Installing Python dependencies…"
pip install -r requirements.txt -q

# ── 3. Build frontend (if node_modules exist) ──
if [ -d "frontend/node_modules" ]; then
    echo "🔨 Building React frontend…"
    (cd frontend && npm run build)
elif command -v npm &>/dev/null && [ -f "frontend/package.json" ]; then
    echo "📦 Installing frontend dependencies…"
    (cd frontend && npm install && npm run build)
else
    echo "⚠️  npm not found or frontend not initialized — skipping frontend build."
    echo "   The API will still work, but no dashboard will be served."
fi

echo ""
echo "🚀 Starting server on http://localhost:${PORT:-8000}"
echo ""

# ── 4. Launch ──
python3 app.py
