# How to Get Recommendations in VS Code

## Quick Steps:

### 1. Make Sure All Services Are Running

Check these are running:
- ✅ **Python Backend** (port 8000)
- ✅ **File Watcher** (vscode_watcher.py)
- ✅ **Frontend** (port 5000)

### 2. In VS Code - Just Code and Save!

**That's it!** Here's what to do:

1. **Open any code file** in VS Code (`.py`, `.js`, `.ts`, `.jsx`, `.tsx`, etc.)
2. **Write some code** (or edit existing code)
3. **Save the file** (Press `Ctrl+S` or `Cmd+S` on Mac)
4. **Wait 2-3 seconds** (the watcher has a debounce)
5. **Check the frontend** at `http://localhost:5000`

### 3. View Recommendations

**Option A: Frontend Dashboard**
1. Open browser: `http://localhost:5000`
2. Go to **Dashboard** page
3. Scroll to **"Live Suggestions"** section
4. You'll see:
   - ⚠️ Errors detected
   - 📉 Weak areas
   - 📚 Documentation suggestions
   - 💡 Recommendations
   - 📝 Quiz notifications

**Option B: Terminal Output**
- Check the terminal where `vscode_watcher.py` is running
- You'll see analysis output like:
  ```
  📤 Sent: yourfile.py (1234 chars)
  🧠 AI Analysis:
     Topics: Python, Web Development
     ⚠️  Errors found: 2
  ```

## Troubleshooting

### No Recommendations Appearing?

**Check 1: Is the file watcher running?**
```bash
# Check if watcher is running
# You should see output like:
# ✅ Connected to Learning AI Agent backend!
# 👀 Watching for file changes...
```

**Check 2: Did you save the file?**
- The watcher only triggers on **file save** (Ctrl+S)
- Just typing doesn't trigger it
- You must **save** the file

**Check 3: Is the file type supported?**
Supported: `.py`, `.js`, `.jsx`, `.ts`, `.tsx`, `.java`, `.cpp`, `.html`, `.css`, `.sql`, `.md`

**Check 4: Is the file in an ignored directory?**
Ignored: `node_modules`, `.git`, `__pycache__`, `dist`, `build`, `.vscode`

**Check 5: Is the backend running?**
```bash
# Test backend
curl http://localhost:8000/health
# Should return: {"status": "healthy", ...}
```

**Check 6: Check WebSocket connection**
- Open browser console (F12)
- Go to Network tab → WS (WebSocket)
- Should see connection to `ws://localhost:5000/api/ws/stream` or `ws://localhost:8000/api/ws/stream`

## Test It Right Now!

1. **Create a test file** in VS Code:
   - File → New File
   - Save as `test.py` (or any supported extension)

2. **Add some code with an error:**
   ```python
   def test():
       x = 10
       print(x
       # Missing closing parenthesis - this is an error!
   ```

3. **Save the file** (Ctrl+S)

4. **Wait 2-3 seconds**

5. **Check frontend** at `http://localhost:5000` → Dashboard → Live Suggestions

6. **You should see:**
   - ⚠️ Error detected: "Missing closing parenthesis"
   - 📚 Documentation suggestion for Python syntax
   - 📉 Weak area: "Syntax errors"

## What Happens Behind the Scenes

```
You save file in VS Code (Ctrl+S)
    ↓
File watcher detects change
    ↓
Sends code to Python backend via WebSocket
    ↓
Backend analyzes with AI (Gemini)
    ↓
Backend sends analysis back via WebSocket
    ↓
Frontend receives and displays in "Live Suggestions"
```

## Pro Tips

1. **Save frequently** - Each save triggers analysis
2. **Check frontend regularly** - Recommendations update in real-time
3. **Fix errors** - When you fix an error and save, new analysis appears
4. **Watch terminal** - See immediate feedback in the watcher terminal

## Still Not Working?

1. **Restart the file watcher:**
   ```bash
   # Stop it (Ctrl+C) and restart:
   python vscode_watcher.py
   ```

2. **Check backend logs** for errors

3. **Verify GOOGLE_API_KEY** is set in `python_backend/.env`

4. **Check file path** - Make sure you're saving files in the watched directory

That's it! Just code, save, and check the frontend! 🚀

