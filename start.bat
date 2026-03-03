@echo off
setlocal

echo 🚀 Starting ArogyaMitra Auto-Setup for Windows...

:: 1. Backend Setup
echo 🐍 Setting up Backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing backend dependencies...
pip install -r requirements.txt --quiet
pip install bcrypt==4.0.1 --quiet

:: Start Backend in a new window
echo 🟢 Launching Backend Server in a new window...
:: Try to kill process on port 8000 (if taskkill fails, it's fine)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a 2>nul
start cmd /k "title ArogyaMitra Backend && cd %CD% && call venv\Scripts\activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

cd ..

:: 2. Frontend Setup
echo ⚛️ Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install --silent
)

:: Start Frontend
echo 🔵 Starting Frontend Server on http://localhost:3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a 2>nul
npm run dev

pause
