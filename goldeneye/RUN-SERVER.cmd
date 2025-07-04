@echo off
echo Starting GoldenEye Server...
cd /d "%~dp0"
cmd /c "npm install && npm run dev" 