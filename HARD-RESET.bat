@echo off
chcp 65001 >nul
cls
echo ==========================================
echo   HARD RESET - OKURMEN
echo ==========================================

echo [1/3] Stopping all processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Deleting .next cache...
cd apps\web
if exist .next (
    rmdir /s /q .next
    echo Web cache deleted!
) else (
    echo Web cache not found
)
cd ..\..

echo [3/3] Starting Web server...
timeout /t 2 /nobreak >nul
cd apps\web
start "OKURMEN Web" cmd /k "npm run dev"
cd ..\..

echo.
echo ==========================================
echo   DONE! Wait 10 seconds then open:
echo   http://localhost:3000
echo ==========================================
echo.
echo Press Ctrl+Shift+R in browser!
pause
