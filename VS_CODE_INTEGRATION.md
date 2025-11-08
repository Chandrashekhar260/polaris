# VS Code Live Integration Guide

This guide explains how to set up live code streaming from VS Code to the Learning AI Agent backend.

## Features

- **Real-time Code Analysis**: Automatically analyzes code as you type
- **Error Detection**: Identifies syntax errors, logic errors, and best practice violations
- **Weak Area Identification**: Detects areas where you need improvement
- **Documentation Suggestions**: Provides relevant documentation links based on errors
- **Dynamic Quizzes**: Generates quizzes based on your weak areas
- **Live Suggestions**: See suggestions in real-time in the frontend

## Setup

### 1. Install Dependencies

```bash
cd PersonalLearningAgent
pip install watchdog websockets
```

Or install all dependencies:
```bash
pip install -r requirements.txt
```

### 2. Start the Backend

Make sure the Python backend is running:

```bash
cd python_backend
python main.py
```

The backend should be running on `http://localhost:8000`

### 3. Start the File Watcher

In a new terminal, run the VS Code watcher:

```bash
cd PersonalLearningAgent
python vscode_watcher.py
```

The watcher will:
- Monitor all code files in the current directory
- Send file changes to the backend via WebSocket
- Display analysis results in the terminal

### 4. Start the Frontend

In another terminal, start the React frontend:

```bash
cd client
npm run dev
```

Open `http://localhost:5000` (or the port shown) in your browser.

## How It Works

1. **File Watcher** (`vscode_watcher.py`):
   - Watches for file changes in your project directory
   - Sends code content to the backend when files are modified
   - Receives analysis, suggestions, and quizzes from the backend

2. **Backend Analysis**:
   - Receives code via WebSocket
   - Analyzes code using AI (Gemini) for:
     - Topics and concepts
     - Errors and issues
     - Weak areas
   - Generates documentation suggestions
   - Creates quizzes based on weak areas
   - Stores everything in the database

3. **Frontend Display**:
   - Shows live suggestions in the Dashboard
   - Displays errors with severity levels
   - Shows weak areas that need improvement
   - Provides documentation links
   - Shows available quizzes

## Configuration

### Watch Directory

Edit `vscode_watcher.py` to change the watched directory:

```python
WATCH_DIRECTORY = "/path/to/your/project"  # Default: current directory
```

### Ignored Patterns

Files matching these patterns are ignored:
- `node_modules`
- `.git`
- `__pycache__`
- `.env`
- `dist`, `build`, `.next`
- `.vscode`, `.idea`

### Supported File Types

The watcher monitors these file extensions:
- `.py`, `.js`, `.jsx`, `.ts`, `.tsx`
- `.java`, `.cpp`, `.c`
- `.go`, `.rs`
- `.html`, `.css`
- `.sql`, `.md`, `.pdf`

## Usage

1. **Start all services** (backend, watcher, frontend)
2. **Open VS Code** and start coding
3. **Save files** - the watcher will detect changes
4. **View suggestions** in the frontend Dashboard under "Live Suggestions"

## Message Types

The WebSocket connection sends these message types:

- `connected`: Initial connection confirmation
- `received`: File received by backend
- `analysis`: Code analysis results
- `documentation`: Documentation suggestions
- `recommendations`: Learning recommendations
- `quiz`: Generated quiz questions
- `error`: Error messages

## Troubleshooting

### Connection Refused

If you see "Connection refused":
- Make sure the backend is running on port 8000
- Check firewall settings
- Verify the WebSocket URL in `vscode_watcher.py`

### No Suggestions Appearing

- Check that files are being saved
- Verify the file extension is supported
- Check backend logs for errors
- Ensure `GOOGLE_API_KEY` is set in `.env`

### Too Many Messages

The watcher has a 2-second debounce to prevent spam. Adjust in `vscode_watcher.py`:

```python
self.debounce_time = 2  # seconds
```

## Next Steps

- Create a VS Code extension for better integration
- Add support for more file types
- Implement code snippet suggestions
- Add real-time error highlighting in VS Code

