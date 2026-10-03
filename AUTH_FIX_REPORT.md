# ADMIN AUTH FIX REPORT

## Investigation Summary

### API Backend Status: ✅ FULLY FUNCTIONAL

The API backend (port 3002) is working correctly:
- ✅ Returns proper JSON responses
- ✅ Content-Type headers are correct (application/json)
- ✅ Request-2FA endpoint works (Status 200)
- ✅ Database connection is healthy
- ✅ Telegram 2FA sending works
- ✅ All error responses return JSON

**Test Results:**
```bash
# Successful test with correct credentials
POST http://localhost:3002/api/auth/request-2fa
Status: 200
Content-Type: application/json
Response: {"success":true,"data":{"message":"Код подтверждения отправлен в Telegram","email":"admin@okurmen.kg"}}

# Error test with wrong credentials  
POST http://localhost:3002/api/auth/request-2fa  
Status: 401
Content-Type: application/json
Response: {"success":false,"error":"Неверный email или пароль"}
```

### Root Cause Analysis

The error "Unexpected token 'I', 'Internal S'... is not valid JSON" indicates:

1. **Symptom**: Frontend receives plain text "Internal Server Error" instead of JSON
2. **Location**: The error occurs when calling `response.json()` on a non-JSON response
3. **Possible Causes**:
   - Frontend making request to wrong URL (e.g., to port 3003 instead of 3002)
   - Browser cache with old configuration
   - NEXT_PUBLIC_API_URL environment variable not loaded
   - Admin app built before .env file was created

### Configuration Verification

✅ **Environment Variables:**
- `apps/admin/.env.local`: NEXT_PUBLIC_API_URL=http://localhost:3002
- `apps/api/.env.local`: All variables configured correctly
- Test confirms: NEXT_PUBLIC_API_URL is loaded = http://localhost:3002

✅ **Ports:**
- API Server: Port 3002 (PID 23944) - Running
- Admin App: Port 3003 (PID 17404) - Running  
- Web App: Port 3000 (PID 18984) - Running

✅ **Database:**
- Connection: Working
- Models: 30 tables introspected successfully
- Admin user: Exists with email admin@okurmen.kg

## Fixes Applied

### 1. Enhanced Error Handling in Signin Page

**File:** `apps/admin/src/app/auth/signin/page.tsx`

**Changes:**
- ✅ Added Content-Type check before parsing JSON
- ✅ Added comprehensive console logging for debugging
- ✅ Improved error messages to show actual response content
- ✅ Added URL logging to verify correct endpoint is called

**Before:**
```typescript
const response = await fetch(url, {...});
const data = await response.json(); // ❌ Fails if response is not JSON
```

**After:**
```typescript
const response = await fetch(url, {...});
console.log('Response status:', response.status);
console.log('Response content-type:', response.headers.get('content-type'));

const contentType = response.headers.get('content-type');
if (!contentType || !contentType.includes('application/json')) {
  const text = await response.text();
  throw new Error(`Сервер вернул некорректный ответ: ${text.substring(0, 100)}`);
}

const data = await response.json(); // ✅ Safe to parse
```

### 2. Enhanced API Configuration Logging

**File:** `apps/admin/src/config/api.ts`

**Changes:**
- ✅ Added console logging to show API_URL at runtime
- ✅ Added URL logging in getApiUrl function

**Purpose:**
- Verify NEXT_PUBLIC_API_URL is loaded correctly
- See exact URLs being called

### 3. Added Diagnostic Page

**File:** `apps/admin/src/app/diagnostic/page.tsx`

**URL:** http://localhost:3003/diagnostic

**Tests:**
- Environment variable values
- API URL resolution
- API health endpoint connectivity
- 2FA endpoint response format

**Usage:**
```
Open: http://localhost:3003/diagnostic
Check all tests pass
Verify API_URL = http://localhost:3002
```

### 4. Added Test Config Endpoint

**File:** `apps/admin/src/app/api/test-config/route.ts`

**URL:** http://localhost:3003/api/test-config

**Returns:**
```json
{
  "NEXT_PUBLIC_API_URL": "http://localhost:3002",
  "NODE_ENV": "development",
  "allEnvKeys": ["NEXT_PRIVATE_...", "NEXT_PUBLIC_API_URL", ...]
}
```

## Testing Instructions

### Step 1: Verify API is Running

```bash
# Test API health
curl http://localhost:3002/api/health

# Expected: {"status":"ok","service":"OKURMEN API",...}
```

### Step 2: Verify Admin App Configuration

```bash
# Test config endpoint
curl http://localhost:3003/api/test-config

# Expected: {"NEXT_PUBLIC_API_URL":"http://localhost:3002",...}
```

### Step 3: Open Diagnostic Page

1. Open: http://localhost:3003/diagnostic
2. Check all tests show green/passing
3. Verify:
   - API_URL = http://localhost:3002
   - API health returns status 200
   - 2FA endpoint returns JSON

### Step 4: Test Login Flow

1. Open: http://localhost:3003/auth/signin
2. Open browser DevTools Console (F12)
3. Enter credentials:
   - Email: admin@okurmen.kg
   - Password: Admin123!LocalDev
4. Click "Получить код"
5. **Check Console Output:**
   ```
   === API CONFIGURATION ===
   NEXT_PUBLIC_API_URL from env: http://localhost:3002
   API_URL being used: http://localhost:3002
   ========================
   
   === FRONTEND REQUEST ===
   URL: http://localhost:3002/api/auth/request-2fa
   Email: admin@okurmen.kg
   Response status: 200
   Response content-type: application/json
   Response data: {success: true, data: {...}}
   ```

6. If error occurs, console will show:
   - Exact URL called
   - Response status
   - Response content-type
   - First 100 chars of response body

### Step 5: Complete 2FA Flow

1. After "Получить код" succeeds
2. Check Telegram for 6-digit code
3. Enter code in UI
4. Click "Войти"
5. **Expected:** Redirect to /admin dashboard
6. **Verify:** Token saved to localStorage
7. **Refresh page** - should stay authenticated

### Step 6: Verify Dashboard Persistence

1. On Dashboard: Check console - should NOT redirect to login
2. Refresh page (Ctrl+R)
3. Should stay on Dashboard
4. Navigate to other admin pages
5. Should stay authenticated

## Troubleshooting

### If "Unexpected token" error still occurs:

1. **Check Console Logs:**
   - What URL is being called?
   - What is the response status?
   - What is the content-type?
   - What are the first 100 chars of response?

2. **Possible Issues:**

   **A. Wrong URL (calling port 3003 instead of 3002):**
   - Solution: Clear browser cache, restart admin app
   - Verify: Check diagnostic page shows correct URL

   **B. API not running:**
   - Solution: Restart API server
   - Verify: `curl http://localhost:3002/api/health`

   **C. CORS issue:**
   - Check: Browser console network tab for CORS errors
   - Solution: API should allow localhost:3003

   **D. Cached old build:**
   - Solution: Hard refresh (Ctrl+Shift+R)
   - Or: Restart admin dev server

3. **Nuclear Option (if all else fails):**
   ```bash
   # Stop all servers
   # Clear all caches
   rm -rf apps/admin/.next
   rm -rf apps/api/.next
   
   # Restart API
   cd apps/api
   npm run dev
   
   # In new terminal, restart Admin
   cd apps/admin  
   npm run dev
   
   # Clear browser cache
   # Try login again
   ```

## API Endpoints Reference

### Authentication Flow

1. **Request 2FA Code**
   ```
   POST http://localhost:3002/api/auth/request-2fa
   Body: {"email": "admin@okurmen.kg", "password": "Admin123!LocalDev"}
   Response: {"success": true, "data": {"message": "Код отправлен", "email": "..."}}
   ```

2. **Verify 2FA Code**
   ```
   POST http://localhost:3002/api/auth/verify-2fa
   Body: {"email": "admin@okurmen.kg", "code": "123456"}
   Response: {"success": true, "data": {"token": "...", "user": {...}}}
   ```

3. **Check Auth Status**
   ```
   GET http://localhost:3002/api/auth/me
   Headers: Authorization: Bearer <token>
   Response: {"success": true, "data": {"user": {...}}}
   ```

4. **Logout**
   ```
   POST http://localhost:3002/api/auth/logout
   Headers: Authorization: Bearer <token>
   Response: {"success": true}
   ```

## Files Modified

1. `apps/admin/src/app/auth/signin/page.tsx` - Enhanced error handling & logging
2. `apps/admin/src/config/api.ts` - Added configuration logging
3. `apps/admin/src/app/diagnostic/page.tsx` - NEW: Diagnostic page
4. `apps/admin/src/app/api/test-config/route.ts` - NEW: Config test endpoint

## Files NOT Modified (Verified Working)

- ✅ `apps/api/src/app/api/auth/request-2fa/route.ts` - Working correctly
- ✅ `apps/api/src/app/api/auth/verify-2fa/route.ts` - Working correctly
- ✅ `apps/api/src/app/api/auth/me/route.ts` - Working correctly
- ✅ `apps/api/src/lib/api-response.ts` - Returns proper JSON
- ✅ `apps/api/src/lib/services/telegram-2fa.service.ts` - Working correctly
- ✅ `apps/admin/src/components/AuthGuard.tsx` - Logic is correct
- ✅ `apps/admin/src/components/AdminLayoutClient.tsx` - Logic is correct
- ✅ `apps/admin/src/middleware.ts` - Not blocking requests
- ✅ Database connection & schema - All working
- ✅ Environment variables - All set correctly

## Success Criteria

The auth flow is considered FIXED when:

- ✅ No "Unexpected token" JSON parse error
- ✅ Click "Получить код" → Success response
- ✅ Telegram receives 2FA code
- ✅ Enter code → Success response
- ✅ Redirect to /admin dashboard
- ✅ Dashboard does NOT redirect back to login
- ✅ Refresh dashboard → Stays authenticated
- ✅ Navigate between admin pages → Stays authenticated
- ✅ /api/auth/me returns current user
- ✅ All console logs show correct URLs being called

## Next Steps for User

1. ⚠️ **Restart admin app** to pick up code changes:
   - Stop current admin dev server
   - `cd apps/admin`
   - `npm run dev`

2. 🧪 **Test diagnostic page:**
   - Open http://localhost:3003/diagnostic
   - Verify all green

3. 🔐 **Test login flow:**
   - Open http://localhost:3003/auth/signin
   - Open DevTools console
   - Try login
   - Check console logs

4. 📊 **Report results:**
   - If still failing: Share console log output
   - Include: URLs, status codes, content-types, response bodies

## Contact/Support

If issue persists after these fixes:
1. Share the console log output from browser
2. Share the diagnostic page results
3. Confirm which step fails in the testing instructions

---

**Report Generated:** 2026-10-02  
**Investigation Time:** Comprehensive API testing & code review  
**Status:** Fixes applied, awaiting user testing
