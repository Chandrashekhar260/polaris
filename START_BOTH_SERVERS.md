# Quick Start Guide - Personal Learning AI Agent

## Current Status ⚠️

**Frontend**: ✅ Running on port 5000 (via Replit workflow)  
**Backend**: ❌ Needs workflow configuration (see below)

The Python backend is fully coded and tested, but Replit requires it to run as a workflow rather than a background process. You need to complete one configuration step.

## Option 1: Add Backend to Replit Workflow (Recommended - 2 minutes)

1. **Click the "Workflows" icon** in the left sidebar (or press `Cmd/Ctrl + K` and search "Workflow")

2. **Edit the "Start application" workflow**:
   - Click the pencil/edit icon next to "Start application"
   - Scroll down to "Tasks"
   - Click "+ Add Task"

3. **Configure the Python backend task**:
   - Task Type: **Execute Shell Command**
   - Command: `./start_python_backend.sh`
   - Wait for port: `8000`

4. **Save and run**:
   - Click "Save"
   - Click the big green "Run" button at the top
   - Both servers will start!

5. **Verify it's working**:
   - Open the web view (should show the dashboard)
   - Check backend: `curl http://localhost:8000/health`

## Option 2: Quick Manual Test (Temporary)

If you just want to test the backend quickly without configuring workflows:

```bash
# In a terminal, run:
./RUN_MANUALLY.sh
```

**Note**: This will only work while your terminal session is active. Use Option 1 for a permanent solution.

## What You Built

### Frontend (React + TypeScript)
- ✅ Dashboard with learning insights
- ✅ Recommendations page
- ✅ Real-time WebSocket connection
- ✅ Error handling with retry UI
- ✅ Loading states and skeletons
- ✅ Dark mode support

### Backend (Python FastAPI)
- ✅ REST API endpoints for insights, recommendations, summaries
- ✅ WebSocket streaming for real-time code analysis
- ✅ Graceful degradation (works without API keys)
- ✅ ChromaDB vector storage (optional)
- ✅ Google Gemini AI integration (optional)

### File Watcher (Python)
- ✅ Monitors local code files for changes
- ✅ Sends changes to backend for analysis
- ✅ Configurable file types and ignore patterns

## Next Steps

1. **Configure the workflow** (Option 1 above) - takes 2 minutes

2. **Add your Google API key** (optional - for full AI features):
   ```bash
   # In Replit Secrets (lock icon in left sidebar):
   Key: GOOGLE_API_KEY
   Value: your-api-key-here
   ```
   
3. **Start the file watcher** (optional - for real-time code tracking):
   ```bash
   cd local_watcher
   python watcher.py /path/to/your/code
   ```

4. **Switch to full AI backend** (optional - after adding API key):
   - Edit `start_python_backend.sh`
   - Change `simple_backend.py` to `main.py`
   - Restart the workflow

## Troubleshooting

**"Backend not responding"**:
- Make sure you completed the workflow configuration (Option 1)
- Check that port 8000 isn't blocked
- View logs in the Replit console

**"WebSocket keeps disconnecting"**:
- The backend needs to be running on port 8000
- Check that `VITE_PYTHON_WS_URL` is set to `ws://localhost:8000`

**"Frontend shows errors"**:
- Check browser console (F12) for specific errors
- Verify both servers are running
- Try refreshing the page

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐
│   Browser       │────────▶│  Node.js + Vite  │
│  (React App)    │  HTTP   │   Port 5000      │
└─────────────────┘         └──────────────────┘
         │
         │ HTTP/WS
         ▼
┌──────────────────┐         ┌──────────────────┐
│  Python FastAPI  │────────▶│  Google Gemini   │
│   Port 8000      │   AI    │   API (optional) │
└──────────────────┘         └──────────────────┘
         │
         ▼
┌──────────────────┐
│    ChromaDB      │
│  Vector Storage  │
└──────────────────┘
         ▲
         │
┌──────────────────┐
│  File Watcher    │
│  (Local Python)  │
└──────────────────┘
```

## Files You Can Customize

- `client/src/pages/Dashboard.tsx` - Main dashboard UI
- `client/src/pages/Recommendations.tsx` - Recommendations page
- `python_backend/services/ai_agent.py` - AI analysis logic
- `python_backend/simple_backend.py` - Simplified backend (no AI)
- `local_watcher/watcher.py` - File monitoring configuration

## Support

For detailed setup instructions, see:
- `BACKEND_SETUP.md` - Detailed workflow configuration
- `QUICK_START.md` - Original quick start guide
- `replit.md` - Technical architecture documentation
