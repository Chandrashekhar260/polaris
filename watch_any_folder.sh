#!/bin/bash

echo "========================================"
echo "  Watch ANY Folder in VS Code"
echo "========================================"
echo ""

# Check if folder path provided
if [ -z "$1" ]; then
    echo "Usage: ./watch_any_folder.sh /path/to/your/code"
    echo ""
    echo "Example:"
    echo "  ./watch_any_folder.sh ~/Documents/MyProject"
    echo "  ./watch_any_folder.sh /home/user/Projects/ReactApp"
    echo ""
    exit 1
fi

WATCH_DIR="$1"

# Check if directory exists
if [ ! -d "$WATCH_DIR" ]; then
    echo "ERROR: Directory does not exist: $WATCH_DIR"
    exit 1
fi

echo "Watching folder: $WATCH_DIR"
echo ""
echo "Make sure:"
echo "  1. Python backend is running (port 8000)"
echo "  2. Frontend is running (port 5000)"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd "$(dirname "$0")"
python3 vscode_watcher.py "$WATCH_DIR"

