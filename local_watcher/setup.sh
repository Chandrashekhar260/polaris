#!/bin/bash

echo "========================================"
echo "   LearnAI Watcher - Auto Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed!"
    echo "Please install Python from https://www.python.org/downloads/"
    exit 1
fi

echo "[1/3] Installing Python packages..."
pip3 install watchdog websockets
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install packages"
    exit 1
fi
echo "✓ Packages installed successfully!"
echo ""

echo "[2/3] Creating config file..."
if [ ! -f config.json ]; then
    cp config.example.json config.json
    echo "✓ Config file created!"
    echo ""
    echo "IMPORTANT: Edit config.json and set:"
    echo "  1. \"watch_directory\" = your VS Code project path"
    echo "  2. \"backend_url\" = your Replit URL"
    echo ""
else
    echo "✓ Config file already exists"
    echo ""
fi

echo "[3/3] Setup complete!"
echo ""
echo "========================================"
echo "Next Steps:"
echo "========================================"
echo "1. Edit config.json with your project path"
echo "2. Run: python3 watcher.py"
echo ""
echo "Press Enter to open config.json..."
read
nano config.json 2>/dev/null || vi config.json 2>/dev/null || open -e config.json 2>/dev/null
