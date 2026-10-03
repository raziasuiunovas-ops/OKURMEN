# План исправления английской локализации Admin

## Найденные проблемы:

### 1. **employees/page.tsx** (КРИТИЧНО)
Хардкодные русские строки:
- "Сотрудники ОКУРМЭН" → нужен ключ `employees.title`
- "Всего: X сотрудников" → нужен ключ `employees.totalCount`
- "Добавить сотрудника" → ключ `employees.add` есть
- "Все сотрудники", "Руководство", "Менторинг" → нужны ключи для DEPARTMENTS
- "Должность не указана" → нужен ключ
- "Сотрудники не найдены..." → нужны ключи
- "Изменить" → ключ `common.edit` есть
- Все toast сообщения на русском
- Все confirm диалоги на русском
- Модальное окно: "Редактировать сотрудника", "Фото сотрудника", "Портретное фото..."
- "Выберите хотя бы одну должность"
- "Краткая информация о сотруднике"

### 2. **students/page.tsx** (КРИТИЧНО)
- "Ученики и Группы" → ключ `students.title` есть
- "Всего: X учеников в Y группах" → ключ `students.totalInGroups` есть, но неправильно используется
- "Создать группу" → ключ `students.createGroup` есть
- "Группа X" → нужен шаблон
- "X ученик/учеников" → нужен ключ с плюрализацией
- "Открыть доступ к курсу" → нужен ключ
- "Добавить ученика" → нужен ключ
- "В группе пока нет учеников" → ключ `students.noStudentsInGroup` есть
- "Добавить первого ученика" → ключ `students.addFirstStudent` есть
- Все toast и confirm на русском
- Модальные окна полностью на русском

### 3. **courses/page.tsx** (КРИТИЧНО)
- "Всего: X курсов • Активных: Y" → ключ есть `courses.totalActive`
- "Создать курс" → ключ `courses.createCourse` есть
- "X часов", "Нет уроков" → нужны ключи
- "Автоматические расчеты" → ключ `courses.autoCalculation` есть
- "Рейтинг рассчитывается..." → ключи есть
- "6 месяцев" placeholder → нужен ключ
- "Сохранение..." → ключ `common.saving` есть
- "Редактировать курс", "Создать новый курс" → ключи есть
- Все alert на русском

### 4. **lessons/page.tsx** - нужно проверить

### 5. **reviews/page.tsx** - нужно проверить

### 6. **alumni/page.tsx** - нужно проверить

### 7. **applications/page.tsx** - нужно проверить

### 8. **site-stats/page.tsx** - нужно проверить

### 9. **settings/page.tsx** - нужно проверить

### 10. **page.tsx** (dashboard) - нужно проверить

## Недостающие ключи в EN:

```typescript
// Employees (дополнительные)
'employees.okurmenTitle': 'OKURMEN Employees'
'employees.positionNotSpecified': 'Position not specified'
'employees.confirmDelete': 'Are you sure you want to delete employee "{name}"?'
'employees.deleteConfirm': 'Delete Employee'
'employees.saveSuccess': 'Employee "{name}" saved successfully!'
'employees.createSuccess': 'Employee "{name}" added successfully!'
'employees.updateSuccess': 'Employee "{name}" updated successfully!'
'employees.saveError': 'Error: {message}'
'employees.serverError': 'Server error: {status} {statusText}'
'employees.savingError': 'Error saving employee'
'employees.selectPositions': 'Select at least one position'
'employees.bioPlaceholder': 'Brief information about the employee'
'employees.photoLabel': 'Employee Photo'
'employees.photoHint': 'Portrait photo 3:4. Image will be automatically cropped and optimized for employee cards.'

// Students (дополнительные)
'students.groupPrefix': 'Group'
'students.studentCount': '{count} student(s)'
'students.grantAccess': 'Grant Course Access'
'students.grantAccessTooltip': 'Grant course access to the entire group'
'students.addStudentTooltip': 'Add student'
'students.addFirstStudentBtn': 'Add first student'
'students.grantAccessStudent': 'Grant course access'
'students.groupNameLabel': 'Group Name *'
'students.mentorLabel': 'Group Mentor'
'students.startDateLabel': 'Start Date'
'students.endDateLabel': 'End Date'
'students.groupActiveLabel': 'Group is active'
'students.selectMentor': 'Select a mentor for the group (optional)'
'students.saveSuccess': 'Group "{name}" {action}'
'students.groupCreated': 'created'
'students.groupUpdated': 'updated'
'students.studentAdded': 'Student "{name}" added to group {group}'
'students.addError': 'Error: {message}'
'students.addStudentError': 'Failed to add student'
'students.selectCourseError': 'Please select a course'
'students.selectCourseLabel': 'Select Course *'
'students.selectCoursePlaceholder': '-- Select a course --'
'students.grantAccessWarning': 'Access will be granted to all {count} students in the group'

// Courses (дополнительные)
'courses.hoursCount': '{hours} hours'
'courses.noLessonsCount': 'No lessons'
'courses.durationPlaceholder': '6 months'
'courses.durationHint': 'Total duration in hours is calculated automatically from lessons'
'courses.saveError': 'Error: {message}'
'courses.savingError': 'Error saving course'

// Common (дополнительные)
'common.confirm Delete': 'Confirm Delete'
'common.yes': 'Yes'
'common.no': 'No'
'common.close': 'Close'
'common.select': 'Select'
'common.noData': 'No data'
'common.checkConnection': 'Check your connection'
