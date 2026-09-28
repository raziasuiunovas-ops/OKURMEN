@echo off
chcp 65001 >nul
echo ==========================================
echo   Creating STANDALONE Web Project
echo ==========================================

cd c:\Users\user\Desktop

echo Creating new Next.js project...
npx create-next-app@latest OKURMEN-WEB-NEW --typescript --tailwind --app --no-src-dir --import-alias "@/*"

echo.
echo ==========================================
echo   Project created at:
echo   c:\Users\user\Desktop\OKURMEN-WEB-NEW
echo ==========================================
echo.
echo Now I will copy all components there!
pause
