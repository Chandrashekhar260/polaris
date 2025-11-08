# Local File Watcher - Personal Learning AI Agent

Python script that monitors your local development directory and sends code changes to the Replit backend for AI analysis.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd local_watcher
pip install -r requirements.txt
```

### 2. Configure

Edit `config.json` to set your preferences:

```json
{
  "watch_directory": "~/Development",
  "backend_url": "ws://YOUR-REPLIT-URL.repl.co/api/ws/stream",
  "ignore_patterns": ["**/node_modules/**", "**/.git/**"]
}
```

**Important**: Update `backend_url` with your actual Replit backend URL!

### 3. Run the Watcher

```bash
python watcher.py
```

The script will:
- Monitor all code files in your watch directory
- Send changes to the backend when you save files
- Display AI analysis in the terminal in real-time

## 📁 What Files Are Monitored?

The watcher tracks these file types:
- **Python**: `.py`
- **JavaScript/TypeScript**: `.js`, `.jsx`, `.ts`, `.tsx`
- **Java**: `.java`
- **C/C++**: `.c`, `.cpp`, `.h`, `.hpp`
- **Go**: `.go`
- **Rust**: `.rs`
- **Ruby**: `.rb`
- **PHP**: `.php`
- **Web**: `.html`, `.css`, `.scss`, `.sass`
- **Config**: `.json`, `.yaml`, `.yml`, `.toml`
- **Other**: `.sql`, `.md`, `.txt`

## 🔧 Configuration Options

### `watch_directory`
The root directory to monitor. Defaults to `~/Development`.

### `backend_url`
WebSocket URL of your Replit backend. Format:
```
ws://your-replit-url.repl.co/api/ws/stream
```

### `ignore_patterns`
Directories and files to ignore. Uses glob patterns:
- `**/node_modules/**` - Ignore all node_modules
- `**/.git/**` - Ignore git directories
- `**/venv/**` - Ignore Python virtual environments

## 💡 How It Works

1. **File Changed**: You save a code file in VS Code (or any IDE)
2. **Debounced**: Waits 2 seconds to avoid duplicate events
3. **Sent to Backend**: File content streamed via WebSocket
4. **AI Analysis**: Gemini analyzes your code
5. **Results Displayed**: Topics, difficulty, and recommendations shown in terminal
6. **Stored**: Analysis saved in ChromaDB for future reference

## 📊 Example Output

```
📝 Detected change: /Users/you/Development/my-app/src/auth.ts

✅ Connected to backend
📤 Sent: auth.ts
   ✓ Backend received file

🧠 AI Analysis:
   Topics: TypeScript, Authentication, JWT
   Difficulty: intermediate
   Summary: Implementing secure JWT authentication with token refresh
   ⚠️  Watch out for: Token expiration handling, Secure storage

💡 AI Recommendations (3):
   1. JWT Security Best Practices for Token Storage
   2. Understanding Token Refresh Patterns
   3. TypeScript Type Guards in Authentication
```

## 🛑 Stopping the Watcher

Press `Ctrl+C` to gracefully stop the file watcher.

## 🔐 Security Notes

- Only sends code from your configured directory
- Never sends files from ignored directories (node_modules, etc.)
- Binary files are automatically skipped
- All data sent over WebSocket connection to your backend

## 🐛 Troubleshooting

### Connection Refused
- Verify your Replit backend is running
- Check `backend_url` in `config.json` is correct
- Ensure URL starts with `ws://` (or `wss://` for HTTPS)

### Files Not Being Detected
- Check file extension is in the monitored list
- Verify file is not in an ignored directory
- Check terminal for error messages

### Permission Errors
- Ensure you have read access to the watch directory
- Try running with appropriate permissions

## 📝 Notes

- The watcher runs continuously until you stop it
- It processes files immediately when saved
- Multiple file changes are queued and processed in order
- Very large files (>100KB) may take longer to process

## 🚀 Next Steps

Once the watcher is running:
1. Open your Replit dashboard in the browser
2. Start coding in your local IDE
3. Watch as the AI analyzes your work in real-time!

The dashboard will show:
- Recent activity feed
- AI-generated recommendations
- Learning progress over time
- Topic mastery tracking
