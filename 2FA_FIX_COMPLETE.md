# Исправление 2FA в админ-панели ✅

## Проблема
Админ-панель позволяла входить БЕЗ 2FA кода - можно было войти напрямую через простой signin.

## Что было исправлено

### 1. API: `/api/auth/signin` (apps/api/src/app/api/auth/signin/route.ts)

**Было:**
```typescript
// ADMIN и EMPLOYEE получали токен напрямую без 2FA
if (user.role === 'ADMIN' || user.role === 'EMPLOYEE') {
  const token = await createSessionToken(...);
  return { ok: true, token };
}
```

**Стало:**
```typescript
// ADMIN и EMPLOYEE ОБЯЗАНЫ использовать 2FA
if (user.role === 'ADMIN' || user.role === 'EMPLOYEE') {
  return {
    error: 'Требуется двухфакторная аутентификация',
    require2FA: true,
    message: 'Используйте /api/auth/request-2fa для входа'
  };
}
```

### 2. Admin Panel: Страница авторизации (apps/admin/src/app/auth/signin/page.tsx)

**Было:**
```typescript
// Сначала пробовали простой signin
const signinResponse = await fetch('/api/auth/signin');
if (signinResponse.ok && signinData.token) {
  // Вход без 2FA ❌
  localStorage.setItem('auth-token', signinData.token);
  router.push('/admin');
}
```

**Стало:**
```typescript
// ВСЕГДА используем 2FA для админ-панели
const response = await fetch('/api/auth/request-2fa');
// Теперь ОБЯЗАТЕЛЬНО требуется ввести код из Telegram ✅
setStep('2fa');
```

## Как теперь работает 2FA

### Обязательный флоу для ADMIN и EMPLOYEE:

```
1. User вводит email/password
   ↓
2. Admin Panel → POST /api/auth/request-2fa
   ↓
3. API проверяет credentials → генерирует код → отправляет в Telegram
   ↓
4. User получает код в Telegram (6 цифр)
   ↓
5. User вводит код на странице
   ↓
6. Admin Panel → POST /api/auth/verify-2fa
   ↓
7. API проверяет код → возвращает JWT токен
   ↓
8. Admin Panel сохраняет токен → redirect /admin
```

**Теперь НЕВОЗМОЖНО войти без кода из Telegram!**

## Тестирование

### 1. Проверка что старый способ больше не работает:

```bash
# Попытка войти через старый signin (должна быть отклонена)
curl -X POST http://localhost:3002/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@okurmen.kg","password":"Admin123!LocalDev"}'

# Ожидаемый ответ:
# {
#   "error": "Требуется двухфакторная аутентификация",
#   "require2FA": true,
#   "message": "Используйте /api/auth/request-2fa для входа"
# }
```

### 2. Проверка что 2FA работает:

```bash
# Шаг 1: Запросить код
curl -X POST http://localhost:3002/api/auth/request-2fa \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@okurmen.kg","password":"Admin123!LocalDev"}'

# Должен прийти код в Telegram

# Шаг 2: Проверить код (замените 123456 на код из Telegram)
curl -X POST http://localhost:3002/api/auth/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@okurmen.kg","code":"123456"}'

# Ожидаемый ответ:
# {
#   "success": true,
#   "data": {
#     "token": "eyJ...",
#     "user": {...}
#   }
# }
```

### 3. Проверка в браузере:

1. Откройте `http://localhost:3001/auth/signin`
2. Введите email и пароль
3. Нажмите "Получить код"
4. **Проверьте консоль браузера (F12):**
   ```
   [Auth] Запрос 2FA для админ-панели...
   [Auth] 2FA код запрошен, переход к вводу кода
   ```
5. **Проверьте Telegram** - должен прийти код
6. Введите код на странице
7. Должен быть переход на `/admin`

## Проверка безопасности

### ✅ Что НЕВОЗМОЖНО сделать теперь:

1. ❌ Войти в админ-панель без 2FA кода
2. ❌ Использовать `/api/auth/signin` для ADMIN/EMPLOYEE
3. ❌ Обойти проверку кода из Telegram
4. ❌ Использовать истёкший код (30 минут)
5. ❌ Использовать код дважды (удаляется после использования)

### ✅ Что МОЖНО сделать:

1. ✅ Войти только после ввода кода из Telegram
2. ✅ Запросить новый код если старый истёк
3. ✅ Увидеть понятные ошибки в консоли

## Настройка Telegram бота

Если код не приходит, проверьте:

1. **В файле `.env` должны быть:**
   ```bash
   TELEGRAM_BOT_TOKEN="8638005611:AAGfmLC7UBqA4mKHh26f-0MYVDiwM2-gOqk"
   TELEGRAM_CHAT_ID="1376366540"
   ```

2. **Проверьте что бот активен:**
   ```bash
   curl https://api.telegram.org/bot8638005611:AAGfmLC7UBqA4mKHh26f-0MYVDiwM2-gOqk/getMe
   ```

3. **Проверьте что можете отправить сообщение:**
   ```bash
   curl -X POST https://api.telegram.org/bot8638005611:AAGfmLC7UBqA4mKHh26f-0MYVDiwM2-gOqk/sendMessage \
     -d "chat_id=1376366540&text=Test"
   ```

## Логи для проверки

### В консоли браузера:
```
[Auth] Запрос 2FA для админ-панели...
[Auth] 2FA код запрошен, переход к вводу кода
[2FA] Отправка запроса verify-2fa...
[2FA] Ответ получен: {success: true, data: {...}}
[2FA] Сохранение токена в localStorage...
[2FA] Токен сохранён, длина: 200+
[2FA] Переход на /admin...
[AuthGuard] ✅ Токен найден, доступ разрешён
```

### В терминале API:
```
=== REQUEST 2FA START ===
Email: admin@okurmen.kg
Password length: 19
User found: true
User role: ADMIN
=== SEND 2FA CODE START ===
Generated code: 123456
=== SEND TELEGRAM NOTIFICATION START ===
Notification type: 2fa
Telegram API response status: 200
=== VERIFY 2FA START ===
Email: admin@okurmen.kg
Code to verify: 123456
Code valid: true
Token created
=== VERIFY 2FA SUCCESS ===
```

## Откат изменений (если нужно)

Если по какой-то причине нужно временно отключить 2FA:

```typescript
// В apps/api/src/app/api/auth/signin/route.ts
// Раскомментируйте старый код создания токена
// НО ЭТО НЕБЕЗОПАСНО ДЛЯ PRODUCTION!
```

## Итог

✅ **2FA теперь обязательна для ADMIN и EMPLOYEE**  
✅ **Невозможно обойти проверку кода**  
✅ **Код приходит в Telegram**  
✅ **Код действителен 30 минут**  
✅ **Код можно использовать только один раз**

**Админ-панель теперь защищена двухфакторной аутентификацией!** 🔒
