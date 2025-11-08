# 🔗 Frontend-Backend Connection Setup

## ✅ Current Status

### Frontend Configuration ✅
- **Frontend URL**: http://localhost:5000 (Express server)
- **Backend API URL**: `http://localhost:8000` ✅ (configured in `client/src/lib/pythonApi.ts`)
- **WebSocket URL**: `ws://localhost:8000/api/ws/stream` ✅ (configured in `client/src/hooks/useWebSocket.ts`)

### Backend Configuration ✅
- **Backend URL**: http://localhost:8000 (Python FastAPI)
- **API Key**: ✅ Configured (Gemini API)
- **Dependencies**: ✅ All installed (chromadb, fastapi, python-multipart, etc.)
- **CORS**: ✅ Enabled for all origins

## 🔍 Connection Details

### 1. REST API Connection

The frontend is **already configured** to connect to the backend:

```typescript
// client/src/lib/pythonApi.ts (line 6)
const PYTHON_API_BASE = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000';
```

**All API calls use this base URL:**
- `GET ${PYTHON_API_BASE}/api/insights`
- `GET ${PYTHON_API_BASE}/api/recommendations`
- `POST ${PYTHON_API_BASE}/api/upload`
- `GET ${PYTHON_API_BASE}/api/quiz`
- `GET ${PYTHON_API_BASE}/health`

### 2. WebSocket Connection

The frontend is **already configured** for WebSocket:

```typescript
// client/src/hooks/useWebSocket.ts (line 3)
const WS_URL = import.meta.env.VITE_PYTHON_WS_URL || 'ws://localhost:8000/api/ws/stream';
```

### 3. CORS Configuration

The backend **already has CORS enabled**:

```python
# python_backend/main.py (lines 43-49)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (including localhost:5000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## ✅ Everything is Already Connected!

The frontend and backend are **already configured** to connect to each other. You just need to:

1. **Start the backend** (port 8000)
2. **Start the frontend** (port 5000)
3. **Open browser** to http://localhost:5000

## 🚀 How to Start Both Servers

### Start Backend
```bash
cd python_backend
python main.py
```

You should see:
```
✅ Services initialized successfully
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Start Frontend
```bash
npm run dev
```

You should see:
```
serving on http://localhost:5000
```

## 🔍 Verify Connection

### 1. Check Backend
```bash
curl http://localhost:8000/health
```

Should return:
```json
{
  "status": "healthy",
  "gemini_api_configured": true,
  "vector_store": "chromadb"
}
```

### 2. Check Frontend
- Open http://localhost:5000 in browser
- Look for green "Live Monitoring" badge on Dashboard
- Check browser console (F12) - should show "WebSocket connected"

### 3. Test Connection
Open browser console (F12) and run:
```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)
```

Should return the health check response.

## 🐛 Troubleshooting

### Frontend can't connect?

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check browser console (F12):**
   - Look for connection errors
   - Check Network tab for failed requests

3. **Check CORS:**
   - Backend allows all origins (`allow_origins=["*"]`)
   - Should work automatically

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

3. **Check port 8000:**
   ```bash
   netstat -ano | findstr :8000
   ```

## 📋 Summary

✅ **Frontend is configured** to connect to `http://localhost:8000`  
✅ **Backend is configured** to accept connections from any origin  
✅ **WebSocket is configured** to connect to `ws://localhost:8000/api/ws/stream`  
✅ **CORS is enabled** on the backend  

**Everything is already connected!** Just start both servers and open http://localhost:5000 in your browser.

