# Quick Start - Code in ANY Folder

## 🚀 3 Steps to Get Started

### 1. Start File Watcher (Watch Current VS Code Folder)

**In VS Code Terminal:**
```cmd
cd PersonalLearningAgent
python vscode_watcher.py "%CD%"
```

This watches **whatever folder VS Code is currently in**!

### 2. Create Folder & File in VS Code

1. **File → New Folder** (name it anything)
2. **Create file** in that folder (`.js`, `.tsx`, `.py`, etc.)
3. **Write some code**
4. **Save** (`Ctrl+S`)

### 3. See Suggestions

1. Open: `http://localhost:5000`
2. Dashboard → Scroll to **"Live Suggestions"**
3. See your recommendations!

## 📝 Example

**VS Code:**
- Create folder: `MyCode`
- Create file: `app.js`
- Code:
  ```javascript
  function test() {
      console.log("Hello"  // Missing )
  }
  ```
- Save (`Ctrl+S`)

**Frontend:**
- Open `http://localhost:5000`
- See error detected in "Live Suggestions"!

## ✅ That's It!

Code → Save → See Suggestions! 🎉
