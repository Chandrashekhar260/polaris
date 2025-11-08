# Watch ANY Folder in VS Code - Complete Guide

## 🎯 You Can Watch Code from ANY Folder!

The file watcher can monitor code from **any folder** on your computer, not just the project folder.

## 🚀 Quick Start

### Method 1: Command Line (Easiest)

**Windows:**
```cmd
python vscode_watcher.py "C:\Users\YourName\Documents\MyProject"
```

**Linux/Mac:**
```bash
python3 vscode_watcher.py "/home/user/Documents/MyProject"
```

### Method 2: Use Batch/Script File

**Windows:**
1. Right-click `watch_any_folder.bat`
2. Select "Edit"
3. Or drag and drop a folder onto the batch file!

**Linux/Mac:**
```bash
chmod +x watch_any_folder.sh
./watch_any_folder.sh "/path/to/your/code"
```

### Method 3: Environment Variable

**Windows:**
```cmd
set WATCH_DIR=C:\path\to\your\code
python vscode_watcher.py
```

**Linux/Mac:**
```bash
export WATCH_DIR=/path/to/your/code
python3 vscode_watcher.py
```

## 📁 Examples

### Watch Your React Project
```cmd
python vscode_watcher.py "C:\Users\YourName\Projects\ReactApp"
```

### Watch Your Python Project
```cmd
python vscode_watcher.py "D:\Code\Python\MyApp"
```

### Watch Your VS Code Workspace
```cmd
python vscode_watcher.py "C:\Users\YourName\Documents\VS Code Projects"
```

### Watch Multiple Folders
You can run multiple watchers:
```cmd
# Terminal 1
python vscode_watcher.py "C:\Project1"

# Terminal 2
python vscode_watcher.py "C:\Project2"
```

## 🎨 VS Code Workspace Integration

### Option 1: Watch Current VS Code Folder

1. In VS Code, open the folder you want to watch
2. Open terminal in VS Code (`Ctrl+`` ` or View → Terminal)
3. Run:
   ```bash
   python vscode_watcher.py "$(pwd)"
   ```
   Or on Windows:
   ```cmd
   python vscode_watcher.py "%CD%"
   ```

### Option 2: Watch VS Code Workspace Root

1. Open VS Code workspace
2. Note the workspace root path
3. Run watcher with that path:
   ```cmd
   python vscode_watcher.py "C:\path\to\workspace"
   ```

## 🔧 Advanced: Watch Multiple Projects

Create a script to watch multiple folders:

**Windows (`watch_multiple.bat`):**
```batch
@echo off
start "Watcher 1" python vscode_watcher.py "C:\Project1"
start "Watcher 2" python vscode_watcher.py "C:\Project2"
start "Watcher 3" python vscode_watcher.py "C:\Project3"
```

**Linux/Mac (`watch_multiple.sh`):**
```bash
#!/bin/bash
python3 vscode_watcher.py "/path/to/project1" &
python3 vscode_watcher.py "/path/to/project2" &
python3 vscode_watcher.py "/path/to/project3" &
wait
```

## 📝 Step-by-Step: Watch Any Folder

1. **Open VS Code** in the folder you want to watch
   - File → Open Folder
   - Select your project folder

2. **Start the watcher** pointing to that folder:
   ```cmd
   python vscode_watcher.py "C:\path\to\your\vs\code\folder"
   ```

3. **Code in VS Code** - write/edit code in that folder

4. **Save files** (`Ctrl+S`)

5. **Get recommendations** in frontend at `http://localhost:5000`

## ✅ What Gets Watched

**Watched:**
- ✅ All code files (`.py`, `.js`, `.ts`, `.jsx`, `.tsx`, etc.)
- ✅ All subfolders (recursive)
- ✅ Any file you save

**Ignored:**
- ❌ `node_modules/`
- `.git/`
- ❌ `__pycache__/`
- ❌ `dist/`, `build/`

## 🎯 Real-World Examples

### Example 1: Watch Your React App
```cmd
# Your React app is at: C:\Users\You\Projects\my-react-app
python vscode_watcher.py "C:\Users\You\Projects\my-react-app"
```
Now code in that React app and get recommendations!

### Example 2: Watch Your Python Project
```cmd
# Your Python project is at: D:\Code\python-app
python vscode_watcher.py "D:\Code\python-app"
```
Code in that Python project and get AI analysis!

### Example 3: Watch Current VS Code Folder
```cmd
# In VS Code terminal, just run:
python vscode_watcher.py .
```
Watches the current VS Code workspace folder!

## 🔍 Verify It's Working

1. **Check watcher output:**
   ```
   📁 Using directory from command line: C:\Your\Folder
   🔌 Connecting to ws://localhost:8000/api/ws/stream...
   ✅ Connected to Learning AI Agent backend!
   👀 Watching for file changes...
   ```

2. **Save a file** in VS Code (in that folder)

3. **See in terminal:**
   ```
   📤 Sent: yourfile.py (123 chars)
   ```

4. **Check frontend** - recommendations appear!

## 💡 Pro Tips

1. **Use absolute paths** - More reliable than relative paths
2. **One watcher per project** - Don't run multiple watchers on the same folder
3. **Keep it running** - Leave the watcher running while you code
4. **Check the path** - Make sure the path is correct (no typos)

## 🚨 Troubleshooting

### "Directory does not exist"
- Check the path is correct
- Use quotes around paths with spaces: `"C:\My Projects\Code"`

### "No files detected"
- Make sure you're saving files (`Ctrl+S`)
- Check file extension is supported
- Verify files aren't in ignored folders

### "Connection refused"
- Make sure Python backend is running
- Check: `curl http://localhost:8000/health`

## 🎉 That's It!

Now you can watch **ANY folder** and get recommendations for code in that folder!

Just run:
```cmd
python vscode_watcher.py "YOUR_FOLDER_PATH"
```

And code away! 🚀

