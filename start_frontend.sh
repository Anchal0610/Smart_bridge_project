#!/bin/bash
# start_frontend.sh

echo "⚛️ Setting up and Starting Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --silent
fi

echo "🔵 Starting Frontend Server on http://localhost:3001..."
lsof -ti :3001 | xargs kill -9 2>/dev/null
npm run dev
