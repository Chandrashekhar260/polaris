# Complete Restart Guide - Fix Frontend Not Showing Messages

## 🛑 Step 1: Stop Everything

Stop all running services:

1. **Stop Python Backend**:
   - Find terminal running `python main.py`
   - Press `Ctrl+C`

2. **Stop Frontend**:
   - Find terminal running `npm run dev`
   - Press `Ctrl+C`

3. **Stop File Watcher**:
   - Find terminal running `vscode_watcher.py`
   - Press `Ctrl+C`

## ✅ Step 2: Start Services in Order

### Terminal 1: Python Backend
```cmd
cd PersonalLearningAgent/python_backend
python main.py
```

**Wait for**: `INFO:     Uvicorn running on http://0.0.0.0:8000`

### Terminal 2: Frontend
```cmd
cd PersonalLearningAgent
npm run dev
```

**Wait for**: `✅ Server running on http://127.0.0.1:5000`

### Terminal 3: File Watcher
```cmd
cd PersonalLearningAgent
python vscode_watcher.py
```

**Wait for**: 
```
✅ Connected to Learning AI Agent backend!
👀 Watching for file changes...
```

## 🔍 Step 3: Verify Connections

### Check Backend Terminal
Should show:
```
WebSocket connected. Total connections: 2
```
(One for file watcher, one for frontend)

### Check Frontend Terminal (Node.js)
Should show:
```
🔌 WebSocket client connected to Node.js server
✅ Connected to Python backend WebSocket
```

### Check Frontend Browser
1. Open: `http://localhost:5000`
2. Press `F12` (Developer Tools)
3. Go to **Console** tab
4. Should see: `WebSocket connected to Python backend`
5. Should see: `📨 WebSocket message received: analysis` (when you save a file)

## 🧪 Step 4: Test It

1. **Create a test file** in VS Code: `test.py`
2. **Add code with error**:
   ```python
   def test():
       x = 10
       print(x  # Missing closing parenthesis
   ```
3. **Save** (`Ctrl+S`)
4. **Wait 2-3 seconds**

### Check File Watcher Terminal
Should show:
```
📤 Sent: test.py (XX chars)
✓ Backend received: test.py
🧠 AI Analysis:
   ⚠️  Errors found: 1
```

### Check Frontend Terminal (Node.js)
Should show:
```
📤 Forwarding message to frontend: analysis
📤 Forwarding message to frontend: documentation
📤 Forwarding message to frontend: recommendations
📤 Forwarding message to frontend: quiz
```

### Check Browser Console
Should show:
```
📨 WebSocket message received: analysis
📨 WebSocket message received: documentation
📨 WebSocket message received: recommendations
📨 WebSocket message received: quiz
```

### Check Frontend Page
1. Go to: `http://localhost:5000`
2. Dashboard → Scroll to **"Live Suggestions"**
3. Should see:
   - ⚠️ Errors Detected
   - 📚 Documentation Suggestions
   - 💡 AI Recommendations
   - 📝 Practice Quiz Available

## 🐛 Troubleshooting

### If Frontend Still Not Showing Messages

1. **Check WebSocket Connection**:
   - Browser Console → Network → WS
   - Should see connection to `ws://localhost:5000/api/ws/stream`
   - Status should be "101 Switching Protocols"

2. **Check Backend Connection Count**:
   - Backend terminal should show: `Total connections: 2`
   - If only 1, the frontend WebSocket isn't connected

3. **Refresh Frontend**:
   - Press `F5` to refresh
   - This reconnects the WebSocket

4. **Check Node.js Server Logs**:
   - Should show: `✅ Connected to Python backend WebSocket`
   - Should show: `📤 Forwarding message to frontend: ...`

5. **Check Browser Console for Errors**:
   - Look for any red error messages
   - Check if WebSocket connection failed

## ✅ Success Indicators

- ✅ Backend shows: `Total connections: 2`
- ✅ Node.js shows: `✅ Connected to Python backend WebSocket`
- ✅ Browser console shows: `WebSocket connected`
- ✅ Browser console shows: `📨 WebSocket message received: ...`
- ✅ Frontend shows recommendations and quizzes

## 🎯 After Restart

Everything should work! The fix ensures:
1. Backend broadcasts to ALL clients
2. Node.js properly forwards messages
3. Frontend receives and displays messages

Start services in order and test! 🚀

