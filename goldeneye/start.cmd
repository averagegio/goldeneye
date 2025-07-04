@echo off
cd /d "%~dp0"
start "" http://localhost:3000
cmd /c "npm run dev" 