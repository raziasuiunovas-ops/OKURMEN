# Запуск Admin Panel - Быстрая инструкция

## 🚀 Запуск

```powershell
# 1. Остановить все node процессы
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Перейти в директорию проекта
cd C:\Users\user\Desktop\OKURMEN

# 3. Запустить dev серверы
pnpm dev
```

**Подождать 20-30 секунд** пока серверы запустятся.

## 🌐 Открыть

- **Admin Panel:** http://localhost:3002/auth/signin
- **API:** http://localhost:3001
- **Web:** http://localhost:3000

## 🔐 Вход

Используйте credentials из вашего `.env` файла.

**По умолчанию (если не изменили):**
```
Email: admin@okurmen.kg
Password: (см. ADMIN_PASSWORD в .env)
```

**Примечание:** Пароль устанавливается в `.env` файле при seed. Если забыли, используйте `pnpm db:seed` для пересоздания admin.

## ✅ Проверка

После входа должны отображаться:
- Курсы: 3
- Сотрудники: 5
- Заявки: 0
- Оплачено: 0

## ❌ Если не работает

### Проблема: Port already in use

```powershell
# Найти процесс на порту 3002
netstat -ano | findstr ":3002"

# Убить процесс (замените PID на реальный из команды выше)
Stop-Process -Id PID -Force

# Перезапустить
pnpm dev
```

### Проблема: "Неверный email или пароль"

```powershell
# Обновить admin пароль
cd packages\database
npx tsx update-admin.ts

# Вернуться и перезапустить
cd ..\..
pnpm dev
```

### Проблема: Dashboard показывает "Network Error"

```powershell
# Проверить что API запущен
curl http://localhost:3001/api/courses

# Если не работает, перезапустить всё
Get-Process node | Stop-Process -Force
pnpm dev
```

## 📖 Подробная документация

- **Исправление auth:** `docs/AUTH_FIX.md`
- **Исправление network error:** `docs/ADMIN_PANEL_FIX.md`
- **Полная настройка:** `SETUP.md`
