# Run File Watcher from VS Code Terminal

## ✅ Correct Way to Run from VS Code

### Step 1: Open Terminal in VS Code
- Press `Ctrl+`` ` (backtick) or View → Terminal

### Step 2: Navigate to Project Folder
```cmd
cd C:\Users\chandrashekhar\personal\PersonalLearningAgent
```

### Step 3: Run the Watcher

**Option A: Watch Current VS Code Folder**
```cmd
python vscode_watcher.py "%CD%"
```

**Option B: Watch a Specific Folder**
```cmd
python vscode_watcher.py "C:\Users\chandrashekhar\Documents\YourProject"
```

**Option C: Watch Current Directory (where you ran the command)**
```cmd
python vscode_watcher.py
```

## 🎯 Complete Example

1. **Open VS Code Terminal** (`Ctrl+`` `)

2. **Run these commands:**
   ```cmd
   cd C:\Users\chandrashekhar\personal\PersonalLearningAgent
   python vscode_watcher.py "%CD%"
   ```

3. **You should see:**
   ```
   📁 Using directory from command line: C:\Your\Current\Folder
   🔌 Connecting to ws://localhost:8000/api/ws/stream...
   ✅ Connected to Learning AI Agent backend!
   👀 Watching for file changes...
   ```

4. **Now code in VS Code and save files!**

## 💡 Pro Tip

Create a VS Code task to make it easier - I've already created `.vscode/tasks.json` with tasks you can run!

1. Press `Ctrl+Shift+P`
2. Type: "Tasks: Run Task"
3. Select: "Start File Watcher"

