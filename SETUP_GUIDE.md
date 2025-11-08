# Personal Learning AI Agent - Setup Guide

## 🎯 What This System Does

**Monitors your VS Code coding** → **AI analyzes your learning patterns** → **Shows insights & recommendations in a dashboard**

### What Gets Tracked:
- ✅ **Code files**: `.py`, `.js`, `.jsx`, `.ts`, `.tsx`, `.java`, `.cpp`, `.go`, `.rs`, `.html`, `.css`, `.sql`, etc.
- ❌ **Not tracked**: PDFs, images, videos, or other non-code files

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start the Python Backend

The Python backend provides AI analysis and stores learning data.

```bash
# In Replit Shell
cd python_backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

You should see:
```
⚠️  Running in mock mode - GOOGLE_API_KEY not configured
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Note:** Without GOOGLE_API_KEY, it runs in "mock mode" with basic analysis. This is fine for testing!

### Step 2: Frontend is Already Running! ✅

The React dashboard is already running on port 5000 in the "Start application" workflow.

**Open it in your browser** and you'll see:
- Dashboard with stats
- Recommendations page
- Connection status (should show "Live Monitoring" once backend is running)

### Step 3: Connect Your VS Code Projects

To monitor your coding activity, run the file watcher:

```bash
# In a NEW terminal/shell
cd local_watcher
python watcher.py
```

**IMPORTANT:** Edit `watcher.py` first to set your VS Code project path:

```python
# In watcher.py, change this line:
WATCH_DIRECTORY = "/path/to/your/vscode/projects"  # ← Change this!

# Example:
WATCH_DIRECTORY = "/home/runner/workspace"  # Monitor this Replit workspace
# Or:
WATCH_DIRECTORY = "/home/yourname/code/my-project"  # Monitor a specific project
```

---

## 🔗 How Everything Connects

```
VS Code Files → File Watcher → WebSocket → Python Backend → AI Analysis
                                                    ↓
Frontend (React Dashboard) ← REST API ← Python Backend (stores data)
```

1. **File Watcher** monitors your code directory
2. Sends code changes via **WebSocket** to Python backend
3. **Python backend** analyzes with AI (or mock mode)
4. Stores insights in **ChromaDB** vector database
5. **Frontend dashboard** fetches and displays:
   - Recent coding sessions
   - Topics you're learning
   - AI-generated recommendations
   - Learning statistics

---

## 📊 Viewing Your Data

Once everything is running:

1. **Dashboard** (http://localhost:5000) - Main overview
   - Total sessions
   - Topics learned
   - Recent activity
   - Quick recommendations

2. **Recommendations** page - Filtered AI suggestions
   - Filter by difficulty (beginner/intermediate/advanced)
   - Filter by type (tutorial/documentation/video)

3. **Connection Status Badge**
   - 🟢 "Live Monitoring" = Everything connected
   - 🔴 "Not Connected" = Python backend offline

---

## 🔑 Optional: Add Real AI (Google Gemini)

For real AI-powered insights instead of mock mode:

1. Get a Google Gemini API key from: https://makersuite.google.com/app/apikey

2. Add to `.env` file:
```bash
GOOGLE_API_KEY=your_api_key_here
```

3. Restart Python backend

Now you'll get:
- Real code analysis with topics, concepts, difficulty
- Personalized learning recommendations
- Progress summaries with AI insights

---

## 🐛 Troubleshooting

### "Backend Offline" warning in dashboard
→ Python backend not running. Start it with step 1 above.

### WebSocket errors in browser console
→ Normal! Means frontend is trying to connect. Start Python backend.

### No activity showing up
→ Make sure file watcher is running AND watching the right directory.

### "Running in mock mode" message
→ No GOOGLE_API_KEY set. System works but with basic analysis only.

---

## 📁 Project Structure

```
workspace/
├── python_backend/          # FastAPI backend (port 8000)
│   ├── main.py             # Main server
│   ├── services/           # AI agent, vector store, WebSocket
│   └── routes/             # API endpoints
├── local_watcher/          # File monitoring script
│   └── watcher.py         # Monitors VS Code directory
├── client/                 # React frontend (port 5000)
│   └── src/
│       ├── pages/         # Dashboard, Recommendations
│       ├── hooks/         # useLearningData, useWebSocket
│       └── lib/           # API client
└── server/                # Node.js/Express (serves frontend)
```

---

## ✨ Features

- **Real-time monitoring** via WebSocket
- **AI code analysis** (with Gemini API)
- **Vector search** across learning sessions (ChromaDB)
- **Personalized recommendations** based on your coding
- **Progress tracking** and statistics
- **Works offline** with mock mode
- **Error handling** with retry buttons

---

## 🎓 Example Usage

1. Start Python backend
2. Start coding in VS Code (in monitored directory)
3. File watcher detects changes
4. Python backend analyzes your code
5. Refresh dashboard to see:
   - "Working on authentication.ts - TypeScript, Security"
   - Topics: ["TypeScript", "Authentication", "Security"]
   - Recommendation: "Learn about JWT best practices"

---

Need help? Check the logs or see `replit.md` for technical architecture details.
