@echo off
chcp 65001 >nul
echo ==========================================
echo   Running Web STANDALONE (no workspace)
echo ==========================================

echo Stopping all processes...
taskkill /F /IM node.exe >nul 2>&1

echo Deleting cache...
if exist .next rmdir /s /q .next
if exist node_modules rmdir /s /q node_modules

echo Installing dependencies LOCALLY...
call npm install

echo Starting dev server...
npm run dev

pause
