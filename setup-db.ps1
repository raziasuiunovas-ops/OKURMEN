# OKURMEN - Настройка базы данных
# Используй: .\setup-db.ps1

Write-Host "🗄️  Настройка базы данных OKURMEN..." -ForegroundColor Green
Write-Host ""

# Проверка .env
if (-not (Test-Path ".env")) {
    Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
    Write-Host "Создай файл .env из .env.example и заполни DATABASE_URL" -ForegroundColor Yellow
    exit 1
}

Write-Host "1️⃣  Генерация Prisma Client..." -ForegroundColor Cyan
cd packages/database
pnpm prisma generate

Write-Host ""
Write-Host "2️⃣  Применение схемы к БД..." -ForegroundColor Cyan
pnpm prisma db push

Write-Host ""
Write-Host "3️⃣  Заполнение БД начальными данными..." -ForegroundColor Cyan
pnpm prisma db seed

Write-Host ""
Write-Host "✅ База данных готова!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Чтобы открыть Prisma Studio:" -ForegroundColor Cyan
Write-Host "   pnpm --filter @okurmen/database db:studio" -ForegroundColor White

cd ../..
