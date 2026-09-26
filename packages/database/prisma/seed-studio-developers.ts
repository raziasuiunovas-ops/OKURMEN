import { PrismaClient, EmployeePosition } from '@prisma/client';

const prisma = new PrismaClient();

const studioEmployees = [
  // Директор ОКУРМЕН Студио
  {
    fullName: 'Аруна Тазабекова',
    position: EmployeePosition.DEVELOPER,
    email: 'aruna.studio@okurmen.kg',
    phone: '+996555100001',
    bio: 'Директор Окурмэн Студия. Начальник учебного отдела (Завуч)',
    education: 'Педагогическое образование',
    experience: '2023-2026 (3 года в Окурмэн)',
    sortOrder: 100,
  },
  // 8 начинающих Frontend разработчиков
  {
    fullName: 'Ильяз',
    position: EmployeePosition.DEVELOPER,
    email: 'ilyaz@okurmen.kg',
    phone: '+996555100002',
    bio: 'Начинающий Frontend разработчик в Окурмэн Студия',
    education: 'IT образование',
    experience: 'Только начинает карьеру',
    sortOrder: 101,
  },
  {
    fullName: 'Зайнаб',
    position: EmployeePosition.DEVELOPER,
    email: 'zaynab@okurmen.kg',
    phone: '+996555100003',
    bio: 'Начинающий Frontend разработчик в Окурмэн Студия',
    education: 'IT образование',
    experience: 'Только начинает карьеру',
    sortOrder: 102,
  },
  {
    fullName: 'Суйунова Разия',
    position: EmployeePosition.DEVELOPER,
    email: 'raziya@okurmen.kg',
    phone: '+996555100004',
    bio: 'Начинающий Frontend разработчик в Окурмэн Студия',
    education: 'IT образование',
    experience: 'Только начинает карьеру',
    sortOrder: 103,
  },
  {
    fullName: 'Айдана',
    position: EmployeePosition.DEVELOPER,
    email: 'aydana@okurmen.kg',
    phone: '+996555100005',
    bio: 'Начинающий Frontend разработчик в Окурмэн Студия',
    education: 'IT образование',
    experience: 'Только начинает карьеру',
    sortOrder: 104,
  },
  {
    fullName: 'Нураида',
    position: EmployeePosition.DEVELOPER,
    email: 'nuraida@okurmen.kg',
    phone: '+996555100006',
    bio: 'Начинающий Frontend разработчик в Окурмэн Студия',
    education: 'IT образование',
    experience: 'Только начинает карьеру',
    sortOrder: 105,
  },
  {
    fullName: 'Даниель',
    position: EmployeePosition.DEVELOPER,
    email: 'daniel@okurmen.kg',
    phone: '+996555100007',
    bio: 'Начинающий Frontend разработчик в Окурмэн Студия',
    education: 'IT образование',
    experience: 'Только начинает карьеру',
    sortOrder: 106,
  },
  {
    fullName: 'Асир',
    position: EmployeePosition.DEVELOPER,
    email: 'asir@okurmen.kg',
    phone: '+996555100008',
    bio: 'Начинающий Frontend разработчик в Окурмэн Студия',
    education: 'IT образование',
    experience: 'Только начинает карьеру',
    sortOrder: 107,
  },
  {
    fullName: 'Кутман',
    position: EmployeePosition.DEVELOPER,
    email: 'kutman@okurmen.kg',
    phone: '+996555100009',
    bio: 'Начинающий Frontend разработчик в Окурмэн Студия',
    education: 'IT образование',
    experience: 'Только начинает карьеру',
    sortOrder: 108,
  },
];

async function seedStudioDevelopers() {
  console.log('🎨 Seeding Окурмэн Студия developers...');

  for (const employeeData of studioEmployees) {
    const { fullName, position, email, phone, bio, education, experience, sortOrder } = employeeData;

    // Создаём или находим пользователя
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        fullName,
        phone,
      },
      create: {
        fullName,
        email,
        phone,
        role: 'CLIENT', // Базовая роль
        preferredLanguage: 'RU',
      },
    });

    // Создаём или обновляем профиль сотрудника
    await prisma.employeeProfile.upsert({
      where: { userId: user.id },
      update: {
        position,
        bio,
        education,
        experience,
        sortOrder,
        isActive: true,
      },
      create: {
        userId: user.id,
        position,
        bio,
        education,
        experience,
        sortOrder,
        isActive: true,
        joinedAt: new Date(),
      },
    });

    console.log(`✅ Added: ${fullName} - ${position === 'DEVELOPER' ? 'Окурмэн Студия' : position}`);
  }

  console.log('✨ Окурмэн Студия developers seeded successfully!');
  console.log('👥 Всего: 1 директор + 8 разработчиков = 9 человек');
}

seedStudioDevelopers()
  .catch((e) => {
    console.error('❌ Error seeding studio developers:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
