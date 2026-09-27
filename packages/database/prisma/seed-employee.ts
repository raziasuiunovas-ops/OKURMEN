import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Employee Portal test users...');

  // Hash password
  const hashedPassword = await bcrypt.hash('Employee123!', 10);

  // 1. Create MENTOR user
  const mentorUser = await prisma.user.upsert({
    where: { email: 'mentor@okurmen.kg' },
    update: {},
    create: {
      email: 'mentor@okurmen.kg',
      fullName: 'Алексей Ментор',
      phone: '+996555111222',
      passwordHash: hashedPassword,
      role: 'EMPLOYEE',
      isActive: true,
    },
  });

  const mentorProfile = await prisma.employeeProfile.upsert({
    where: { userId: mentorUser.id },
    update: {},
    create: {
      userId: mentorUser.id,
      position: 'MENTOR',
      bio: 'Опытный ментор с 5+ летним стажем работы со студентами',
      joinedAt: new Date('2024-01-15'),
    },
  });

  console.log('✅ Mentor created:', mentorUser.email);

  // 2. Create TEACHER user
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@okurmen.kg' },
    update: {},
    create: {
      email: 'teacher@okurmen.kg',
      fullName: 'Мария Преподаватель',
      phone: '+996555222333',
      passwordHash: hashedPassword,
      role: 'EMPLOYEE',
      isActive: true,
    },
  });

  const teacherProfile = await prisma.employeeProfile.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      position: 'TEACHER',
      bio: 'Преподаватель программирования с опытом работы в IT индустрии',
      joinedAt: new Date('2023-09-01'),
    },
  });

  console.log('✅ Teacher created:', teacherUser.email);

  // 3. Create MANAGER user
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@okurmen.kg' },
    update: {},
    create: {
      email: 'manager@okurmen.kg',
      fullName: 'Дмитрий Менеджер',
      phone: '+996555333444',
      passwordHash: hashedPassword,
      role: 'EMPLOYEE',
      isActive: true,
    },
  });

  const managerProfile = await prisma.employeeProfile.upsert({
    where: { userId: managerUser.id },
    update: {},
    create: {
      userId: managerUser.id,
      position: 'MANAGER',
      bio: 'Менеджер с опытом управления образовательными проектами',
      joinedAt: new Date('2023-06-01'),
    },
  });

  console.log('✅ Manager created:', managerUser.email);

  // 4. Create test course
  const course = await prisma.course.upsert({
    where: { slug: 'test-web-development' },
    update: {},
    create: {
      slug: 'test-web-development',
      price: 25000,
      duration: '6 месяцев',
      format: 'ONLINE',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      icon: 'Code',
    },
  });

  // Link teacher to course
  await prisma.courseTeacher.upsert({
    where: {
      courseId_employeeId: {
        courseId: course.id,
        employeeId: teacherProfile.id,
      },
    },
    update: {},
    create: {
      courseId: course.id,
      employeeId: teacherProfile.id,
    },
  });

  await prisma.courseTranslation.upsert({
    where: {
      courseId_languageCode: {
        courseId: course.id,
        languageCode: 'RU',
      },
    },
    update: {},
    create: {
      courseId: course.id,
      languageCode: 'RU',
      title: 'Веб-разработка для начинающих',
      description: 'Полный курс по современной веб-разработке с нуля',
      program: 'HTML, CSS, JavaScript, React, Node.js',
      level: 'BEGINNER',
    },
  });

  console.log('✅ Course created for teacher');

  // 5. Create test group for mentor
  const group = await prisma.group.upsert({
    where: { name: 'Web Dev Group 1' },
    update: {},
    create: {
      name: 'Web Dev Group 1',
      description: 'Группа по веб-разработке',
      courseId: course.id,
      mentorId: mentorProfile.id,
      isActive: true,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-07-15'),
    },
  });

  console.log('✅ Group created and assigned to mentor');

  // 6. Create test student
  const studentUser = await prisma.user.upsert({
    where: { email: 'student.test@okurmen.kg' },
    update: {},
    create: {
      email: 'student.test@okurmen.kg',
      fullName: 'Тестовый Студент',
      phone: '+996555444555',
      passwordHash: hashedPassword,
      role: 'CLIENT',
      isActive: true,
    },
  });

  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      groupId: group.id,
      status: 'ACTIVE',
    },
  });

  // 7. Create enrollment
  await prisma.enrollment.create({
    data: {
      studentId: studentProfile.id,
      courseId: course.id,
      mentorId: mentorProfile.id,
      status: 'ACTIVE',
      startedAt: new Date('2024-01-15'),
    },
  });

  console.log('✅ Student enrolled in group');

  // 8. Create test lessons
  for (let i = 1; i <= 5; i++) {
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: `Урок ${i}: Основы веб-разработки`,
        description: `Описание урока ${i}`,
        content: `Контент урока ${i}`,
        sortOrder: i,
        videoUrl: `https://example.com/lesson-${i}`,
        duration: 60,
        isPublished: true,
      },
    });

    // Add progress for student
    if (i <= 3) {
      await prisma.lessonProgress.create({
        data: {
          studentId: studentProfile.id,
          lessonId: lesson.id,
          courseId: course.id,
          isCompleted: i < 3,
          watchedAt: new Date(),
          completedAt: i < 3 ? new Date() : null,
        },
      });
    }
  }

  console.log('✅ Test lessons created with progress');

  // 9. Create test booking
  await prisma.booking.create({
    data: {
      studentId: studentProfile.id,
      mentorId: mentorProfile.id,
      courseId: course.id,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 30,
      status: 'CONFIRMED',
      notes: 'Консультация по прогрессу',
    },
  });

  console.log('✅ Test booking created');

  // 10. Create test review
  await prisma.courseReview.create({
    data: {
      studentId: studentProfile.id,
      courseId: course.id,
      rating: 5,
      comment: 'Отличный курс! Очень понятно объясняют.',
    },
  });

  console.log('✅ Test review created');

  console.log('\n✅ ========================================');
  console.log('✅ Employee Portal Test Data Created!');
  console.log('✅ ========================================\n');

  console.log('📧 Login Credentials (password for all: Employee123!):\n');
  console.log('🎓 MENTOR:');
  console.log('   Email: mentor@okurmen.kg');
  console.log('   Password: Employee123!');
  console.log('   Group: Группа Веб-разработки #1\n');

  console.log('👨‍🏫 TEACHER:');
  console.log('   Email: teacher@okurmen.kg');
  console.log('   Password: Employee123!');
  console.log('   Courses: 1 (Веб-разработка для начинающих)\n');

  console.log('👔 MANAGER:');
  console.log('   Email: manager@okurmen.kg');
  console.log('   Password: Employee123!\n');

  console.log('🔐 2FA Instructions:');
  console.log('1. Go to http://localhost:3004/auth/signin');
  console.log('2. Enter email and password');
  console.log('3. Check Telegram for 6-digit code');
  console.log('4. Enter code to complete login\n');

  console.log('📱 Telegram Bot Token: ' + process.env.TELEGRAM_BOT_TOKEN);
  console.log('📱 Telegram Chat ID (for 2FA): ' + process.env.TELEGRAM_CHAT_ID + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
