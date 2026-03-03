@echo off
:: start_backend.bat
title ArogyaMitra Backend

echo 🐍 Setting up and Starting Backend...
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
echo Installing/Updating backend dependencies...
pip install -r requirements.txt --quiet
pip install bcrypt==4.0.1 --quiet

echo 🟢 Launching Backend Server on http://localhost:8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a 2>nul
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
