/**
 * OKURMEN DATABASE TEST SCRIPT
 * Проверяет подключение к PostgreSQL и основные таблицы
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testDatabase() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('OKURMEN DATABASE TEST - Проверка PostgreSQL', colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  try {
    // 1. Test Connection
    log('1. Проверка подключения к БД...', colors.yellow);
    await prisma.$connect();
    log('✓ Подключение к PostgreSQL установлено', colors.green);
    
    console.log('');

    // 2. Check Tables
    log('2. Проверка основных таблиц...', colors.yellow);
    
    const usersCount = await prisma.user.count();
    log(`✓ Users: ${usersCount} записей`, colors.green);
    
    const coursesCount = await prisma.course.count();
    log(`✓ Courses: ${coursesCount} записей`, colors.green);
    
    const lessonsCount = await prisma.lesson.count();
    log(`✓ Lessons: ${lessonsCount} записей`, colors.green);
    
    const employeesCount = await prisma.employeeProfile.count();
    log(`✓ Employees: ${employeesCount} записей`, colors.green);
    
    const studentsCount = await prisma.studentProfile.count();
    log(`✓ Students: ${studentsCount} записей`, colors.green);
    
    const groupsCount = await prisma.group.count();
    log(`✓ Groups: ${groupsCount} записей`, colors.green);
    
    const applicationsCount = await prisma.application.count();
    log(`✓ Applications: ${applicationsCount} записей`, colors.green);
    
    const paymentsCount = await prisma.payment.count();
    log(`✓ Payments: ${paymentsCount} записей`, colors.green);
    
    const reviewsCount = await prisma.review.count();
    log(`✓ Reviews: ${reviewsCount} записей`, colors.green);
    
    const alumniCount = await prisma.alumni.count();
    log(`✓ Alumni: ${alumniCount} записей`, colors.green);
    
    console.log('');

    // 3. Check Admin User
    log('3. Проверка админ-пользователя...', colors.yellow);
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
    
    if (adminUser) {
      log(`✓ Админ найден: ${adminUser.fullName} (${adminUser.email})`, colors.green);
    } else {
      log('⚠ Админ не найден - запустите seed скрипт', colors.yellow);
    }
    
    console.log('');

    // 4. Check Relations
    log('4. Проверка связей между таблицами...', colors.yellow);
    
    // Course -> Lessons
    const courseWithLessons = await prisma.course.findFirst({
      include: {
        lessons: true,
        translations: true,
      },
    });
    if (courseWithLessons) {
      log(`✓ Course -> Lessons: ${courseWithLessons.lessons.length} уроков`, colors.green);
      log(`✓ Course -> Translations: ${courseWithLessons.translations.length} переводов`, colors.green);
    }
    
    // Employee -> User
    const employeeWithUser = await prisma.employeeProfile.findFirst({
      include: {
        user: true,
      },
    });
    if (employeeWithUser) {
      log(`✓ Employee -> User: связь работает`, colors.green);
    }
    
    console.log('');

    // Summary
    log('='.repeat(60), colors.cyan);
    log('РЕЗУЛЬТАТЫ ПРОВЕРКИ DATABASE', colors.cyan);
    log('='.repeat(60) + '\n', colors.cyan);
    
    log('✓ PostgreSQL подключение работает', colors.green);
    log('✓ Все таблицы существуют', colors.green);
    log('✓ Связи между таблицами настроены', colors.green);
    log(`✓ Всего записей: ${usersCount + coursesCount + lessonsCount + employeesCount + studentsCount}`, colors.green);
    
    log('\n' + '='.repeat(60) + '\n', colors.cyan);

  } catch (error) {
    log('\n✗ ОШИБКА:', colors.red);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск теста
testDatabase();
