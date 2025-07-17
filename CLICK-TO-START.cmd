@echo off
echo Checking Node.js installation...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Installing dependencies...
call npm install

echo.
echo Starting GoldenEye...
echo.
cmd /c "npm run dev"

pause 