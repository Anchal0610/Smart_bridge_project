#!/bin/bash
# start_backend.sh

echo "🐍 Setting up and Starting Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "Installing/Updating backend dependencies..."
pip install -r requirements.txt --quiet
pip install bcrypt==4.0.1 --quiet

echo "🟢 Launching Backend Server on http://localhost:8000..."
lsof -ti :8000 | xargs kill -9 2>/dev/null
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
