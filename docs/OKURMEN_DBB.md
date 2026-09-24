# OKURMEN IT — структура базы данных

> Рабочая предварительная схема БД для OKURMEN IT. Схема предназначена для обсуждения и визуализации в Excalidraw. Поля и связи можно уточнять после утверждения бизнес-логики.

## 1. Основные сущности

### users
Общие пользователи системы.

- `id` — PK
- `full_name`
- `phone`
- `email`
- `password_hash` — только для авторизованных пользователей
- `role` — только `admin` или `client`
- `preferred_language` — `ky`, `ru`, `en`
- `created_at`
- `updated_at`

### student_profiles
Профиль студента.

- `id` — PK
- `user_id` — FK → `users.id`
- `status`
- `created_at`
- `updated_at`

### employee_profiles
Профили сотрудников, преподавателей, менторов и руководителей. Должность сотрудника хранится отдельно в `position` и не является системной ролью.

- `id` — PK
- `user_id` — FK → `users.id`
- `position`
- `bio`
- `education`
- `experience`
- `joined_at`
- `photo_url`
- `created_at`
- `updated_at`

`position` может содержать, например, «Ментор», «Преподаватель», «Маркетолог | SMM», «Коммерческий директор» и т. д.

Системные роли проекта: только `admin` и `client`.

### courses
Курсы OKURMEN IT.

- `id` — PK
- `slug` — UNIQUE
- `price`
- `duration`
- `is_active`
- `created_at`
- `updated_at`

### course_translations
Переводы названия и содержания курса.

- `id` — PK
- `course_id` — FK → `courses.id`
- `language_code` — `ky`, `ru`, `en`
- `title`
- `description`
- `program`

UNIQUE: (`course_id`, `language_code`)

### course_teachers
Связь курсов и преподавателей.

- `course_id` — FK → `courses.id`
- `employee_id` — FK → `employee_profiles.id`

PK: (`course_id`, `employee_id`)

### enrollments
Запись студента на курс.

- `id` — PK
- `student_id` — FK → `student_profiles.id`
- `course_id` — FK → `courses.id`
- `mentor_id` — FK → `employee_profiles.id` — может быть NULL
- `status`
- `started_at`
- `completed_at`
- `created_at`

### applications
Заявки на курс / обращение пользователя.

- `id` — PK
- `user_id` — FK → `users.id` — может быть NULL
- `course_id` — FK → `courses.id`
- `full_name`
- `phone`
- `email`
- `comment`
- `status`
- `created_at`

### payments
Платежи.

- `id` — PK
- `application_id` — FK → `applications.id` — может быть NULL
- `student_id` — FK → `student_profiles.id` — может быть NULL
- `course_id` — FK → `courses.id`
- `amount`
- `currency`
- `provider`
- `provider_payment_id`
- `status`
- `paid_at`
- `created_at`

### telegram_notifications
История отправки уведомлений в Telegram.

- `id` — PK
- `payment_id` — FK → `payments.id` — может быть NULL
- `application_id` — FK → `applications.id` — может быть NULL
- `status`
- `telegram_message_id`
- `sent_at`
- `created_at`

Токены, пароли и секреты Telegram в БД в открытом виде не хранить.

### reviews
Отзывы.

- `id` — PK
- `user_id` — FK → `users.id` — может быть NULL
- `author_name`
- `review_type` — `student` / `parent`
- `text`
- `photo_url`
- `video_url`
- `status`
- `created_at`

### alumni
Истории выпускников.

- `id` — PK
- `student_id` — FK → `student_profiles.id` — может быть NULL
- `name`
- `company`
- `position`
- `story`
- `photo_url`
- `is_featured`
- `created_at`

### grants
Грантовая программа 10 000 сом.

- `id` — PK
- `student_id` — FK → `student_profiles.id`
- `amount`
- `currency`
- `reason_type` — трудоустройство / коммерческий проект
- `description`
- `status`
- `awarded_at`
- `created_at`

### activities
Дополнительные образовательные активности.

- `id` — PK
- `slug` — UNIQUE
- `is_active`
- `created_at`
- `updated_at`

### activity_translations
Переводы дополнительных активностей.

- `id` — PK
- `activity_id` — FK → `activities.id`
- `language_code` — `ky`, `ru`, `en`
- `title`
- `description`

UNIQUE: (`activity_id`, `language_code`)

### pages
Управляемые контентные страницы.

- `id` — PK
- `slug` — UNIQUE
- `is_published`
- `created_at`
- `updated_at`

### page_translations
Переводы страниц.

- `id` — PK
- `page_id` — FK → `pages.id`
- `language_code` — `ky`, `ru`, `en`
- `title`
- `content`

UNIQUE: (`page_id`, `language_code`)

### social_links
Социальные сети и внешние ссылки OKURMEN.

- `id` — PK
- `platform`
- `url`
- `label`
- `is_active`
- `sort_order`

### media
Медиаматериалы проекта.

- `id` — PK
- `file_url`
- `file_type`
- `alt_text`
- `created_at`

Для текстовых полей, которые являются контентом сайта, использовать i18n/translation-таблицы вместо хранения трёх языков в одной строке.


## 2.1. Системные роли

В проекте используются только две системные роли:

- `admin` — администратор;
- `client` — клиент.

Ментор, преподаватель, маркетолог, коммерческий директор, завуч и другие сотрудники не являются отдельными ролями доступа. Их должность хранится в `employee_profiles.position`, а управление сотрудниками выполняет администратор.

## 2. Основные связи

```text
users 1 ─── 0..1 student_profiles
users 1 ─── 0..1 employee_profiles

courses 1 ─── N course_translations
courses N ─── N employee_profiles     (через course_teachers)

student_profiles N ─── N courses      (через enrollments)
enrollments N ─── 1 employee_profiles (mentor_id)

courses 1 ─── N applications
users 1 ─── N applications

applications 1 ─── N payments
courses 1 ─── N payments
student_profiles 1 ─── N payments

payments 1 ─── N telegram_notifications
applications 1 ─── N telegram_notifications

users 1 ─── N reviews
student_profiles 1 ─── N alumni
student_profiles 1 ─── N grants

activities 1 ─── N activity_translations
pages 1 ─── N page_translations
```

## 3. Что обязательно показать на схеме Excalidraw

На диаграмме достаточно показать каждую таблицу как отдельный блок, внутри — название таблицы и основные поля с пометками `PK` / `FK`.

Ключевые связи, которые должны быть видны:

1. `users` → `student_profiles`
2. `users` → `employee_profiles`
3. `courses` → `course_translations`
4. `courses` ↔ `employee_profiles` через `course_teachers`
5. `student_profiles` ↔ `courses` через `enrollments`
6. `enrollments` → `employee_profiles` как mentor
7. `courses` → `applications`
8. `applications` → `payments`
9. `payments` → `telegram_notifications`
10. `users` → `reviews`
11. `student_profiles` → `alumni`
12. `student_profiles` → `grants`
13. `activities` → `activity_translations`
14. `pages` → `page_translations`

## 4. Ограничения

- Не хранить пароли в открытом виде.
- Не хранить Telegram-токены и другие секреты в БД или Git в открытом виде.
- Для переводов использовать `ky`, `ru`, `en`.
- Для полей, которые являются контентом, предусмотреть отсутствие перевода без поломки интерфейса.
- Поля и связи, которые зависят от ещё не утверждённого бизнес-процесса, считать предварительными.
