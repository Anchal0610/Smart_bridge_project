#!/bin/bash
# start.sh - Orchestrator for ArogyaMitra

echo "🚀 Starting ArogyaMitra Ecosystem (Multi-Terminal)..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && ./start_backend.sh\""
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && ./start_frontend.sh\""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v gnome-terminal >/dev/null 2>&1; then
        gnome-terminal -- bash -c "./start_backend.sh; exec bash"
        gnome-terminal -- bash -c "./start_frontend.sh; exec bash"
    elif command -v xterm >/dev/null 2>&1; then
        xterm -e "./start_backend.sh; exec bash" &
        xterm -e "./start_frontend.sh; exec bash" &
    else
        echo "⚠️ No supported terminal found, launching in current window (Sequentially)..."
        ./start_backend.sh &
        ./start_frontend.sh
    fi
else
    # Fallback
    ./start_backend.sh &
    ./start_frontend.sh
fi
