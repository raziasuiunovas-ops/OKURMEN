import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating groups F1-F5...');

  // Получаем существующие курсы
  const courses = await prisma.course.findMany({
    where: {
      slug: {
        in: ['frontend-development', 'backend-development', 'fullstack-development']
      }
    }
  });

  const frontendCourse = courses.find(c => c.slug === 'frontend-development');
  const backendCourse = courses.find(c => c.slug === 'backend-development');
  const fullstackCourse = courses.find(c => c.slug === 'fullstack-development');

  // Create Groups F1-F5
  const groups = await Promise.all([
    prisma.group.upsert({
      where: { name: 'F1' },
      update: {},
      create: {
        name: 'F1',
        description: 'Группа F1 - Frontend разработка',
        courseId: frontendCourse?.id,
        startDate: new Date('2024-09-01'),
        isActive: true,
      },
    }),
    prisma.group.upsert({
      where: { name: 'F2' },
      update: {},
      create: {
        name: 'F2',
        description: 'Группа F2 - Frontend разработка',
        courseId: frontendCourse?.id,
        startDate: new Date('2024-11-01'),
        isActive: true,
      },
    }),
    prisma.group.upsert({
      where: { name: 'F3' },
      update: {},
      create: {
        name: 'F3',
        description: 'Группа F3 - Backend разработка',
        courseId: backendCourse?.id,
        startDate: new Date('2024-10-01'),
        isActive: true,
      },
    }),
    prisma.group.upsert({
      where: { name: 'F4' },
      update: {},
      create: {
        name: 'F4',
        description: 'Группа F4 - Fullstack разработка',
        courseId: fullstackCourse?.id,
        startDate: new Date('2024-09-15'),
        isActive: true,
      },
    }),
    prisma.group.upsert({
      where: { name: 'F5' },
      update: {},
      create: {
        name: 'F5',
        description: 'Группа F5 - Frontend разработка',
        courseId: frontendCourse?.id,
        startDate: new Date('2025-01-10'),
        isActive: true,
      },
    }),
  ]);

  console.log('✅ 5 Groups created: F1, F2, F3, F4, F5');
  console.log('-----------------------------------');
  groups.forEach(g => {
    console.log(`  ${g.name}: ${g.description}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
