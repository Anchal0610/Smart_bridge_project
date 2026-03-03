@echo off
:: start.bat - Orchestrator for ArogyaMitra

echo 🚀 Starting ArogyaMitra Ecosystem (Multi-Terminal)...

start cmd /k "start_backend.bat"
start cmd /k "start_frontend.bat"
