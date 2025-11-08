@echo off
setlocal enabledelayedexpansion
cd /d C:\Users\chandrashekhar\personal\PersonalLearningAgent
set NODE_ENV=development
set PORT=5000
echo Starting dev server on port 5000...
echo NODE_ENV=%NODE_ENV%
echo PORT=%PORT%
call npx tsx server/index.ts
pause
