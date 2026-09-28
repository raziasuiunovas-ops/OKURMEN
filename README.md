# ОКУРМЭН - IT Образовательная Платформа

Современная платформа для IT образования в Кыргызстане.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
pnpm install
```

### 2. Настройка базы данных
Скопируйте `.env.example` в `.env` и настройте переменные окружения:
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Применить миграции
```bash
cd packages/database
npx prisma migrate dev
npx prisma db seed
```

### 4. Запуск проекта

#### Запуск всех сервисов (рекомендуется):
```bash
start-all.bat
```

#### Или запуск отдельных сервисов:
```bash
# Web (лендинг)
cd apps/web
npm run dev

# API
cd apps/api
npm run dev

# Admin панель
cd apps/admin
npm run dev
```

## 📁 Структура проекта

```
OKURMEN/
├── apps/
│   ├── web/          # Лендинг сайт (Next.js 15)
│   ├── api/          # API сервер (Next.js API Routes)
│   ├── admin/        # Админ панель
│   ├── student/      # Студенческий портал
│   └── employee/     # Сотрудник портал
├── packages/
│   ├── database/     # Prisma схема и миграции
│   └── shared/       # Общий код
└── docs/             # Документация

```

## 🌐 Порты

- **Web (лендинг):** http://localhost:3000
- **API:** http://localhost:3002
- **Admin:** http://localhost:3003
- **Student:** http://localhost:3001
- **Employee:** http://localhost:3004

## 🛠 Технологии

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Auth:** NextAuth.js
- **i18n:** next-intl (KG, RU, EN)
- **Package Manager:** pnpm

## 📝 Основные команды

```bash
# Установка
pnpm install

# Разработка
npm run dev

# Билд
npm run build

# Запуск продакшн
npm start

# Линтинг
npm run lint

# База данных
cd packages/database
npx prisma studio          # Открыть Prisma Studio
npx prisma migrate dev     # Создать миграцию
npx prisma db push         # Применить изменения схемы
npx prisma db seed         # Заполнить базу тестовыми данными
```

## 🔧 Полная перестройка (при проблемах)

Если возникли проблемы с кэшем или зависимостями:

```bash
FULL-REBUILD.bat
```

Это удалит все кэши и пересоздаст node_modules.

## 📚 Документация

- **ТЗ:** `docs/OKURMEN_TZZ.md`
- **База данных:** `docs/OKURMEN_DBB.md`

## 👥 Авторы

- Санжарбек Мадумаров
- Улукбек Бакыбек уулу

## 📄 Лицензия

© 2024 ОКУРМЭН. Все права защищены.
