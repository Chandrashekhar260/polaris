@echo off
echo ========================================
echo   Watch ANY Folder in VS Code
echo ========================================
echo.

REM Check if folder path provided
if "%1"=="" (
    echo Usage: watch_any_folder.bat "C:\path\to\your\code"
    echo.
    echo Example:
    echo   watch_any_folder.bat "C:\Users\YourName\Documents\MyProject"
    echo   watch_any_folder.bat "D:\Projects\ReactApp"
    echo.
    echo Or drag and drop a folder onto this batch file!
    echo.
    pause
    exit /b 1
)

set WATCH_DIR=%1

REM Check if directory exists
if not exist "%WATCH_DIR%" (
    echo ERROR: Directory does not exist: %WATCH_DIR%
    pause
    exit /b 1
)

echo Watching folder: %WATCH_DIR%
echo.
echo Make sure:
echo   1. Python backend is running (port 8000)
echo   2. Frontend is running (port 5000)
echo.
echo Press Ctrl+C to stop
echo.

cd /d "%~dp0"
python vscode_watcher.py "%WATCH_DIR%"

pause

