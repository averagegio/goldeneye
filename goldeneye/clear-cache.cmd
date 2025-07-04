@echo off
echo Clearing cache...

rem Clear Next.js cache
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul
del /f /q .cache 2>nul

rem Clear npm cache
call npm cache clean --force

rem Remove node_modules
rmdir /s /q node_modules

rem Clear package-lock
del /f /q package-lock.json

echo Cache cleared successfully!
pause 