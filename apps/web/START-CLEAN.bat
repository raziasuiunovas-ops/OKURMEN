@echo off
chcp 65001 >nul
cls
echo ==========================================
echo   OKURMEN WEB - CLEAN START
echo ==========================================

echo Stopping processes...
taskkill /F /IM node.exe >nul 2>&1

echo Cleaning cache...
if exist .next rmdir /s /q .next

echo Starting dev server...
start "OKURMEN Web" cmd /k "npm run dev"

echo.
echo ==========================================
echo   Server starting at http://localhost:3000
echo ==========================================
echo.
echo Wait 10 seconds, then:
echo 1. Open http://localhost:3000
echo 2. Press Ctrl+Shift+R for hard refresh
echo.
pause
