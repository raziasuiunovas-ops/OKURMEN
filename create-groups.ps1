# PowerShell скрипт для создания групп F1-F5
$apiUrl = "http://localhost:3002"

# Получаем токен (нужно войти в админку)
Write-Host "Для создания групп нужен токен администратора" -ForegroundColor Yellow
Write-Host "Войдите в админ панель: http://localhost:3003/admin/signin" -ForegroundColor Cyan
Write-Host ""
Write-Host "После входа откройте консоль браузера (F12) и выполните:" -ForegroundColor Yellow
Write-Host "localStorage.getItem('auth-token')" -ForegroundColor Green
Write-Host ""
$token = Read-Host "Введите токен"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "Токен не введён. Выход." -ForegroundColor Red
    exit
}

# Создаём группы
$groups = @(
    @{ name = "F1"; description = "Группа Frontend разработки уровень 1"; startDate = "2025-01-15T00:00:00Z" },
    @{ name = "F2"; description = "Группа Frontend разработки уровень 2"; startDate = "2025-02-01T00:00:00Z" },
    @{ name = "F3"; description = "Группа Frontend разработки уровень 3"; startDate = "2025-03-01T00:00:00Z" },
    @{ name = "F4"; description = "Группа Frontend разработки уровень 4"; startDate = "2025-04-01T00:00:00Z" },
    @{ name = "F5"; description = "Группа Frontend разработки уровень 5"; startDate = "2025-05-01T00:00:00Z" }
)

foreach ($group in $groups) {
    Write-Host "Создание группы $($group.name)..." -ForegroundColor Cyan
    
    $body = $group | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/api/groups" `
            -Method POST `
            -Headers @{
                "Content-Type" = "application/json"
                "Authorization" = "Bearer $token"
            } `
            -Body $body
        
        if ($response.success) {
            Write-Host "✅ Группа $($group.name) создана!" -ForegroundColor Green
        } else {
            Write-Host "❌ Ошибка: $($response.error)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Исключение: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Готово! Проверьте страницу учеников: http://localhost:3003/admin/students" -ForegroundColor Cyan
