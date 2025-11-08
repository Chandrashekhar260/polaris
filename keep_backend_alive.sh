#!/bin/bash
# Helper script to keep Python backend running
cd python_backend

while true; do
    echo "$(date) - Starting Python backend on port 8000..."
    python -u simple_backend.py
    echo "$(date) - Backend crashed, restarting in 2 seconds..."
    sleep 2
done
