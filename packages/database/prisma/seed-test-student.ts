import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Загружаем .env из root проекта
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Создание тестового студента...');

  // Хешируем пароль "test123"
  const hashedPassword = await bcrypt.hash('test123', 10);

  // Проверяем существует ли уже этот email
  const existingUser = await prisma.user.findUnique({
    where: { email: 'student@test.com' },
  });

  if (existingUser) {
    console.log('⚠️  Студент student@test.com уже существует!');
    console.log('Логин: student@test.com');
    console.log('Пароль: test123');
    return;
  }

  // Создаем User
  const user = await prisma.user.create({
    data: {
      email: 'student@test.com',
      passwordHash: hashedPassword,
      fullName: 'Тестовый Студент',
      role: 'CLIENT',
      preferredLanguage: 'RU',
      isActive: true,
    },
  });

  console.log('✅ User создан:', user.email);

  // Создаем StudentProfile
  const studentProfile = await prisma.studentProfile.create({
    data: {
      userId: user.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ StudentProfile создан для студента');

  // Получаем первый доступный курс (если есть)
  const firstCourse = await prisma.course.findFirst({
    where: { isActive: true },
  });

  if (firstCourse) {
    // Создаем Enrollment для тестового курса
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: studentProfile.id,
        courseId: firstCourse.id,
        status: 'ACTIVE',
        startedAt: new Date(),
      },
    });

    console.log('✅ Enrollment создан для курса:', firstCourse.id);
  } else {
    console.log('⚠️  Нет опубликованных курсов для записи');
  }

  console.log('\n🎉 Тестовый студент успешно создан!');
  console.log('\n📝 Данные для входа:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('URL:    http://localhost:3001');
  console.log('Email:  student@test.com');
  console.log('Пароль: test123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при создании тестового студента:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
