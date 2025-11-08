# Where to Code in VS Code - Quick Guide

## ✅ You Can Code ANYWHERE in Your Project!

The file watcher monitors **the entire project directory** by default. You can code in:

- ✅ **Root directory** (`PersonalLearningAgent/`)
- ✅ **Client folder** (`client/src/`)
- ✅ **Python backend** (`python_backend/`)
- ✅ **Any subfolder** (except ignored ones)

## 📁 What Gets Watched

**Watched (Analyzed):**
- ✅ `client/src/` - Your React components
- ✅ `python_backend/` - Python code
- ✅ `server/` - Node.js server code
- ✅ Any `.py`, `.js`, `.ts`, `.jsx`, `.tsx` files anywhere

**Ignored (NOT Watched):**
- ❌ `node_modules/` - Dependencies
- ❌ `.git/` - Git files
- ❌ `__pycache__/` - Python cache
- ❌ `dist/`, `build/` - Build outputs
- ❌ `.vscode/`, `.idea/` - Editor configs

## 🎯 Best Practice

**Code anywhere you want!** For example:

```
PersonalLearningAgent/
├── client/src/
│   ├── components/MyComponent.tsx  ✅ Watched
│   └── pages/Dashboard.tsx          ✅ Watched
├── python_backend/
│   └── routes/my_route.py           ✅ Watched
├── server/
│   └── routes.ts                    ✅ Watched
└── my_custom_code.py                ✅ Watched
```

## 🔧 Change Watched Directory

If you want to watch a different folder:

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

## 📝 Example: Code in Any Folder

1. **Create a file anywhere:**
   - `client/src/test.tsx` ✅
   - `python_backend/test.py` ✅
   - `my_scripts/test.js` ✅
   - `test.py` (root) ✅

2. **Save it** (`Ctrl+S`)

3. **Get recommendations** in frontend!

## ⚠️ Important Notes

- The watcher watches **recursively** - all subfolders are included
- Only **saved files** trigger analysis (not just typing)
- **File extension** must be supported (`.py`, `.js`, `.ts`, etc.)
- Files in **ignored folders** won't be analyzed

## 🚀 Quick Test

1. Create a file **anywhere** in your project:
   ```
   PersonalLearningAgent/my_test.py
   ```

2. Add some code:
   ```python
   def test():
       print("Hello")
   ```

3. Save it (`Ctrl+S`)

4. Check frontend - you'll see analysis!

**You don't need to code in a specific folder - code anywhere!** 🎉

