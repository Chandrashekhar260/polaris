#!/bin/bash

echo "Starting Python FastAPI backend..."
cd python_backend && python main.py &
PYTHON_PID=$!

echo "Waiting for Python backend to start..."
sleep 3

echo "Starting Node.js Express frontend..."
cd ..
npm run dev

kill $PYTHON_PID
