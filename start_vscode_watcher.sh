#!/bin/bash

echo "========================================"
echo "  VS Code File Watcher for Learning AI"
echo "========================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    exit 1
fi

# Check if watchdog is installed
if ! python3 -c "import watchdog" 2>/dev/null; then
    echo "Installing watchdog..."
    pip3 install watchdog websockets
fi

# Check if backend is running
echo "Checking if Python backend is running..."
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo ""
    echo "WARNING: Python backend doesn't seem to be running on port 8000"
    echo "Make sure to start it first with: python3 python_backend/main.py"
    echo ""
    read -p "Press Enter to continue anyway..."
fi

echo ""
echo "Starting file watcher..."
echo "Watching current directory: $(pwd)"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 vscode_watcher.py

