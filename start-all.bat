@echo off
echo ========================================
echo   OKURMEN - Запуск всех порталов
echo ========================================
echo.

start "API (3002)" cmd /k "pnpm --filter @okurmen/api dev"
timeout /t 3 /nobreak >nul

start "Admin (3003)" cmd /k "pnpm --filter @okurmen/admin dev"
timeout /t 2 /nobreak >nul

start "Student (3001)" cmd /k "pnpm --filter @okurmen/student dev"
timeout /t 2 /nobreak >nul

start "Employee (3004)" cmd /k "pnpm --filter @okurmen/employee dev"
timeout /t 2 /nobreak >nul

start "Web (3000)" cmd /k "pnpm --filter @okurmen/web dev"

echo.
echo ========================================
echo   Все порталы запускаются...
echo ========================================
echo.
echo API:      http://localhost:3002
echo Admin:    http://localhost:3003
echo Student:  http://localhost:3001
echo Employee: http://localhost:3004
echo Web:      http://localhost:3000
echo.
echo Нажми любую клавишу для выхода...
pause >nul
