@echo off
echo ========================================
echo   VS Code File Watcher for Learning AI
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if watchdog is installed
python -c "import watchdog" >nul 2>&1
if errorlevel 1 (
    echo Installing watchdog...
    pip install watchdog websockets
)

REM Check if backend is running
echo Checking if Python backend is running...
curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo.
    echo WARNING: Python backend doesn't seem to be running on port 8000
    echo Make sure to start it first with: python python_backend/main.py
    echo.
    pause
)

echo.
echo Starting file watcher...
echo Watching current directory: %CD%
echo.
echo Press Ctrl+C to stop
echo.

python vscode_watcher.py

pause

