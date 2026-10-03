#!/usr/bin/env pwsh

Write-Host "=== ТЕСТ СОХРАНЕНИЯ КУРСА ===" -ForegroundColor Cyan
Write-Host ""

# Получаем токен из localStorage (нужно взять из браузера)
$token = Read-Host "Введите auth-token из localStorage браузера (или нажмите Enter для пропуска)"

if (-not $token) {
    Write-Host "⚠️  Токен не указан. Запрос будет без авторизации." -ForegroundColor Yellow
    Write-Host "Для полного теста откройте Admin Panel, войдите и скопируйте токен из DevTools -> Application -> Local Storage -> auth-token" -ForegroundColor Gray
    Write-Host ""
}

# Получаем список курсов
Write-Host "[1] Получение списка курсов..." -ForegroundColor Yellow
try {
    $headers = @{
        'Content-Type' = 'application/json'
    }
    if ($token) {
        $headers['Authorization'] = "Bearer $token"
    }
    
    $courses = Invoke-RestMethod -Uri "http://localhost:3002/api/courses?includeInactive=true" -Headers $headers
    
    if ($courses.success -and $courses.data.Count -gt 0) {
        Write-Host "✅ Получено $($courses.data.Count) курсов" -ForegroundColor Green
        $testCourse = $courses.data[0]
        Write-Host "   Тестируем курс: $($testCourse.course_translations[0].title)" -ForegroundColor Gray
        Write-Host "   ID: $($testCourse.id)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Курсы не найдены" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Ошибка получения курсов: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Тестируем PATCH запрос с минимальными изменениями
Write-Host "[2] Тест PATCH курса (изменение только price)..." -ForegroundColor Yellow

$testData = @{
    price = [int]$testCourse.price + 100
    isActive = $testCourse.is_active
} | ConvertTo-Json

Write-Host "Request body:" -ForegroundColor Gray
Write-Host $testData -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/courses/$($testCourse.id)" `
        -Method PATCH `
        -Body $testData `
        -Headers $headers `
        -UseBasicParsing
    
    Write-Host "✅ PATCH успешен (Status: $($response.StatusCode))" -ForegroundColor Green
    $result = $response.Content | ConvertFrom-Json
    if ($result.success) {
        Write-Host "✅ Курс сохранен успешно" -ForegroundColor Green
    } else {
        Write-Host "❌ API вернул success=false" -ForegroundColor Red
        Write-Host "Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ PATCH завершился ошибкой" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== ТЕСТ ЗАВЕРШЕН ===" -ForegroundColor Cyan
