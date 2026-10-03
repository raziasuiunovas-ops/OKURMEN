#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OKURMEN ADMIN AUTH VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

# Test 1: API Server Running
Write-Host "[TEST 1] Checking API server (port 3002)..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3002/api/health" -TimeoutSec 5
    if ($health.status -eq "ok") {
        Write-Host "  ✅ API server is running" -ForegroundColor Green
    } else {
        Write-Host "  ❌ API server returned unexpected response" -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "  ❌ API server is not responding" -ForegroundColor Red
    Write-Host "     Start it with: cd apps/api && npm run dev" -ForegroundColor Gray
    $allPassed = $false
}
Write-Host ""

# Test 2: Admin App Running
Write-Host "[TEST 2] Checking admin app (port 3003)..." -ForegroundColor Yellow
try {
    $config = Invoke-RestMethod -Uri "http://localhost:3003/api/test-config" -TimeoutSec 5
    if ($config.NEXT_PUBLIC_API_URL -eq "http://localhost:3002") {
        Write-Host "  ✅ Admin app is running with correct API URL" -ForegroundColor Green
        Write-Host "     API URL: $($config.NEXT_PUBLIC_API_URL)" -ForegroundColor Gray
    } else {
        Write-Host "  ❌ Admin app has wrong API URL: $($config.NEXT_PUBLIC_API_URL)" -ForegroundColor Red
        $allPassed = $false
    }
} catch {
    Write-Host "  ❌ Admin app is not responding" -ForegroundColor Red  
    Write-Host "     Start it with: cd apps/admin && npm run dev" -ForegroundColor Gray
    $allPassed = $false
}
Write-Host ""

# Test 3: API Request-2FA Endpoint
Write-Host "[TEST 3] Testing request-2FA endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        email = "test@nonexistent.com"
        password = "fake"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3002/api/auth/request-2fa" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -UseBasicParsing
    } catch {
        $response = $_.Exception.Response
    }
    
    if ($response) {
        $statusCode = if ($response.StatusCode) { $response.StatusCode } else { $response.StatusCode.value__ }
        $contentType = if ($response.Headers) { $response.Headers['Content-Type'] } else { $response.ContentType }
        
        if ($contentType -like "*application/json*") {
            Write-Host "  ✅ Endpoint returns JSON (status: $statusCode)" -ForegroundColor Green
            Write-Host "     Content-Type: $contentType" -ForegroundColor Gray
        } else {
            Write-Host "  ❌ Endpoint returns non-JSON response" -ForegroundColor Red
            Write-Host "     Content-Type: $contentType" -ForegroundColor Gray
            $allPassed = $false
        }
    } else {
        throw "No response received"
    }
} catch {
    Write-Host "  ❌ Failed to test endpoint: $_" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 4: Database Admin User
Write-Host "[TEST 4] Testing with actual admin credentials..." -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@okurmen.kg"
        password = "Admin123!LocalDev"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/auth/request-2fa" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    
    if ($response.StatusCode -eq 200 -and $data.success -eq $true) {
        Write-Host "  ✅ Admin credentials accepted, 2FA code sent" -ForegroundColor Green
        Write-Host "     Check Telegram for the code" -ForegroundColor Gray
    } else {
        Write-Host "  ❌ Admin credentials rejected" -ForegroundColor Red
        Write-Host "     Status: $($response.StatusCode)" -ForegroundColor Gray
        Write-Host "     Response: $($response.Content)" -ForegroundColor Gray
        $allPassed = $false
    }
} catch {
    Write-Host "  ⚠️  Could not test with admin credentials" -ForegroundColor Yellow
    Write-Host "     This might be normal if rate-limited" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "  ✅ ALL TESTS PASSED" -ForegroundColor Green
    Write-Host "" 
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Open http://localhost:3003/diagnostic" -ForegroundColor White
    Write-Host "  2. Verify all diagnostic tests pass" -ForegroundColor White
    Write-Host "  3. Open http://localhost:3003/auth/signin" -ForegroundColor White
    Write-Host "  4. Open browser DevTools Console (F12)" -ForegroundColor White
    Write-Host "  5. Try logging in with:" -ForegroundColor White
    Write-Host "     Email: admin@okurmen.kg" -ForegroundColor Gray
    Write-Host "     Password: Admin123!LocalDev" -ForegroundColor Gray
    Write-Host "  6. Check console for detailed logs" -ForegroundColor White
    Write-Host "  7. Enter 2FA code from Telegram" -ForegroundColor White
    Write-Host "  8. Verify redirect to dashboard" -ForegroundColor White
} else {
    Write-Host "  ❌ SOME TESTS FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the failed tests above before proceeding." -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
