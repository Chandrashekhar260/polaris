# Python Backend Setup Guide

## The Problem
The Python FastAPI backend must run as a Replit workflow (not a background bash process) or Replit's process supervisor will kill it.

## Solution: Add Python Backend to Replit Workflow

### Option 1: Manual UI Configuration (Recommended)

1. **Open the Workflow tool**: 
   - Press `Command + K` (Mac) or `Ctrl + K` (Windows/Linux)
   - Search for "Workflow"
   - Click "Workflow tool"

2. **Edit the "Start application" workflow**:
   - Find the existing "Start application" workflow
   - Click "Edit"
   - Add a new task:
     - **Task type**: Execute Shell Command
     - **Command**: `./start_python_backend.sh`
     - **Wait for port**: `8000`

3. **Save and Run**:
   - Click "Save"
   - Click "Run" button
   - Both frontend (port 5000) and backend (port 8000) should start

### Option 2: Edit .replit File Directly

If you prefer to edit the configuration file manually:

1. Open `.replit` file
2. Find the `[[workflows.workflow]]` section for "Start application"
3. Add this new task AFTER the existing npm task:

```toml
[[workflows.workflow.tasks]]
task = "shell.exec"
args = "./start_python_backend.sh"
waitForPort = 8000
```

The complete workflow section should look like:

```toml
[[workflows.workflow]]
name = "Start application"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 5000

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "./start_python_backend.sh"
waitForPort = 8000
```

### Option 3: Use Concurrently (Alternative)

If workflows don't work, you can run both servers from npm:

1. Update `package.json` scripts section:
```json
"scripts": {
  "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
  "dev:frontend": "NODE_ENV=development tsx server/index.ts",
  "dev:backend": "cd python_backend && python -u simple_backend.py"
}
```

2. Run `npm run dev`

## Verification

After setup, verify both services are running:

```bash
# Check frontend
curl http://localhost:5000

# Check Python backend
curl http://localhost:8000/health

# Check API endpoints
curl http://localhost:8000/api/insights
curl http://localhost:8000/api/recommendations
curl http://localhost:8000/api/summary/stats
```

## Files Created

- `start_python_backend.sh` - Launches the Python backend
- `python_backend/simple_backend.py` - Simplified FastAPI server (no AI dependencies)
- `keep_backend_alive.sh` - Auto-restart script (not needed if using workflows)

## Next Steps

1. Set up the workflow using one of the options above
2. Start coding! The file watcher (`local_watcher/watcher.py`) will detect your changes
3. Add your `GOOGLE_API_KEY` secret for full AI functionality
4. Switch from `simple_backend.py` to `main.py` when ready for full AI features

## Troubleshooting

**Backend won't start:**
- Check port 8000 isn't already in use: `lsof -i :8000`
- View backend logs: `cat /tmp/backend_keeper.log`
- Ensure script is executable: `chmod +x start_python_backend.sh`

**Frontend can't connect to backend:**
- Verify backend is running: `curl http://localhost:8000/health`
- Check CORS settings in `python_backend/simple_backend.py`
- Ensure `VITE_PYTHON_API_URL=http://localhost:8000` in environment

**WebSocket disconnects:**
- Backend must be running on port 8000
- Check `VITE_PYTHON_WS_URL=ws://localhost:8000` environment variable
- View browser console for connection errors
