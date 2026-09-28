@echo off
echo Stopping servers...
taskkill /F /IM node.exe >nul 2>&1

echo Deleting cache...
cd apps\web
rmdir /s /q .next 2>nul

echo Starting...
start "OKURMEN Web" cmd /k "npm run dev"

echo.
echo Wait 10 seconds then open: http://localhost:3000
echo Press Ctrl+Shift+R in browser!
pause
