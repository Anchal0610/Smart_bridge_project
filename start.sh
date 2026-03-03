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

# Start Backend in a new terminal window or background
echo "🟢 Launching Backend Server..."
lsof -ti :8000 | xargs kill -9 2>/dev/null

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd)/backend && source venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload\""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux (Try common terminals)
    if command -v gnome-terminal >/dev/null 2>&1; then
        gnome-terminal -- bash -c "cd $(pwd)/backend && source venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload; exec bash"
    elif command -v xterm >/dev/null 2>&1; then
        xterm -e "cd $(pwd)/backend && source venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload; exec bash" &
    else
        # Fallback to background
        echo "⚠️ No supported terminal found, running in background (Logs: backend.log)"
        source venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
    fi
else
    # Fallback to background for other systems
    echo "⚠️ Running in background (Logs: backend.log)"
    source venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
fi

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
