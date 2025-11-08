@echo off
cd /d C:\Users\chandrashekhar\personal\PersonalLearningAgent
echo Installing dependencies...
npm install > install_log.txt 2>&1
echo Installation complete! Check install_log.txt
type install_log.txt
pause
