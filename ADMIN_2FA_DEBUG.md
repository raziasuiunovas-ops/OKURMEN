# Диагностика 2FA в Админ-панели

## Проблема
2FA в админ-панели не работает

## Шаги диагностики

### 1. Проверка переменных окружения

Убедитесь что в `.env` и `apps/api/.env.local` есть:
```bash
TELEGRAM_BOT_TOKEN="8638005611:AAGfmLC7UBqA4mKHh26f-0MYVDiwM2-gOqk"
TELEGRAM_CHAT_ID="1376366540"
NEXTAUTH_SECRET="8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d"
```

### 2. Проверка запущенных сервисов

Убедитесь что запущены оба сервиса:
```bash
# В корне проекта
pnpm dev

# Или отдельно
cd apps/api
pnpm dev     # API на http://localhost:3002

cd apps/admin
pnpm dev     # Admin на http://localhost:3001
```

### 3. Открыть диагностическую страницу

Откройте в браузере:
```
http://localhost:3001/diagnostic
```

Проверьте:
- `API_URL` должен быть `http://localhost:3002`
- `apiHealth` status должен быть 200
- `twoFAEndpoint` должен возвращать JSON (не HTML)

### 4. Протестировать 2FA вручную

На странице `/diagnostic`:

1. **Шаг 1: Request 2FA Code**
   - Введите email: `admin@okurmen.kg`
   - Введите password: `Admin123!LocalDev`
   - Нажмите "1. Request 2FA Code"
   - Проверьте Telegram - должен прийти 6-значный код

2. **Шаг 2: Verify Code**
   - Введите полученный код из Telegram
   - Нажмите "2. Verify Code"
   - Проверьте ответ - должен быть токен

### 5. Проверка логов

**В консоли браузера (F12):**
- Должны быть логи `[2FA] Отправка запроса...`
- Должны быть логи `[2FA] Ответ получен...`
- Должны быть логи `[2FA] Токен сохранён...`

**В терминале API (backend):**
```bash
=== REQUEST 2FA START ===
Email: admin@okurmen.kg
Password length: 19
Looking up user...
User found: true
...
=== SEND 2FA CODE START ===
Generated code: 123456
Calling sendTelegramNotification...
```

**В терминале Admin (frontend):**
- Проверьте ошибки подключения к API

### 6. Типичные проблемы

#### Проблема: Код не приходит в Telegram
**Решение:**
- Проверьте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`
- Убедитесь что бот добавлен в чат
- Проверьте логи API - должны быть `SEND TELEGRAM NOTIFICATION START`

#### Проблема: "Неверный код"
**Решение:**
- Код действителен 30 минут
- Проверьте что вводите последний полученный код
- Проверьте логи БД - возможно проблема с таймзоной

#### Проблема: После успешной проверки редирект не работает
**Решение:**
- Проверьте что токен сохранился: `localStorage.getItem('auth-token')`
- Проверьте AuthGuard логи в консоли
- Проверьте что нет ошибок в `router.push('/admin')`

#### Проблема: API возвращает HTML вместо JSON
**Решение:**
- Проверьте что API запущен на порту 3002
- Проверьте `NEXT_PUBLIC_API_URL` в админ-панели
- Убедитесь что нет конфликта портов

### 7. Быстрый тест через curl

**Request 2FA:**
```bash
curl -X POST http://localhost:3002/api/auth/request-2fa \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@okurmen.kg","password":"Admin123!LocalDev"}'
```

**Verify 2FA:**
```bash
curl -X POST http://localhost:3002/api/auth/verify-2fa \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@okurmen.kg","code":"123456"}'
```

### 8. Если ничего не помогло

1. Остановите все сервисы
2. Очистите `.next` папки:
   ```bash
   rm -rf apps/api/.next
   rm -rf apps/admin/.next
   ```
3. Переустановите зависимости:
   ```bash
   pnpm install
   ```
4. Перезапустите:
   ```bash
   pnpm dev
   ```

## Архитектура 2FA

```
1. User вводит email/password -> Admin Panel
2. Admin Panel -> POST /api/auth/request-2fa -> API
3. API проверяет credentials -> генерирует код -> сохраняет в БД
4. API -> отправляет код в Telegram -> Bot API
5. User получает код в Telegram
6. User вводит код -> Admin Panel
7. Admin Panel -> POST /api/auth/verify-2fa -> API
8. API проверяет код в БД -> генерирует JWT токен
9. API -> возвращает токен -> Admin Panel
10. Admin Panel сохраняет токен в localStorage
11. Admin Panel -> redirect /admin
12. AuthGuard проверяет токен в localStorage
```

## Контакты для отладки

- API endpoints: `http://localhost:3002/api/auth/*`
- Admin panel: `http://localhost:3001`
- Diagnostic: `http://localhost:3001/diagnostic`
- Auth page: `http://localhost:3001/auth/signin`
