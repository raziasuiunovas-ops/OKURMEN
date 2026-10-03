@echo off
chcp 65001 > nul
echo ============================================
echo 🚀 OKURMEN - Запуск всех сервисов
echo ============================================
echo.

echo [1/3] Запуск API (порт 3002)...
start "OKURMEN API" cmd /k "cd apps\api && npm run dev"
timeout /t 3 /nobreak > nul

echo [2/3] Запуск Admin Panel (порт 3003)...
start "OKURMEN Admin" cmd /k "cd apps\admin && npm run dev"
timeout /t 3 /nobreak > nul

echo [3/3] Запуск Web (порт 3000)...
start "OKURMEN Web" cmd /k "cd apps\web && npm run dev"

echo.
echo ============================================
echo ✅ Все сервисы запущены!
echo ============================================
echo.
echo 📍 Адреса:
echo    - Web:   http://localhost:3000
echo    - Admin: http://localhost:3003
echo    - API:   http://localhost:3002
echo.
echo 🔐 Данные для входа в Admin:
echo    Email:    admin@okurmen.kg
echo    Password: Admin123!LocalDev
echo.
echo ⚠️  Подождите 10-15 секунд пока все сервисы запустятся
echo.
pause
