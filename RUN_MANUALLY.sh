#!/bin/bash
# Temporary manual startup script until workflow is configured
# This will NOT persist after shell closes - use workflow instead!

echo "=========================================="
echo "  Starting Personal Learning AI Agent"
echo "=========================================="
echo ""
echo "⚠️  WARNING: This is a temporary solution!"
echo "   Follow BACKEND_SETUP.md to configure proper Replit workflows"
echo ""

# Start Python backend in background
echo "🐍 Starting Python backend on port 8000..."
cd python_backend && python -u simple_backend.py > /tmp/python_backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Python backend started (PID: $BACKEND_PID)"
else
    echo "❌ Python backend failed to start"
    cat /tmp/python_backend.log
    exit 1
fi

# Test backend
HEALTH=$(curl -s http://localhost:8000/health 2>&1)
if echo "$HEALTH" | grep -q "healthy"; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend not responding properly"
    echo "   Response: $HEALTH"
fi

echo ""
echo "=========================================="
echo "  Both services should now be running:"
echo "  - Frontend: http://localhost:5000"
echo "  - Backend:  http://localhost:8000"
echo "=========================================="
echo ""
echo "📝 Next steps:"
echo "1. Open http://localhost:5000 in your browser"
echo "2. Follow BACKEND_SETUP.md to configure workflows"
echo "3. Press Ctrl+C to stop (will stop frontend but NOT backend)"
echo ""

# Keep script running
wait
