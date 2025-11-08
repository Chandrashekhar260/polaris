# Quick Start: Get Live Code from VS Code

## Step-by-Step Guide

### 1. Start the Python Backend (if not already running)

```bash
cd python_backend
python main.py
```

You should see: `INFO:     Uvicorn running on http://0.0.0.0:8000`

### 2. Start the File Watcher

**Option A: Use the batch file (Windows)**
```bash
start_vscode_watcher.bat
```

**Option B: Run directly**
```bash
python vscode_watcher.py
```

You should see:
```
🔌 Connecting to ws://localhost:8000/api/ws/stream...
📁 Watching directory: C:\Users\...\PersonalLearningAgent
✅ Connected to Learning AI Agent backend!
👀 Watching for file changes...
   Press Ctrl+C to stop
```

### 3. Open VS Code and Start Coding!

1. Open VS Code in your project folder
2. Open any code file (`.py`, `.js`, `.ts`, etc.)
3. Make changes and **save the file** (Ctrl+S)
4. The watcher will automatically:
   - Detect the file change
   - Send it to the backend
   - Get AI analysis
   - Show results in terminal and frontend

### 4. View Live Suggestions

**In Terminal:**
- You'll see analysis output like:
  ```
  📤 Sent: app.py (1234 chars)
  🧠 AI Analysis:
     Topics: Python, Web Development
     Difficulty: intermediate
     ⚠️  Errors found: 2
     📉 Weak areas: Error Handling, Type Hints
  ```

**In Frontend:**
- Open `http://localhost:5000` in your browser
- Go to Dashboard
- Check the "Live Suggestions" section
- You'll see:
  - Errors detected
  - Weak areas
  - Documentation suggestions
  - Quiz notifications

## How It Works

```
VS Code Editor
    ↓ (You save file: Ctrl+S)
File System (File changed)
    ↓ (Detected by watchdog)
vscode_watcher.py
    ↓ (Sends via WebSocket)
Python Backend (Port 8000)
    ↓ (AI Analysis)
    ├─→ Terminal Output
    └─→ Frontend Dashboard (Port 5000)
```

## Test It Now!

1. **Create a test file** in VS Code:
   ```python
   # test.py
   def hello():
       print("Hello World")
       return None
   ```

2. **Save it** (Ctrl+S)

3. **Watch the terminal** - you should see:
   ```
   📤 Sent: test.py (45 chars)
   ✓ Backend received: test.py
   🧠 AI Analysis:
      Topics: Python
      Difficulty: beginner
   ```

4. **Check the frontend** at `http://localhost:5000` - suggestions will appear!

## Configuration

### Watch a Different Directory

**Windows:**
```cmd
set WATCH_DIR=C:\path\to\your\code && python vscode_watcher.py
```

**Linux/Mac:**
```bash
export WATCH_DIR=/path/to/your/code
python3 vscode_watcher.py
```

### Use Node.js Proxy (Same Port as Frontend)

If you want to use the Node.js WebSocket proxy:

**Windows:**
```cmd
set WS_URL=ws://localhost:5000/api/ws/stream && python vscode_watcher.py
```

**Linux/Mac:**
```bash
export WS_URL=ws://localhost:5000/api/ws/stream
python3 vscode_watcher.py
```

## Supported File Types

The watcher automatically monitors:
- **Python**: `.py`
- **JavaScript/TypeScript**: `.js`, `.jsx`, `.ts`, `.tsx`
- **Web**: `.html`, `.css`
- **Other**: `.java`, `.cpp`, `.c`, `.go`, `.rs`, `.sql`, `.md`

## Troubleshooting

### "Connection refused"
- Make sure Python backend is running: `python python_backend/main.py`
- Check: `curl http://localhost:8000/health`

### "No file detected"
- Make sure you're **saving** the file (Ctrl+S)
- Check file extension is supported
- Verify file is not in ignored directory (node_modules, .git, etc.)

### "No analysis appearing"
- Check backend logs for errors
- Verify `GOOGLE_API_KEY` is set in `python_backend/.env`
- Check terminal output from watcher

## Pro Tips

1. **Keep the watcher running** - It will monitor all file changes automatically
2. **Check frontend regularly** - Suggestions update in real-time
3. **Save frequently** - Each save triggers analysis
4. **Watch terminal** - See immediate feedback

## Next: Create VS Code Extension

For even better integration, you could create a VS Code extension that:
- Shows suggestions directly in the editor
- Highlights errors inline
- Provides quick documentation links
- Shows weak areas as warnings

But for now, the file watcher works great! 🚀

