@echo off
:: start_frontend.bat
title ArogyaMitra Frontend

echo ⚛️ Setting up and Starting Frontend...
cd frontend

if not exist node_modules (
    echo Installing frontend dependencies...
    npm install --silent
)

echo 🔵 Starting Frontend Server on http://localhost:3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a 2>nul
npm run dev
pause
