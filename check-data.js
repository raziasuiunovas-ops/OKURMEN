// Простой скрипт проверки данных в БД
const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  console.log('=== ПРОВЕРКА РЕАЛЬНЫХ ДАННЫХ В БД ===\n');

  // 1. Курсы
  console.log('📚 КУРСЫ:');
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    include: {
      translations: {
        where: { languageCode: 'RU' }
      },
      _count: {
        select: { lessons: true }
      }
    }
  });
  
  courses.forEach((course, i) => {
    console.log(`${i + 1}. ${course.translations[0]?.title || course.slug}`);
    console.log(`   Уроков: ${course._count.lessons}`);
    console.log(`   Цена: ${course.price} сом\n`);
  });

  // 2. Основатели
  console.log('\n👥 ОСНОВАТЕЛИ (FOUNDERS):');
  const founders = await prisma.employeeProfile.findMany({
    where: { 
      position: 'FOUNDER',
      isActive: true 
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          phone: true
        }
      }
    }
  });
  
  founders.forEach((founder, i) => {
    console.log(`${i + 1}. ${founder.user.fullName}`);
    console.log(`   Email: ${founder.user.email || 'н/д'}`);
    console.log(`   Bio: ${founder.bio?.substring(0, 50) || 'н/д'}...\n`);
  });

  // 3. Все активные сотрудники (без основателей)
  console.log('\n💼 АКТИВНЫЕ СОТРУДНИКИ (без FOUNDERS):');
  const employees = await prisma.employeeProfile.findMany({
    where: {
      isActive: true,
      position: { not: 'FOUNDER' }
    },
    include: {
      user: {
        select: { fullName: true }
      }
    }
  });
  console.log(`Всего: ${employees.length} человек`);
  console.log(`Позиции:`);
  const positionCounts = employees.reduce((acc, emp) => {
    acc[emp.position] = (acc[emp.position] || 0) + 1;
    return acc;
  }, {});
  Object.entries(positionCounts).forEach(([pos, count]) => {
    console.log(`  - ${pos}: ${count}`);
  });

  // 4. Отзывы
  console.log('\n⭐ ОТЗЫВЫ:');
  const reviews = await prisma.review.findMany({
    where: { status: 'PUBLISHED' }
  });
  console.log(`Опубликованных отзывов: ${reviews.length}`);

  const courseReviews = await prisma.courseReview.findMany();
  console.log(`Оценок курсов: ${courseReviews.length}`);

  await prisma.$disconnect();
}

checkData().catch(console.error);
