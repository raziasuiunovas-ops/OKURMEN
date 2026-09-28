@echo off
chcp 65001 >nul
cls
echo ==========================================
echo   FULL REBUILD - OKURMEN PROJECT
echo ==========================================
echo.
echo This will:
echo 1. Stop all Node processes
echo 2. Delete all caches (.next, turbo)
echo 3. Reinstall dependencies (pnpm)
echo 4. Start fresh dev server
echo.
echo This may take 5-10 minutes!
echo.
pause

echo.
echo [1/6] Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo [2/6] Cleaning all .next directories...
cd apps\web
if exist .next rmdir /s /q .next
cd ..\admin  
if exist .next rmdir /s /q .next
cd ..\api
if exist .next rmdir /s /q .next
cd ..\..

echo [3/6] Cleaning turbo cache...
if exist .turbo\cache rmdir /s /q .turbo\cache

echo [4/6] Removing node_modules...
rmdir /s /q node_modules

echo [5/6] Installing dependencies (this takes time)...
call pnpm install

echo [6/6] Starting Web server...
cd apps\web
start "OKURMEN Web (3000)" cmd /k "npm run dev"

echo.
echo ==========================================
echo   REBUILD COMPLETE!
echo ==========================================
echo.
echo Web is starting at: http://localhost:3000
echo Wait 10-15 seconds, then open in browser
echo.
echo Press Ctrl+Shift+R in browser for hard refresh!
echo.
pause
