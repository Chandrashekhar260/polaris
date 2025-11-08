# VS Code Integration Setup

This guide shows you how to connect VS Code (or any editor) to the Learning AI Agent for real-time code analysis.

## Quick Start

### Option 1: Use the Batch/Script File (Easiest)

**Windows:**
```bash
start_vscode_watcher.bat
```

**Linux/Mac:**
```bash
chmod +x start_vscode_watcher.sh
./start_vscode_watcher.sh
```

### Option 2: Manual Start

1. **Make sure backend is running:**
   ```bash
   cd python_backend
   python main.py
   ```

2. **Start the file watcher:**
   ```bash
   python vscode_watcher.py
   ```

3. **Start coding in VS Code!** Just save files and they'll be analyzed automatically.

## VS Code Task Integration

### Using VS Code Tasks

1. Open VS Code in the project directory
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Tasks: Run Task"
4. Select one of:
   - **Start File Watcher** - Just the file watcher
   - **Start All Services** - Backend + Watcher + Frontend

### Auto-start on Folder Open

The task configuration is set to auto-start the file watcher when you open the folder. To disable this, edit `.vscode/tasks.json` and remove the `runOptions` section.

## How It Works

```
VS Code (You code here)
    ↓ (Save file)
File Watcher (vscode_watcher.py)
    ↓ (WebSocket)
Python Backend (Analysis)
    ↓ (WebSocket)
Frontend Dashboard (See suggestions)
```

## Configuration

### Change Watched Directory

Set the `WATCH_DIR` environment variable:

**Windows:**
```cmd
set WATCH_DIR=C:\path\to\your\project && python vscode_watcher.py
```

**Linux/Mac:**
```bash
export WATCH_DIR=/path/to/your/project
python3 vscode_watcher.py
```

### Use Node.js Proxy (Same Port)

If you want to use the Node.js WebSocket proxy (port 5000 instead of 8000):

**Windows:**
```cmd
set WS_URL=ws://localhost:5000/api/ws/stream && python vscode_watcher.py
```

**Linux/Mac:**
```bash
export WS_URL=ws://localhost:5000/api/ws/stream
python3 vscode_watcher.py
```

## What Gets Analyzed

The watcher monitors these file types:
- `.py`, `.js`, `.jsx`, `.ts`, `.tsx`
- `.java`, `.cpp`, `.c`
- `.go`, `.rs`
- `.html`, `.css`
- `.sql`, `.md`, `.pdf`

## Ignored Files

These are automatically ignored:
- `node_modules`, `.git`, `__pycache__`
- `.env`, `dist`, `build`, `.next`
- `.vscode`, `.idea`

## Viewing Results

1. **Terminal Output**: The watcher shows analysis in the terminal
2. **Frontend Dashboard**: Open `http://localhost:5000` and check "Live Suggestions"
3. **VS Code Output Panel**: If using VS Code tasks, check the Output panel

## Troubleshooting

### "Connection refused"

- Make sure Python backend is running on port 8000
- Check: `curl http://localhost:8000/health`

### "No suggestions appearing"

- Make sure you're saving files (Ctrl+S)
- Check that file extension is supported
- Verify `GOOGLE_API_KEY` is set in `.env`

### "Too many messages"

The watcher has a 2-second debounce. To change it, edit `vscode_watcher.py`:
```python
self.debounce_time = 5  # Wait 5 seconds instead
```

## Advanced: VS Code Extension

For a more integrated experience, you could create a VS Code extension that:
- Shows suggestions in the editor
- Highlights errors inline
- Provides quick fixes
- Shows documentation links in hover tooltips

This would require creating a VS Code extension using the VS Code Extension API.

## Next Steps

1. **Start coding** - The watcher will automatically analyze your code
2. **Check the frontend** - See live suggestions at `http://localhost:5000`
3. **Review analysis** - Check terminal output for detailed analysis
4. **Take quizzes** - Generated quizzes appear in the frontend based on weak areas

Happy coding! 🚀

