@echo off
cd goldeneye
echo Installing dependencies...
call npm install
echo Starting development server...
call npm run dev 