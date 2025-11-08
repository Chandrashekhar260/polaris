# 🔗 Frontend-Backend Connection Guide

## ✅ Connection Status

### Frontend Configuration
- **Frontend URL**: http://localhost:5000 (Express server)
- **Backend API URL**: `http://localhost:8000` (configured in `client/src/lib/pythonApi.ts`)
- **WebSocket URL**: `ws://localhost:8000/api/ws/stream` (configured in `client/src/hooks/useWebSocket.ts`)

### Backend Configuration
- **Backend URL**: http://localhost:8000 (Python FastAPI)
- **API Key**: ✅ Configured (Gemini API)
- **Dependencies**: ✅ Installed (including python-multipart)

## 🔍 How the Connection Works

### 1. REST API Connection
The frontend connects to the backend via REST API:

```typescript
// client/src/lib/pythonApi.ts
const PYTHON_API_BASE = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';
```

**Endpoints used:**
- `GET ${PYTHON_API_BASE}/api/insights` - Learning insights
- `GET ${PYTHON_API_BASE}/api/recommendations` - AI recommendations
- `GET ${PYTHON_API_BASE}/api/summary` - Learning summary
- `POST ${PYTHON_API_BASE}/api/upload` - File upload
- `GET ${PYTHON_API_BASE}/api/quiz` - Quiz generation
- `GET ${PYTHON_API_BASE}/health` - Health check

### 2. WebSocket Connection
The frontend connects to the backend via WebSocket:

```typescript
// client/src/hooks/useWebSocket.ts
const WS_URL = import.meta.env.VITE_PYTHON_WS_URL || 'ws://localhost:8000/api/ws/stream';
```

**WebSocket endpoint:**
- `ws://localhost:8000/api/ws/stream` - Real-time code streaming

## 🚀 How to Verify Connection

### 1. Check Backend is Running
```bash
curl http://localhost:8000/health
```

Should return:
```json
{
  "status": "healthy",
  "gemini_api_configured": true,
  "vector_store": "chromadb",
  "endpoints": [...]
}
```

### 2. Check Frontend is Running
- Open browser: http://localhost:5000
- Look for green "Live Monitoring" badge on Dashboard
- Check browser console (F12) for errors

### 3. Test API Connection
Open browser console (F12) and run:
```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)
```

Should return the health check response.

## 🐛 Troubleshooting

### Frontend can't connect to backend?

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check CORS settings:**
   - Backend has CORS enabled for all origins in `main.py`
   - Should allow connections from `http://localhost:5000`

3. **Check environment variables:**
   - Frontend uses `VITE_PYTHON_API_URL` (defaults to `http://localhost:8000`)
   - Frontend uses `VITE_PYTHON_WS_URL` (defaults to `ws://localhost:8000/api/ws/stream`)

4. **Check browser console:**
   - Open F12 → Console tab
   - Look for connection errors
   - Check Network tab for failed requests

### Backend not starting?

1. **Check dependencies:**
   ```bash
   pip list | findstr chromadb
   pip list | findstr python-multipart
   ```

2. **Check API key:**
   ```bash
   cd python_backend
   python verify_env.py
   ```

3. **Check port 8000 is available:**
   ```bash
   netstat -ano | findstr :8000
   ```

## 📋 Current Setup

### Frontend (Port 5000)
- Express server serving React app
- Vite dev server integrated
- Connects to backend on port 8000

### Backend (Port 8000)
- Python FastAPI server
- Gemini AI integration
- ChromaDB vector storage
- WebSocket support

## ✅ Connection Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5000
- [ ] Backend health check returns success
- [ ] Frontend shows "Backend Online" badge
- [ ] WebSocket connection shows "Live Monitoring"
- [ ] No errors in browser console
- [ ] API calls work (test upload or quiz)

## 🎯 Next Steps

Once both servers are running:
1. Open http://localhost:5000 in your browser
2. Check Dashboard for connection status
3. Test file upload
4. Generate a quiz
5. Set up VS Code live streaming

