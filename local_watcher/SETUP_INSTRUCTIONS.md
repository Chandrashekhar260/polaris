# VS Code Integration Setup Guide

## Connect Your Local VS Code to the Learning AI Agent

This guide helps you set up the local file watcher to monitor your VS Code coding activity and send it to the Replit backend for AI analysis.

### Prerequisites

- Python 3.8 or higher installed on your local machine
- VS Code or any code editor
- Internet connection

### Step 1: Install Python Dependencies

Open a terminal on your **local machine** (not Replit) and navigate to where you want to save the watcher files.

```bash
# Install required packages
pip install watchdog websockets
```

### Step 2: Download Watcher Files

Download these two files from your Replit project to your local machine:
- `local_watcher/watcher.py`
- `local_watcher/config.json`

Put them in a folder on your local machine, for example:
```
~/PersonalLearningAI/
  ├── watcher.py
  └── config.json
```

### Step 3: Configure the Watcher

Edit the `config.json` file on your local machine:

```json
{
  "watch_directory": "~/Development",
  "backend_url": "wss://workspace-arunviraktamat1.replit.dev/api/ws/stream",
  "ignore_patterns": [
    "**/node_modules/**",
    "**/.git/**",
    "**/venv/**",
    "**/__pycache__/**",
    "**/dist/**",
    "**/build/**"
  ]
}
```

**Important configurations:**

1. **watch_directory**: Change this to the folder where you keep your code projects
   - Windows example: `"C:/Users/YourName/Documents/Code"`
   - Mac/Linux example: `"~/Development"` or `"/Users/yourname/projects"`

2. **backend_url**: Use your Replit app URL with WebSocket protocol:
   - Replace with: `wss://YOUR-REPLIT-URL/api/ws/stream`
   - The URL format is: `wss://workspace-arunviraktamat1.replit.dev/api/ws/stream`

### Step 4: Run the Watcher

Open a terminal in the folder where you saved the watcher files:

```bash
python watcher.py
```

You should see:
```
🚀 Personal Learning AI Agent - File Watcher
============================================================
📁 Watching: /Users/yourname/Development
🔗 Backend: wss://workspace-arunviraktamat1.replit.dev/api/ws/stream
📝 Config: config.json

✨ Monitoring started. Edit any code file to see AI analysis!

Press Ctrl+C to stop.
```

### Step 5: Test It Out

1. Open VS Code and open a project in your watched directory
2. Edit any code file (`.py`, `.js`, `.tsx`, etc.)
3. Save the file
4. Watch the terminal - you'll see:
   ```
   📝 Detected change: /path/to/your/file.js
   ✅ Connected to backend
   📤 Sent: file.js
      ✓ Backend received file
   
   🧠 AI Analysis:
      Topics: React, TypeScript, Frontend
      Difficulty: intermediate
      Summary: [AI-generated summary of what you're learning]
   
   💡 AI Recommendations (3):
      1. [Personalized learning suggestion]
      2. [Resource recommendation]
      3. [Practice exercise]
   ```

5. Open your Replit app in the browser - the dashboard will update in real-time with:
   - New learning insights
   - AI-generated recommendations
   - Live suggestions as you code
   - Learning progress statistics

### Troubleshooting

**Connection Failed:**
- Make sure your Replit app is running (check the Webview)
- Verify the `backend_url` in config.json is correct
- Check your internet connection

**Files Not Being Detected:**
- Verify the `watch_directory` path exists
- Make sure you're editing files with supported extensions (`.py`, `.js`, `.tsx`, etc.)
- Check that the file isn't in an ignored folder (node_modules, .git, etc.)

**Permission Errors:**
- On Mac/Linux, you might need to grant terminal access to monitor files
- Go to System Preferences > Security & Privacy > Files and Folders

### What Gets Monitored

The watcher monitors these file types:
- **Languages**: Python, JavaScript, TypeScript, Java, C++, Go, Rust, Ruby, PHP
- **Web**: HTML, CSS, SCSS
- **Data**: JSON, YAML, SQL
- **Docs**: Markdown

### Privacy & Security

- Only file content is sent to the backend for AI analysis
- Analysis happens on your Replit backend (not shared publicly)
- You can stop monitoring anytime with Ctrl+C
- The Google API key is securely stored in Replit Secrets

### Tips for Best Results

1. **Work in Focused Sessions**: The AI learns better when you work on one topic at a time
2. **Save Frequently**: Changes are detected when you save files
3. **Review Recommendations**: Check the dashboard regularly for personalized learning tips
4. **Keep Watcher Running**: Leave it running in the background while coding

---

## Quick Start Commands

```bash
# Install dependencies
pip install watchdog websockets

# Run the watcher
python watcher.py

# Stop the watcher
Press Ctrl+C
```

## Next Steps

Once the watcher is running:
1. Code normally in VS Code
2. Visit your Replit app to see real-time insights
3. Review AI recommendations after each coding session
4. Track your learning progress over time

Happy learning! 🚀
