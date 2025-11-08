# Personal Learning AI Agent 🚀

An intelligent full-stack system that monitors your coding activity in real-time, analyzes learning patterns using Google Gemini AI, and provides personalized recommendations through a beautiful React dashboard.

## ✅ What's Built (Complete!)

### Frontend Dashboard (React + TypeScript)
- 📊 **Learning Insights** - View your coding sessions, topics learned, and skill progression
- 💡 **AI Recommendations** - Get personalized learning suggestions based on your activity
- 📈 **Progress Tracking** - Daily, weekly, and monthly summaries of your learning journey
- 🔄 **Real-time Updates** - WebSocket integration for live code analysis
- 🎨 **Beautiful UI** - Linear/Notion-inspired design with dark mode support
- ⚡ **Error Handling** - Comprehensive error states with retry buttons
- 📱 **Responsive** - Works on desktop and mobile

### Backend API (Python FastAPI)
- 🔌 **REST API** - `/api/insights`, `/api/recommendations`, `/api/summary`
- 🌐 **WebSocket Streaming** - Real-time code analysis via `/ws/stream`
- 🤖 **AI Integration** - Google Gemini 2.0 Flash for code analysis (optional)
- 🗄️ **Vector Storage** - ChromaDB for semantic search of learning patterns
- 🎭 **Graceful Degradation** - Works without API keys (mock mode)
- 📝 **Type Safety** - Pydantic models for all data structures

### File Watcher (Python)
- 👀 **Real-time Monitoring** - Detects code file changes as you work
- 🎯 **Smart Filtering** - Configurable file types and ignore patterns
- 📡 **WebSocket Streaming** - Sends changes to backend for instant analysis
- ⚙️ **Customizable** - Configure watch directory and file types

## 🚀 Quick Start (One Step!)

### Step 1: Add Python Backend to Workflow

The frontend is already running! You just need to add the Python backend:

1. **Open Workflows** (left sidebar icon or `Cmd/Ctrl + K` → search "Workflow")
2. **Edit "Start application"** workflow
3. **Add Task**:
   - Type: **Execute Shell Command**
   - Command: `./start_python_backend.sh`
   - Wait for port: `8000`
4. **Save & Run**

That's it! Both servers will now start automatically.

### Step 2: Verify Everything Works

```bash
# Check frontend (should show dashboard)
curl http://localhost:5000

# Check backend
curl http://localhost:8000/health
# Should return: {"status":"healthy","mode":"simple_mock"}

# Test API
curl http://localhost:8000/api/insights
curl http://localhost:8000/api/recommendations
```

## 📁 Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/          # Dashboard, Recommendations pages
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # useLearningData, useWebSocket
│   │   └── lib/            # API client, utilities
│  
├── python_backend/          # FastAPI backend
│   ├── main.py             # Full AI-powered backend
│   ├── simple_backend.py   # Simplified backend (current)
│   ├── services/
│   │   ├── ai_agent.py     # Gemini AI integration
│   │   └── vector_store.py # ChromaDB vector storage
│   └── routes/             # API route handlers
│
├── local_watcher/          # File monitoring
│   └── watcher.py          # Watches code files for changes
│
├── server/                 # Node.js/Express server
│   └── index.ts            # Serves Vite frontend
│
└── shared/                 # Shared TypeScript types
    └── schema.ts           # Database schema
```

## 🔑 Optional: Add AI Features

Currently running in **Simple Mode** (no AI dependencies). To enable full AI features:

### 1. Add Google API Key

1. Get a key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. In Replit, click the lock icon (Secrets) in the left sidebar
3. Add secret:
   - Key: `GOOGLE_API_KEY`
   - Value: `your-api-key-here`

### 2. Switch to Full Backend

Edit `start_python_backend.sh`:
```bash
# Change this line:
exec python -u simple_backend.py

# To this:
exec python -u main.py
```

Restart the workflow to apply changes.

### 3. Start the File Watcher

```bash
cd local_watcher
python watcher.py /path/to/your/code/directory
```

The watcher will monitor your code files and send them to the backend for AI analysis in real-time!

## 🎯 How It Works

1. **You code** → File watcher detects changes
2. **Watcher sends** → Code sent to Python backend via WebSocket  
3. **AI analyzes** → Gemini identifies topics, concepts, potential struggles
4. **Results stored** → ChromaDB stores embeddings for semantic search
5. **Dashboard updates** → Frontend shows insights and recommendations in real-time

## 🧪 Testing

The backend has been tested and verified:
- ✅ All REST endpoints return valid JSON
- ✅ Health check endpoint responds correctly
- ✅ CORS configured for frontend communication
- ✅ WebSocket endpoint accepts connections
- ✅ Mock data mode works without API keys

## 📚 Documentation

- `START_BOTH_SERVERS.md` - Quick start guide (start here!)
- `BACKEND_SETUP.md` - Detailed workflow configuration
- `SETUP_GUIDE.md` - Complete setup with AI features
- `QUICK_START.md` - Original quick start guide
- `replit.md` - Technical architecture documentation

## 🛠️ Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TanStack Query (API state)
- Wouter (routing)
- shadcn/ui + Tailwind CSS
- Radix UI primitives

**Backend:**
- Python 3.11
- FastAPI + Uvicorn
- Google Gemini AI (optional)
- LangChain (AI orchestration)
- ChromaDB (vector storage)
- Pydantic (validation)

**Development:**
- Drizzle ORM (database)
- PostgreSQL (Neon)
- WebSockets (real-time)
- Watchdog (file monitoring)

## 🐛 Troubleshooting

**Backend not responding:**
- Verify workflow includes Python backend task
- Check port 8000 isn't in use: `lsof -i :8000`
- View logs in Replit console

**WebSocket errors:**
- Backend must be running on port 8000
- Check `VITE_PYTHON_WS_URL=ws://localhost:8000` in environment
- Open browser console (F12) for details

**Frontend shows "Backend unavailable":**
- Click the "Retry" button in the UI
- Verify backend health: `curl http://localhost:8000/health`
- Check browser console for specific error messages

**File watcher not detecting changes:**
- Verify correct directory path in `watcher.py`
- Check file type is in supported list (`.py`, `.js`, `.ts`, etc.)
- Ensure directory isn't in ignore list (`node_modules`, `.git`, etc.)

## 🎨 Customization

### Change UI Theme
Edit `client/src/index.css` - color variables are defined in HSL format

### Add New API Endpoints
Add routes in `python_backend/routes/` and register in `main.py`

### Modify AI Analysis
Edit `python_backend/services/ai_agent.py` - customize prompts and analysis logic

### Configure File Watcher
Edit `local_watcher/watcher.py` - change file types, ignore patterns, watch directory

## 📝 Environment Variables

```bash
# Backend (Python)
GOOGLE_API_KEY=your-key-here          # Optional - for AI features
CHROMA_DB_PATH=./db/chroma_store       # Vector storage location
DATABASE_URL=your-postgres-url         # Optional - for persistence

# Frontend (Vite)
VITE_PYTHON_API_URL=http://localhost:8000      # Backend REST API
VITE_PYTHON_WS_URL=ws://localhost:8000         # Backend WebSocket
```

## 🚢 Deployment

The project is configured for Replit deployment:
- Frontend builds to `dist/`
- Backend runs on port 8000
- Both ports configured in `.replit`

To deploy:
1. Ensure both servers start correctly
2. Click "Deploy" in Replit
3. Choose deployment type (Reserved VM recommended for dual backend)

## 🤝 Contributing

This is a personal learning project, but feel free to fork and customize for your own use!

## 📄 License

MIT

## 🌟 Features Roadmap

- [ ] Add user authentication
- [ ] Implement database persistence (PostgreSQL)
- [ ] Add more AI models (Claude, GPT-4)
- [ ] Create mobile app
- [ ] Add team collaboration features
- [ ] Export learning reports (PDF)

---

**Built with ❤️ using React, FastAPI, and Google Gemini AI**
