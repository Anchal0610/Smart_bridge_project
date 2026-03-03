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

# Start Backend in background
echo "🟢 Starting Backend Server on http://localhost:8000..."
# Kill any process on port 8000 first
lsof -ti :8000 | xargs kill -9 2>/dev/null
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
BACKEND_PID=$!

cd ..

# 2. Frontend Setup
echo "⚛️ Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (this may take a minute)..."
    npm install --silent
fi

# Start Frontend
echo "🔵 Starting Frontend Server on http://localhost:5173..."
# Kill any process on port 5173 first
lsof -ti :5173 | xargs kill -9 2>/dev/null
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID; exit" INT TERM EXIT
