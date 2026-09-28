@echo off
chcp 65001 >nul
cls
echo ==========================================
echo   FINAL FIX - Removing node_modules
echo ==========================================

echo [1/4] Stopping all processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Deleting .next cache...
cd apps\web
if exist .next rmdir /s /q .next
cd ..\..

echo [3/4] Deleting node_modules (this takes time)...
rmdir /s /q node_modules

echo [4/4] Reinstalling dependencies...
call pnpm install

echo.
echo ==========================================
echo   DONE! Now start manually:
echo ==========================================
echo cd apps\web
echo npm run dev
echo.
pause
