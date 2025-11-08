# 🚀 Start Both Frontend and Backend

## Quick Start

### 1. Install Missing Backend Dependency

```bash
pip install python-multipart
```

### 2. Start Backend (Terminal 1)

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

### 3. Start Frontend (Terminal 2)

```bash
npm run dev
```

You should see:
```
serving on http://localhost:5000
```

### 4. Open Browser

Go to: **http://localhost:5000**

## ✅ How to See Connection Status

### On the Dashboard:

1. **Top Right Corner:**
   - 🟢 **"Backend Online"** badge (green) = Backend is connected
   - 🔴 **"Backend Offline"** badge (red) = Backend is not running
   - 🟢 **"Live Monitoring"** badge (green) = WebSocket connected
   - ⚪ **"Not Connected"** badge (gray) = WebSocket not connected

2. **Connection Status Box:**
   - ✅ **Green box** = "Successfully connected to Python backend at http://localhost:8000"
   - ❌ **Red box** = "Backend Connection Failed" with retry button

3. **Error Messages:**
   - If backend is offline, you'll see a red error box with:
     - "Backend Connection Failed"
     - Backend URL: http://localhost:8000
     - "Retry Connection" button
     - "Check Backend Health" button

## 🔍 Verify Connection

### Check Backend Health:
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

### Check in Browser Console (F12):
```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)
```

## 🐛 Troubleshooting

### Backend won't start?

1. **Install python-multipart:**
   ```bash
   pip install python-multipart
   ```

2. **Check dependencies:**
   ```bash
   pip list | findstr chromadb
   pip list | findstr python-multipart
   ```

3. **Check port 8000:**
   ```bash
   netstat -ano | findstr :8000
   ```

### Frontend shows "Backend Offline"?

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Check browser console (F12):**
   - Look for connection errors
   - Check Network tab for failed requests

3. **Click "Retry Connection" button** on Dashboard

## 📋 Connection Details

### Frontend → Backend:
- **REST API**: `http://localhost:8000` (configured in `client/src/lib/pythonApi.ts`)
- **WebSocket**: `ws://localhost:8000/api/ws/stream` (configured in `client/src/hooks/useWebSocket.ts`)

### Backend:
- **Port**: 8000
- **CORS**: Enabled for all origins
- **Health Check**: `http://localhost:8000/health`

## ✅ Success Indicators

When everything is connected, you'll see:

1. ✅ **Green "Backend Online" badge** (top right)
2. ✅ **Green "Live Monitoring" badge** (top right)
3. ✅ **Green success box**: "Successfully connected to Python backend at http://localhost:8000"
4. ✅ **No error messages**
5. ✅ **Data loads** (stats, insights, recommendations)

## 🎯 Next Steps

Once both servers are running and connected:

1. **Test Upload**: Go to "Upload & Analyze" page
2. **Generate Quiz**: Go to "Quiz" page
3. **View Recommendations**: Go to "Recommendations" page
4. **Set up VS Code streaming**: Next step!

