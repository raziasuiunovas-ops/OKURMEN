# Быстрое решение проблемы 2FA

## Симптом
2FA в админ-панели не работает

## Быстрая диагностика (5 минут)

### Шаг 1: Проверка сервисов
```bash
# Убедитесь что оба сервиса запущены
# В корне проекта:
pnpm dev

# Проверьте в терминале:
# ✓ API должен быть на http://localhost:3002
# ✓ Admin должен быть на http://localhost:3001
```

### Шаг 2: Откройте диагностику
```
http://localhost:3001/diagnostic
```

Проверьте результаты:
- ✅ `API_URL` = `http://localhost:3002`
- ✅ `apiHealth.status` = `200`
- ✅ `twoFAEndpoint.isJSON` = `true`

Если есть ❌, см. "Частые проблемы" ниже.

### Шаг 3: Тест 2FA
На странице `/diagnostic`:

1. Введите:
   - Email: `admin@okurmen.kg`
   - Password: `Admin123!LocalDev`
2. Нажмите "1. Request 2FA Code"
3. **Откройте Telegram** - должен прийти код
4. Введите код из Telegram
5. Нажмите "2. Verify Code"
6. Проверьте ответ - должен быть `"token": "eyJ..."`

### Шаг 4: Проверка в браузере
Откройте консоль (F12) и проверьте:
```javascript
localStorage.getItem('auth-token')
```
Должен быть токен (длинная строка).

## Частые проблемы и решения

### ❌ API не отвечает / HTML вместо JSON
**Причина:** API не запущен или запущен на неправильном порту

**Решение:**
```bash
# 1. Остановите все процессы (Ctrl+C)
# 2. Проверьте что порт 3002 свободен
# 3. Запустите заново
cd apps/api
pnpm dev
```

### ❌ Код не приходит в Telegram
**Причина:** Неправильные Telegram credentials

**Решение:**
1. Проверьте файл `.env`:
   ```bash
   TELEGRAM_BOT_TOKEN="8638005611:AAGfmLC7UBqA4mKHh26f-0MYVDiwM2-gOqk"
   TELEGRAM_CHAT_ID="1376366540"
   ```
2. Убедитесь что бот добавлен в чат с этим CHAT_ID
3. Перезапустите API

### ❌ "Неверный код" при проверке
**Причина:** Код истёк или был использован

**Решение:**
- Запросите новый код (кнопка "1. Request 2FA Code")
- Код действителен 30 минут
- Используйте самый последний код из Telegram

### ❌ После успешной проверки не переходит на /admin
**Причина:** Токен не сохранился в localStorage

**Решение:**
Проверьте в консоли браузера:
```javascript
// Должно быть true:
console.log('[Check] Token exists:', !!localStorage.getItem('auth-token'));

// Если false, попробуйте вручную:
localStorage.setItem('auth-token', 'YOUR_TOKEN_FROM_RESPONSE');
window.location.href = '/admin';
```

### ❌ CORS ошибка
**Причина:** Неправильная настройка CORS между портами

**Решение:**
В `apps/api/next.config.ts` должно быть:
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
      ],
    },
  ];
},
```

## Логи для отладки

### Логи в консоли браузера (Admin):
```
[2FA] Отправка запроса verify-2fa...
[2FA] Ответ получен: {success: true, data: {...}}
[2FA] Сохранение токена в localStorage...
[2FA] Токен сохранён, длина: 200+
[2FA] Переход на /admin...
```

### Логи в терминале API:
```
=== REQUEST 2FA START ===
Email: admin@okurmen.kg
User found: true
=== SEND 2FA CODE START ===
Generated code: 123456
Telegram notification sent: true
=== VERIFY 2FA START ===
Code valid: true
Token created
=== VERIFY 2FA SUCCESS ===
```

## Если ничего не помогло

### Полный перезапуск
```bash
# 1. Остановите все процессы
# 2. Очистите кэш
rm -rf apps/api/.next
rm -rf apps/admin/.next
rm -rf node_modules/.cache

# 3. Перезапустите
pnpm install
pnpm dev
```

### Проверка БД
```bash
# Убедитесь что таблица two_factor_codes существует
pnpx prisma studio

# Откройте таблицу two_factor_codes
# После запроса кода там должна появиться запись
```

## Куда смотреть дальше

1. **Diagnostic page:** `http://localhost:3001/diagnostic`
2. **API health:** `http://localhost:3002/api/health`
3. **Подробная инструкция:** `ADMIN_2FA_DEBUG.md`
4. **Логи браузера:** F12 > Console
5. **Логи API:** Terminal где запущен `apps/api`

## Быстрая проверка через API напрямую

```bash
# 1. Request code
curl -X POST http://localhost:3002/api/auth/request-2fa \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@okurmen.kg","password":"Admin123!LocalDev"}'

# Ожидаемый ответ:
# {"success":true,"data":{"message":"Код подтверждения отправлен в Telegram","email":"admin@okurmen.kg"}}

# 2. Проверьте Telegram - должен прийти код

# 3. Verify code (замените 123456 на код из Telegram)
curl -X POST http://localhost:3002/api/auth/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@okurmen.kg","code":"123456"}'

# Ожидаемый ответ:
# {"success":true,"data":{"token":"eyJ...","user":{...}}}
```

Если эти команды работают, значит проблема на frontend (Admin panel).
Если не работают, значит проблема на backend (API).
