@echo off
echo ========================================
echo    LearnAI Watcher - Auto Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/3] Installing Python packages...
pip install watchdog websockets
if errorlevel 1 (
    echo ERROR: Failed to install packages
    pause
    exit /b 1
)
echo ✓ Packages installed successfully!
echo.

echo [2/3] Creating config file...
if not exist config.json (
    copy config.example.json config.json >nul
    echo ✓ Config file created!
    echo.
    echo IMPORTANT: Edit config.json and set:
    echo   1. "watch_directory" = your VS Code project path
    echo   2. "backend_url" = your Replit URL
    echo.
) else (
    echo ✓ Config file already exists
    echo.
)

echo [3/3] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Open config.json in Notepad
echo 2. Set your project path
echo 3. Run: python watcher.py
echo.
echo Press any key to open config.json...
pause >nul
notepad config.json
