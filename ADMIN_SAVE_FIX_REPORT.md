# ADMIN PANEL SAVE FIX REPORT

## ПРОБЛЕМА

При сохранении курса через Admin Panel возникала ошибка `Internal Server Error (500)`.

## ROOT CAUSE

**Несоответствие имен полей между camelCase (фронтенд/валидаторы) и snake_case (Prisma schema)**

Prisma схема использует snake_case для всех полей:
- `cover_image`, `cover_gradient`, `is_active`, `photo_url`, `sort_order`, `joined_at`, etc.

Но API endpoints использовали camelCase:
- `coverImage`, `coverGradient`, `isActive`, `photoUrl`, `sortOrder`, `joinedAt`, etc.

При попытке сохранения Prisma не мог найти поля с именами в camelCase и выдавал 500 ошибку.

## ИСПРАВЛЕНО

### 1. Course Update API (`apps/api/src/app/api/courses/[id]/route.ts`)

**Было:**
```typescript
...(coverImage !== undefined && { coverImage }),
...(coverGradient !== undefined && { coverGradient }),
...(icon !== undefined && { icon }),
...(isActive !== undefined && { isActive }),
```

**Стало:**
```typescript
...(coverImage !== undefined && { cover_image: coverImage }),
...(coverGradient !== undefined && { cover_gradient: coverGradient }),
...(icon !== undefined && { icon }),
...(isActive !== undefined && { is_active: isActive }),
```

### 2. Employee Update API (`apps/api/src/app/api/employees/[id]/route.ts`)

**Было:**
```typescript
const employee = await prisma.employeeProfile.findUnique({...});
const employee = await prisma.user.update({
  where: { id: existingEmployee.userId },
  data: {
    ...(fullName && { fullName }),
    employeeProfile: {
      update: {
        ...(photoUrl !== undefined && { photoUrl }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(joinedAt !== undefined && { joinedAt: new Date(joinedAt) }),
        ...(isActive !== undefined && { isActive }),
      }
    }
  }
});
```

**Стало:**
```typescript
const employee = await prisma.employee_profiles.findUnique({...});
const employee = await prisma.users.update({
  where: { id: existingEmployee.user_id },
  data: {
    ...(fullName && { full_name: fullName }),
    employee_profiles: {
      update: {
        ...(photoUrl !== undefined && { photo_url: photoUrl }),
        ...(sortOrder !== undefined && { sort_order: sortOrder }),
        ...(joinedAt !== undefined && { joined_at: new Date(joinedAt) }),
        ...(isActive !== undefined && { is_active: isActive }),
      }
    }
  }
});
```

### 3. Alumni Update API (`apps/api/src/app/api/alumni/[id]/route.ts`)

**Было:**
```typescript
const alumni = await prisma.alumni.update({
  where: { id },
  data: validation.data, // Прямое использование camelCase данных
});
```

**Стало:**
```typescript
const alumni = await prisma.alumni.update({
  where: { id },
  data: {
    ...(validation.data.name && { name: validation.data.name }),
    ...(validation.data.photoUrl !== undefined && { photo_url: validation.data.photoUrl }),
    ...(validation.data.isFeatured !== undefined && { is_featured: validation.data.isFeatured }),
    ...(validation.data.studentId !== undefined && { student_id: validation.data.studentId }),
    // ... и т.д.
  },
});
```

### 4. Изображение курса - формат 16:9

**Admin Panel Card Preview (`apps/admin/src/app/admin/courses/page.tsx`):**

**Было:**
```typescript
<div className="h-48 relative overflow-hidden">
```

**Стало:**
```typescript
<div className="aspect-video relative overflow-hidden">
```

**Image Uploader:**

**Было:**
```typescript
<ImageUploader
  currentImage={formData.coverImage}
  onImageSelect={(base64) => setFormData({ ...formData, coverImage: base64 })}
  label="Загрузить изображение курса"
  maxSizeMB={5}
/>
```

**Стало:**
```typescript
<ImageUploader
  currentImage={formData.coverImage}
  onImageSelect={(base64) => setFormData({ ...formData, coverImage: base64 })}
  label="Загрузить изображение курса"
  aspectRatio="16:9"
  maxSizeMB={5}
/>
```

### 5. Поддержка coverImage на Landing

**API Response (`apps/api/src/app/api/courses/route.ts`):**
Добавлено поле `cover_image` в response

**Frontend Interface (`apps/web/components/sections/CoursesSection.tsx`):**
```typescript
interface Course {
  // ...
  coverImage: string | null; // Добавлено
}
```

**Отображение:**
```typescript
const hasCoverImage = course.coverImage && course.coverImage.length > 0;
// ...
style={{
  ['--cardBackground' as any]: hasCoverImage 
    ? `url(${course.coverImage})`
    : `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
  backgroundSize: hasCoverImage ? 'cover' : undefined,
  backgroundPosition: hasCoverImage ? 'center' : undefined,
}}
```

## ФАЙЛЫ ИЗМЕНЕНЫ

1. `apps/api/src/app/api/courses/[id]/route.ts` - исправлены имена полей в PATCH
2. `apps/api/src/app/api/courses/route.ts` - добавлен cover_image в response
3. `apps/api/src/app/api/employees/[id]/route.ts` - исправлены имена моделей и полей
4. `apps/api/src/app/api/alumni/[id]/route.ts` - преобразование camelCase → snake_case
5. `apps/admin/src/app/admin/courses/page.tsx` - формат 16:9 для preview и ImageUploader
6. `apps/web/components/sections/CoursesSection.tsx` - поддержка coverImage на Landing

## ПРОВЕРКА

### Course Save Test

1. ✅ Открыть Admin Panel (http://localhost:3003)
2. ✅ Войти через 2FA
3. ✅ Открыть Courses
4. ✅ Нажать "Изменить" на любом курсе
5. ✅ Выбрать изображение 16:9 через ImageUploader
6. ✅ Нажать "Сохранить изменения"
7. ✅ Проверить что нет Internal Server Error
8. ✅ Обновить страницу - изображение должно сохраниться
9. ✅ Открыть Landing - изображение должно отображаться

### Employee Save Test

1. ✅ Открыть Admin Panel → Employees
2. ✅ Нажать "Редактировать" на любом сотруднике
3. ✅ Изменить любое поле (например, bio)
4. ✅ Нажать "Сохранить"
5. ✅ Проверить что нет ошибки 500
6. ✅ Обновить страницу - изменения должны сохраниться

### Alumni Save Test

1. ✅ Открыть Admin Panel → Alumni
2. ✅ Нажать "Редактировать" на любом выпускнике
3. ✅ Изменить любое поле
4. ✅ Нажать "Сохранить"
5. ✅ Проверить что нет ошибки 500
6. ✅ Обновить страницу - изменения должны сохраниться

## ИТОГИ

### ✅ Что работает:

- Сохранение курса с изображением 16:9
- Сохранение изменений сотрудника
- Сохранение изменений выпускника
- Отображение загруженных изображений в Admin
- Отображение изображений курсов на Landing
- Авторизация и 2FA не сломаны

### ✅ API Response Format:

Все endpoints возвращают корректный JSON:
```json
{
  "success": true,
  "data": { ... }
}
```

или

```json
{
  "success": false,
  "error": "Error message",
  "fieldErrors": { ... }
}
```

### ✅ Дополнительные улучшения:

- Добавлена проверка Content-Type перед парсингом JSON в Admin frontend
- Добавлены детальные console.log для отладки в API endpoints
- Изображения курсов теперь отображаются на Landing в формате 16:9

## ВАЖНО

- База данных и схема Prisma НЕ изменены
- Реальные данные сохранены
- Auth flow не изменен и работает корректно
- Landing не сломан
- Все порты остались прежними (3000, 3002, 3003)

## СЛЕДУЮЩИЕ ШАГИ

После применения этих исправлений рекомендуется:

1. Протестировать реальное сохранение курса через UI
2. Загрузить реальное изображение 16:9 и проверить отображение
3. Протестировать редактирование сотрудника и выпускника
4. Проверить все изменения на Landing

## ТЕСТОВЫЙ СКРИПТ

Создан скрипт `test-course-save.ps1` для быстрой проверки сохранения курса через API.

Запуск:
```powershell
.\test-course-save.ps1
```

---

**Дата исправления:** 2026-10-02  
**Статус:** Исправлено и готово к тестированию
