import { PrismaClient, EmployeePosition } from '@prisma/client';

const prisma = new PrismaClient();

const employeesData = [
  // РУКОВОДСТВО - Основатели и Директора
  {
    fullName: 'Кубанычбек уулу Санжарбек',
    position: EmployeePosition.FOUNDER,
    email: 'sanzhar@okurmen.kg',
    phone: '+996555123456',
    bio: 'Сооснователь ОКУРМЕН. Родился 24 апреля 1994 года.',
    education: 'Высшее образование',
    experience: 'С момента основания (Май 2022)',
    sortOrder: 1,
  },
  {
    fullName: 'Улукбек Бакыбек уулу',
    position: EmployeePosition.MANAGER,
    email: 'ulukbek@okurmen.kg',
    phone: '+996555234567',
    bio: 'Директор отдела продаж',
    education: 'Высшее образование',
    experience: 'С момента основания',
    sortOrder: 2,
  },
  {
    fullName: 'Орозобек уулу Арсланбек',
    position: EmployeePosition.MANAGER,
    email: 'arslan@okurmen.kg',
    phone: '+996555345678',
    bio: 'Коммерческий директор',
    education: 'Высшее образование',
    experience: '5 месяцев в Окурмэн',
    sortOrder: 3,
  },
  {
    fullName: 'Аруна Тазабекова',
    position: EmployeePosition.TEACHER,
    email: 'aruna@okurmen.kg',
    phone: '+996555456789',
    bio: 'Начальник учебного отдела (Завуч). Директор Окурмен Студии',
    education: 'Педагогическое образование',
    experience: '2023-2026 (3 года)',
    sortOrder: 4,
  },

  // ПРОДАЖИ - РОП и Менеджеры
  {
    fullName: 'Сатыбалдиев Бегимбек Темирбекович',
    position: EmployeePosition.MANAGER,
    email: 'begimbek@okurmen.kg',
    phone: '+996555567890',
    bio: 'Руководитель отдела продаж (РОП)',
    education: 'Высшее образование',
    experience: '1 год в ОКУРМЕН',
    sortOrder: 5,
  },
  {
    fullName: 'Азаматова Элона Азаматовна',
    position: EmployeePosition.MANAGER,
    email: 'elona@okurmen.kg',
    phone: '+996555678901',
    bio: 'Руководитель отдела продаж',
    education: 'Высшее образование',
    experience: '1 год 1 месяц в ОКУРМЕН',
    sortOrder: 6,
  },
  {
    fullName: 'Калманбетова Акылай Бактыяровна',
    position: EmployeePosition.MANAGER,
    email: 'akylay@okurmen.kg',
    phone: '+996555789012',
    bio: 'Топ-менеджер отдела продаж',
    education: 'Высшее образование',
    experience: '8 месяцев в ОКУРМЕН',
    sortOrder: 7,
  },
  {
    fullName: 'Жамалбекова Сезим Замирбековна',
    position: EmployeePosition.MANAGER,
    email: 'sezim@okurmen.kg',
    phone: '+996555890123',
    bio: 'Старший менеджер отдела продаж. Сектор "Аура"',
    education: 'Высшее образование',
    experience: '10 месяцев в ОКУРМЕН',
    sortOrder: 8,
  },
  {
    fullName: 'Жолдошбекова Нурпери Нурлановна',
    position: EmployeePosition.MANAGER,
    email: 'nurperi@okurmen.kg',
    phone: '+996555901234',
    bio: 'Менеджер отдела продаж',
    education: 'Высшее образование',
    experience: '4 месяца в ОКУРМЕН',
    sortOrder: 9,
  },

  // УПРАВЛЕНИЕ - HR и Кураторы
  {
    fullName: 'Иличбекова Айжан Адилетовна',
    position: EmployeePosition.MANAGER,
    email: 'ayzhan@okurmen.kg',
    phone: '+996555012345',
    bio: 'HR-руководитель (HR жетекчи)',
    education: 'HR Management',
    experience: '1.5 года в ОКУРМЕН',
    sortOrder: 10,
  },
  {
    fullName: 'Зулпукарова Ясмин Зулпукаровна',
    position: EmployeePosition.MANAGER,
    email: 'yasmin@okurmen.kg',
    phone: '+996555123450',
    bio: 'Куратор образовательных программ',
    education: 'Педагогическое образование',
    experience: 'В ОКУРМЕН',
    sortOrder: 11,
  },

  // МЕНТОРИНГ
  {
    fullName: 'Мирбек Атанбеков',
    position: EmployeePosition.MENTOR,
    email: 'mirbek@okurmen.kg',
    phone: '+996555234501',
    bio: 'FullStack Developer / Ментор',
    education: 'IT образование',
    experience: 'Опытный разработчик',
    sortOrder: 12,
  },
  {
    fullName: 'Орозгелдиева Гулназ Эрмековна',
    position: EmployeePosition.MENTOR,
    email: 'gulnaz@okurmen.kg',
    phone: '+996555345012',
    bio: 'Ментор образовательных программ',
    education: 'Педагогическое/IT образование',
    experience: 'С 01.06.2026',
    sortOrder: 13,
  },
];

async function seedEmployees() {
  console.log('🌱 Seeding employees...');

  for (const employeeData of employeesData) {
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

    console.log(`✅ Added: ${fullName} - ${position}`);
  }

  console.log('✨ Employees seeded successfully!');
}

seedEmployees()
  .catch((e) => {
    console.error('❌ Error seeding employees:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
