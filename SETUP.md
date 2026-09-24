# OKURMEN IT - Setup Guide

## Пошаговая установка и запуск проекта

### Предварительные требования

1. **Node.js** >= 20.0.0
2. **pnpm** >= 9.0.0
3. **PostgreSQL** >= 14.0
4. **Git**

---

## Шаг 1: Установка Node.js и pnpm

### Windows

```powershell
# Установите Node.js с официального сайта
# https://nodejs.org/

# После установки Node.js, установите pnpm
npm install -g pnpm@9
```

### Проверка установки

```bash
node --version   # должно быть >= 20.0.0
pnpm --version   # должно быть >= 9.0.0
```

---

## Шаг 2: Установка PostgreSQL

### Windows

1. Скачайте PostgreSQL с https://www.postgresql.org/download/windows/
2. Запустите установщик
3. Запомните пароль для пользователя `postgres`
4. Порт по умолчанию: 5432

### Создание базы данных

```sql
-- Запустите pgAdmin или psql
CREATE DATABASE okurmen;
CREATE USER okurmen_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE okurmen TO okurmen_user;
```

---

## Шаг 3: Клонирование и настройка проекта

```bash
# Перейдите в папку проекта
cd C:\Users\user\Desktop\OKURMEN

# Установите зависимости
pnpm install
```

---

## Шаг 4: Настройка .env файла

```bash
# Скопируйте .env.example
copy .env.example .env

# Откройте .env и заполните:
```

**Пример заполнения .env:**

```env
# Database
DATABASE_URL="postgresql://okurmen_user:your_secure_password@localhost:5432/okurmen"

# Auth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3"

# Telegram (опционально, можно оставить пустым)
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# Admin credentials
ADMIN_EMAIL="admin@okurmen.kg"
ADMIN_PASSWORD="Admin123!SecurePassword"
```

### Генерация NEXTAUTH_SECRET

```bash
# Windows PowerShell
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

---

## Шаг 5: Настройка базы данных

```bash
# 1. Генерация Prisma Client
pnpm db:generate

# 2. Создание таблиц в базе данных
pnpm db:push

# Альтернатива: создать миграцию
# pnpm db:migrate

# 3. Заполнение тестовыми данными
pnpm db:seed
```

**Ожидаемый результат seed:**

```
🎉 Seed completed successfully!

📋 Summary:
-----------------------------------
Admin: admin@okurmen.kg
Password: Admin123!SecurePassword

✅ 2 Founders
✅ 1 Teacher
✅ 2 Mentors
✅ 3 Courses
✅ 2 Students
✅ 3 Alumni
✅ 3 Reviews
✅ 4 Social Links
✅ 2 Activities
-----------------------------------
```

---

## Шаг 6: Запуск проекта

### Development режим

```bash
# Запустить все приложения сразу
pnpm dev

# Или запустить по отдельности:
pnpm --filter @okurmen/api dev      # API на порту 3001
pnpm --filter @okurmen/admin dev    # Admin на порту 3002
```

### Открыть приложения

- **API**: http://localhost:3001
- **Admin Panel**: http://localhost:3002
- **Prisma Studio**: `pnpm db:studio` → http://localhost:5555

---

## Шаг 7: Вход в Admin Panel

1. Откройте http://localhost:3002
2. Вы будете перенаправлены на `/auth/signin`
3. Введите credentials:
   - Email: `admin@okurmen.kg` (или из .env)
   - Password: `Admin123!SecurePassword` (или из .env)
4. После входа вы попадёте на Dashboard

---

## Проверка работоспособности

### 1. API Health Check

```bash
# Получить список курсов (публичный endpoint)
curl http://localhost:3001/api/courses
```

### 2. Prisma Studio

```bash
pnpm db:studio
```

Откройте http://localhost:5555 и проверьте данные в таблицах.

### 3. Admin Dashboard

Откройте http://localhost:3002 и проверьте статистику:
- Количество курсов
- Количество сотрудников
- Заявки
- Платежи

---

## Возможные проблемы и решения

### Проблема 1: Database connection failed

```
Error: P1001: Can't reach database server
```

**Решение:**
1. Проверьте что PostgreSQL запущен
2. Проверьте DATABASE_URL в .env
3. Проверьте что база данных `okurmen` создана
4. Проверьте права доступа пользователя

```bash
# Проверка подключения
psql -U okurmen_user -d okurmen -h localhost
```

### Проблема 2: Prisma Client не найден

```
Error: @prisma/client did not initialize yet
```

**Решение:**

```bash
pnpm db:generate
```

### Проблема 3: Port already in use

```
Error: Port 3001 is already in use
```

**Решение:**

```bash
# Windows: найти и остановить процесс
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Или измените порт в package.json
```

### Проблема 4: pnpm install fails

```
Error: EACCES: permission denied
```

**Решение:**

```bash
# Запустите PowerShell от имени администратора
# Очистите кэш
pnpm store prune
pnpm install
```

### Проблема 5: Build errors

```
Error: Cannot find module '@okurmen/database'
```

**Решение:**

```bash
# Пересоберите проект
pnpm clean
pnpm install
pnpm build
```

---

## Production Setup

### 1. Build

```bash
pnpm build
```

### 2. Environment

Создайте production .env:

```env
DATABASE_URL="postgresql://user:password@prod-host:5432/okurmen"
NEXTAUTH_URL="https://api.okurmen.kg"
NEXTAUTH_SECRET="<STRONG-RANDOM-SECRET-64-CHARS>"
NODE_ENV="production"
```

### 3. Database Migration

```bash
# Production миграции
pnpm db:migrate

# НЕ используйте db:seed в production!
```

### 4. Start

```bash
pnpm --filter @okurmen/api start
pnpm --filter @okurmen/admin start
```

---

## Дополнительные команды

```bash
# Проверка кода
pnpm lint

# TypeScript проверка
pnpm type-check

# Сборка проекта
pnpm build

# Очистка
pnpm clean

# Prisma Studio
pnpm db:studio

# Просмотр логов (dev режим)
# Логи будут в терминале где запущен pnpm dev
```

---

## Структура после установки

```
OKURMEN/
├── node_modules/           # Зависимости (не коммитить)
├── apps/
│   ├── api/
│   │   ├── .next/         # Build файлы (не коммитить)
│   │   └── node_modules/  # Зависимости
│   └── admin/
│       ├── .next/         # Build файлы (не коммитить)
│       └── node_modules/  # Зависимости
├── packages/
│   └── database/
│       ├── node_modules/  # Зависимости
│       └── node_modules/.prisma/  # Prisma Client
├── .env                   # Ваши секреты (не коммитить)
└── pnpm-lock.yaml         # Lock файл
```

---

## Следующие шаги

1. ✅ Установка завершена
2. ✅ База данных настроена
3. ✅ Проект запущен
4. 📝 Изучите API endpoints в README.md
5. 🔒 Прочитайте SECURITY.md
6. 💻 Начните разработку

---

## Получение помощи

- **Документация**: README.md, SECURITY.md
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth.js Docs**: https://authjs.dev

---

Успешной разработки! 🚀
