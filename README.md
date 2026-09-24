# OKURMEN IT - Учебный центр

Монорепозиторий проекта OKURMEN IT с полной backend/admin системой управления.

## Структура проекта

```
OKURMEN/
├── apps/
│   ├── api/          # Backend API (Next.js 15, NextAuth.js v5)
│   ├── admin/        # Admin панель (Next.js 15, React 19, Tailwind CSS)
│   └── web/          # Публичный сайт (в разработке другим разработчиком)
├── packages/
│   ├── database/     # Prisma ORM + PostgreSQL schema
│   ├── types/        # Общие TypeScript типы
│   └── ui/           # UI компоненты (shared)
└── docs/             # Документация проекта
```

## Tech Stack

### Backend/API
- **Framework**: Next.js 15 (App Router)
- **ORM**: Prisma 6.x
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Validation**: Zod
- **Password hashing**: bcryptjs
- **Telegram**: node-telegram-bot-api

### Admin Panel
- **Framework**: Next.js 15
- **UI**: React 19, Tailwind CSS
- **Forms**: React Hook Form + Zod
- **API Client**: Axios

### Монорепо
- **Tool**: Turborepo
- **Package Manager**: pnpm 9.x
- **TypeScript**: 5.7.x

## Быстрый старт

### 1. Установка зависимостей

```bash
# Установить pnpm (если еще не установлен)
npm install -g pnpm@9

# Установить зависимости
pnpm install
```

### 2. Настройка окружения

Создайте `.env` файл в корне проекта:

```bash
cp .env.example .env
```

Отредактируйте `.env` и заполните реальные значения:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/okurmen"

# Auth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-min-32-chars-change-in-production"

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_CHAT_ID="your-telegram-chat-id"

# Admin Credentials (for seed)
ADMIN_EMAIL="admin@okurmen.kg"
ADMIN_PASSWORD="change-this-password"
```

### 3. Настройка базы данных

```bash
# Генерация Prisma Client
pnpm db:generate

# Применение миграций
pnpm db:migrate

# Заполнение тестовыми данными
pnpm db:seed
```

### 4. Запуск проекта

```bash
# Development mode (все приложения)
pnpm dev

# Или запустить отдельно:
# API (порт 3001)
pnpm --filter @okurmen/api dev

# Admin (порт 3002)
pnpm --filter @okurmen/admin dev
```

### 5. Доступ к приложениям

- **API**: http://localhost:3001
- **Admin Panel**: http://localhost:3002
- **Prisma Studio**: `pnpm db:studio` → http://localhost:5555

## API Endpoints

### Authentication
- `POST /api/auth/callback/credentials` - Login
- `GET /api/auth/me` - Current user

### Courses
- `GET /api/courses` - Список курсов (публичный)
- `POST /api/courses` - Создать курс (admin)
- `PATCH /api/courses/:id` - Обновить курс (admin)
- `DELETE /api/courses/:id` - Удалить курс (admin)

### Employees
- `GET /api/employees` - Список сотрудников (публичный)
- `POST /api/employees` - Создать сотрудника (admin)
- `PATCH /api/employees/:id` - Обновить сотрудника (admin)
- `DELETE /api/employees/:id` - Удалить сотрудника (admin)

### Reviews
- `GET /api/reviews` - Список отзывов (публичный)
- `POST /api/reviews` - Создать отзыв (admin)
- `PATCH /api/reviews/:id` - Обновить отзыв (admin)
- `DELETE /api/reviews/:id` - Удалить отзыв (admin)

### Alumni (Graduates)
- `GET /api/alumni` - Список выпускников (публичный)
- `POST /api/alumni` - Создать запись выпускника (admin)
- `PATCH /api/alumni/:id` - Обновить запись (admin)
- `DELETE /api/alumni/:id` - Удалить запись (admin)

### Applications (Bookings)
- `POST /api/applications` - Создать заявку (публичный)
- `GET /api/applications` - Список заявок (admin)
- `PATCH /api/applications/:id` - Обновить статус (admin)

### Payments
- `GET /api/payments` - Список платежей (admin)
- `PATCH /api/payments/:id` - Обновить статус платежа (admin)

## Database Schema

База данных содержит следующие основные таблицы:

- `users` - Пользователи (admin/client)
- `student_profiles` - Профили студентов
- `employee_profiles` - Профили сотрудников
- `courses` - Курсы
- `course_translations` - Переводы курсов (ky/ru/en)
- `enrollments` - Записи на курсы
- `applications` - Заявки
- `payments` - Платежи
- `reviews` - Отзывы
- `alumni` - Выпускники
- `grants` - Гранты
- `activities` - Дополнительные активности
- `pages` - Управляемые страницы
- `social_links` - Социальные ссылки
- `media` - Медиа файлы

## Admin Credentials

После выполнения seed:

- **Email**: admin@okurmen.kg (или из .env)
- **Password**: Admin123! (или из .env)

## Безопасность

✅ Пароли хешируются через bcryptjs  
✅ Admin endpoints защищены middleware  
✅ Валидация входных данных через Zod  
✅ Секреты не попадают в Git (.gitignore)  
✅ CORS настроен для безопасности  
✅ SQL injection защита через Prisma  
✅ XSS защита через React  

## Telegram Интеграция

При создании новой заявки и успешной оплате отправляются уведомления в Telegram бот.

Настройка:
1. Создайте бота через @BotFather
2. Получите токен бота
3. Получите chat ID (используйте @userinfobot)
4. Добавьте в .env

## Scripts

```bash
# Development
pnpm dev              # Запустить все приложения
pnpm build            # Собрать все приложения
pnpm lint             # Проверка кода
pnpm type-check       # Проверка TypeScript

# Database
pnpm db:generate      # Генерация Prisma Client
pnpm db:push          # Push schema без миграций
pnpm db:migrate       # Создать и применить миграции
pnpm db:seed          # Заполнить базу данных
pnpm db:studio        # Открыть Prisma Studio
```

## Production Build

```bash
# Сборка всех приложений
pnpm build

# Запуск в production режиме
pnpm --filter @okurmen/api start
pnpm --filter @okurmen/admin start
```

## Environment Variables

Обязательные переменные для production:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - URL API сервера
- `NEXTAUTH_SECRET` - Секретный ключ (мин. 32 символа)

Опциональные:

- `TELEGRAM_BOT_TOKEN` - Токен Telegram бота
- `TELEGRAM_CHAT_ID` - ID чата для уведомлений

## Troubleshooting

### Database connection failed
```bash
# Проверьте DATABASE_URL в .env
# Убедитесь что PostgreSQL запущен
# Проверьте права доступа к базе данных
```

### Prisma Client не найден
```bash
pnpm db:generate
```

### Port already in use
```bash
# Измените порты в package.json или остановите процессы:
# API: 3001
# Admin: 3002
```

## Разработка

### Добавление нового API endpoint

1. Создайте route в `apps/api/src/app/api/`
2. Добавьте validator в `apps/api/src/lib/validators/`
3. Используйте middleware из `apps/api/src/lib/auth/utils.ts`
4. Добавьте типы в `packages/types/` (если нужно)

### Добавление admin страницы

1. Создайте page в `apps/admin/src/app/admin/`
2. Используйте `api` client из `apps/admin/src/lib/api.ts`
3. Добавьте route в navigation в `apps/admin/src/app/admin/layout.tsx`

## Команда

- Backend/Admin: Моя зона ответственности
- Frontend/Web/Mobile: Другой разработчик

## Лицензия

Private - OKURMEN IT © 2024
