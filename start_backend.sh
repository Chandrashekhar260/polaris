#!/bin/bash
# Start Python Backend for Personal Learning AI Agent

echo "🚀 Starting Python Backend..."
echo ""
echo "This will start the FastAPI backend on port 8000"
echo "The frontend is already running on port 5000"
echo ""

cd python_backend

# Check if running in mock mode
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "⚠️  No GOOGLE_API_KEY found - running in MOCK MODE"
    echo "   Basic analysis will work, but AI features are limited"
    echo "   To enable full AI: Add GOOGLE_API_KEY to .env file"
    echo ""
fi

echo "Starting server..."
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Note: Press Ctrl+C to stop the server
