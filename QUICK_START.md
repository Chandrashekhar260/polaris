# 🚀 Quick Start - 30 Seconds Setup

## What You'll Get:
✅ Real-time code monitoring from VS Code  
✅ AI analysis of your learning patterns  
✅ Personalized recommendations dashboard  

---

## Run These 2 Commands:

### 1. Start Python Backend (in Shell)
```bash
./start_backend.sh
```

### 2. Edit & Run File Watcher (in NEW shell)
```bash
cd local_watcher
# Edit watcher.py - change line 15:
# WATCH_DIRECTORY = "/home/runner/workspace"  # ← Your VS Code path
python watcher.py
```

---

## ✅ **Frontend Already Running!**

The React dashboard is already live:
- **Running on port 5000** (check workflow: "Start application")  
- **Already connected to backend** - just needs backend to start!
- Shows connection status badge

---

## How to Know It's Working:

1. **Python backend** shows:
   ```
   INFO: Uvicorn running on http://0.0.0.0:8000
   ```

2. **Frontend** (port 5000) shows:
   - 🟢 "Live Monitoring" badge (green)
   - Stats update when you code

3. **File watcher** shows:
   ```
   Monitoring: /your/path
   Connected to backend via WebSocket
   ```

---

## What Gets Tracked:

✅ Code files: `.py .js .ts .tsx .java .cpp .go .rs .html .css`  
❌ Not tracked: PDFs, images, videos, docs

---

## Test It:

1. Create a new `.py` file in your monitored folder
2. Write some code
3. Check dashboard - you'll see new session!

---

Need detailed setup? See `SETUP_GUIDE.md`
