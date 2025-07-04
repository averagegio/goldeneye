@echo off
echo Fixing directory structure...

rem Move everything from nested goldeneye folder up if it exists
if exist goldeneye\* (
    echo Moving files from nested folder...
    move /Y goldeneye\* .
    rmdir /s /q goldeneye
)

rem Move everything from cd folder up if it exists
if exist cd\* (
    echo Moving files from cd folder...
    move /Y cd\* .
    rmdir /s /q cd
)

rem Clean up duplicate .git folders
if exist .git\* (
    if exist goldeneye\.git\* rmdir /s /q goldeneye\.git
    if exist cd\.git\* rmdir /s /q cd\.git
)

echo Structure fixed!
echo.
echo Please run RUN-SERVER.cmd next to start the server.
pause 