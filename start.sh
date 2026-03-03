#!/bin/bash

# ArogyaMitra Auto-Setup and Run Script
# This script installs dependencies and starts both backend and frontend servers.

echo "🚀 Starting ArogyaMitra Auto-Setup..."

# 1. Backend Setup
echo "🐍 Setting up Backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "Installing backend dependencies..."
pip install -r requirements.txt --quiet
# Fix for bcrypt if needed (applied previously but ensuring here)
pip install bcrypt==4.0.1 --quiet

# Start Backend in a new terminal window (macOS)
echo "🟢 Launching Backend Server in a new window..."
lsof -ti :8000 | xargs kill -9 2>/dev/null
osascript -e "tell application \"Terminal\" to do script \"cd $(pwd)/backend && source venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload\""

cd ..

# 2. Frontend Setup
echo "⚛️ Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --silent
fi

# Start Frontend
echo "🔵 Starting Frontend Server on http://localhost:3001..."
lsof -ti :3001 | xargs kill -9 2>/dev/null
npm run dev
