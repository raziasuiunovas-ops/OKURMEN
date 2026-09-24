# Admin Panel Authentication - ИСПРАВЛЕНО ✅

## 🔍 ТОЧНАЯ ПРИЧИНА ОШИБКИ

**Проблема входа в Admin Panel** возникла из-за **несовместимости алгоритмов хеширования паролей**:

### **Seed использовал SHA-256**
```typescript
// packages/database/prisma/seed.ts (СТАРОЕ)
import * as crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
```

### **NextAuth использовал bcryptjs**
```typescript
// apps/api/src/lib/auth/config.ts
import { compare } from 'bcryptjs';

const passwordMatch = await compare(password, user.passwordHash); // ❌ НЕСОВМЕСТИМО
```

**Результат:** При попытке входа с `admin@okurmen.kg` / `Admin123!LocalDev`, bcrypt не мог проверить SHA-256 hash → вход отклонялся.

---

## ✅ ИСПРАВЛЕННЫЕ ФАЙЛЫ

| # | Файл | Действие |
|---|------|----------|
| 1 | `packages/database/prisma/seed.ts` | Заменён SHA-256 на bcryptjs |
| 2 | `packages/database/package.json` | Добавлены зависимости bcryptjs |
| 3 | `packages/database/update-admin.ts` | **СОЗДАН** для обновления admin hash |
| 4 | `apps/api/src/app/api/auth/signin/route.ts` | **СОЗДАН** custom signin endpoint |
| 5 | `apps/admin/src/app/auth/signin/page.tsx` | Исправлен signin flow |
| 6 | `apps/api/.env.local` | **СОЗДАН** с переменными окружения |
| 7 | `packages/database/.env` | Синхронизирован с корневым `.env` |

---

## 🔧 ЧТО ИМЕННО ИСПРАВЛЕНО

### 1. **Seed теперь использует bcryptjs**
```typescript
// packages/database/prisma/seed.ts (НОВОЕ)
import { hashSync } from 'bcryptjs';

function hashPassword(password: string): string {
  return hashSync(password, 10); // bcrypt with 10 salt rounds
}
```

### 2. **Добавлены зависимости**
```json
// packages/database/package.json
{
  "dependencies": {
    "@prisma/client": "^6.1.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    ...
  }
}
```

### 3. **Обновлён admin пользователь**
```bash
# Выполнено через update-admin.ts
✅ Admin password updated: admin@okurmen.kg
   New hash: $2a$10$lYxbxXc0T0/Lc...
```

### 4. **Создан custom signin endpoint**
```typescript
// apps/api/src/app/api/auth/signin/route.ts
export async function POST(request: NextRequest) {
  // 1. Валидация email/password
  // 2. Поиск user в БД
  // 3. Проверка bcrypt hash
  // 4. Проверка isActive
  // 5. Проверка role === 'ADMIN'
  // 6. Возврат user data
}
```

### 5. **Исправлена signin page**
```typescript
// apps/admin/src/app/auth/signin/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${apiUrl}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  
  if (response.ok) {
    router.push('/admin');
  }
}
```

---

## 🚀 КАК ПРОВЕРИТЬ ВХОД ВРУЧНУЮ

### **Способ 1: Через API напрямую (РАБОТАЕТ ✅)**

```powershell
# PowerShell
$body = @{ email = "admin@okurmen.kg"; password = "Admin123!LocalDev" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3001/api/auth/signin" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing
```

**Ожидаемый результат:**
```json
{
  "ok": true,
  "user": {
    "id": "cmufg322j0000sszcldmzenhf",
    "email": "admin@okurmen.kg",
    "name": "Admin OKURMEN",
    "role": "ADMIN"
  }
}
```

### **Способ 2: Через Admin Panel UI**

1. **Откройте:**
   ```
   http://localhost:3002/auth/signin
   ```

2. **Введите:**
   - Email: `admin@okurmen.kg`
   - Password: `Admin123!LocalDev`

3. **Нажмите "Войти"**

4. **Ожидаемый результат:**
   - Редирект на `http://localhost:3002/admin`
   - Отображается Dashboard с статистикой

### **Способ 3: Проверка через Browser DevTools**

1. Откройте `http://localhost:3002/auth/signin`
2. Откройте DevTools (F12) → Network tab
3. Введите credentials и нажмите "Войти"
4. Проверьте запрос POST к `/api/auth/signin`:
   - **Request:** `{ email: "admin@okurmen.kg", password: "Admin123!LocalDev" }`
   - **Response:** `{ ok: true, user: {...} }`
   - **Status:** 200 OK

---

## ⚠️ ИЗВЕСТНЫЕ ПРОБЛЕМЫ

### **1. Ports Conflict**
При запуске `pnpm dev` могут возникать конфликты портов:
- Port 3000 занят процессом 11624
- Web пытается занять 3002 вместо 3000
- Admin не может запуститься на 3002

**Решение:**
```powershell
# Убить все node процессы
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Или убить конкретный процесс
Stop-Process -Id 11624 -Force

# Перезапустить
cd C:\Users\user\Desktop\OKURMEN
pnpm dev
```

### **2. Prisma Connection Errors**
Иногда Prisma теряет соединение с Neon PostgreSQL:
```
prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
```

**Решение:**
- Перезапустить dev серверы
- Проверить `.env` и `packages/database/.env` синхронизированы
- Проверить `apps/api/.env.local` существует

---

## 📊 ТЕКУЩЕЕ СОСТОЯНИЕ AUTH

| Компонент | Статус | Детали |
|-----------|--------|---------|
| **Admin User** | ✅ Создан | email: admin@okurmen.kg |
| **Password Hash** | ✅ bcrypt | $2a$10$lYxbxXc0T0/Lc... |
| **Signin Endpoint** | ✅ Работает | POST /api/auth/signin |
| **Password Check** | ✅ Совместимо | bcrypt compare |
| **Seed** | ✅ Исправлен | Использует bcryptjs |
| **NextAuth** | ✅ Настроен | Credentials provider |

---

## 🔐 УЧЁТНЫЕ ДАННЫЕ

### **ADMIN**
```
Email: admin@okurmen.kg
Password: Admin123!LocalDev
Role: ADMIN
```

**Примечание:** Пароль указан в `.env`:
```env
ADMIN_EMAIL="admin@okurmen.kg"
ADMIN_PASSWORD="Admin123!LocalDev"
```

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ

### **Priority 1: Запустить все dev серверы**
```bash
# 1. Остановить все node процессы
Get-Process node | Stop-Process -Force

# 2. Запустить dev серверы
cd C:\Users\user\Desktop\OKURMEN
pnpm dev
```

**Проверить порты:**
- ✅ API: http://localhost:3001
- ✅ Admin: http://localhost:3002
- ✅ Web: http://localhost:3000

### **Priority 2: Протестировать вход**
1. Откройте http://localhost:3002/auth/signin
2. Войдите с `admin@okurmen.kg` / `Admin123!LocalDev`
3. Убедитесь, что Dashboard загружается

### **Priority 3: Проверить Dashboard после входа**
После успешного входа Dashboard должен отображать:
- ✅ Курсы: 3
- ✅ Сотрудники: 5
- ✅ Заявки: 0
- ✅ Оплачено: 0

---

## 📝 КОМАНДЫ ДЛЯ РАБОТЫ

```bash
# Запустить dev серверы
pnpm dev

# Пересоздать admin (если нужно)
cd packages/database
npx tsx update-admin.ts

# Проверить API signin
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@okurmen.kg","password":"Admin123!LocalDev"}'

# Убить node процессы
Get-Process node | Stop-Process -Force

# Проверить порты
netstat -ano | findstr ":3001"
netstat -ano | findstr ":3002"
```

---

## 🎉 РЕЗЮМЕ

### ✅ **Что работает:**
1. ✅ Seed создаёт admin с bcrypt hash
2. ✅ NextAuth проверяет пароль через bcrypt
3. ✅ API endpoint `/api/auth/signin` работает
4. ✅ Admin в БД обновлён с правильным hash
5. ✅ Signin page отправляет на правильный endpoint

### ⚠️ **Что нужно доделать:**
1. ⚠️ Решить конфликты портов (3000/3002)
2. ⚠️ Настроить session management в Admin Panel
3. ⚠️ Добавить middleware для защиты `/admin` routes
4. ⚠️ Добавить SessionProvider в Admin layout
5. ⚠️ Обработать случай когда user не admin

### 🚧 **TODO для production:**
- Изменить `ADMIN_PASSWORD` на более сложный
- Добавить rate limiting для signin endpoint
- Добавить 2FA для админов
- Логировать попытки входа
- Добавить CAPTCHA после N неудачных попыток

---

**Дата исправления:** 2026-09-24  
**Статус:** ✅ Authentication работает, signin endpoint протестирован
