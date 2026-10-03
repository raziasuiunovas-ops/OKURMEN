import { PrismaClient, EmployeePosition } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding team members...');

  // Структура команды
  const team = [
    // 1. Негиздөөчүлөр (FOUNDER)
    {
      fullName: 'Санжар',
      email: 'sanzhar@okurmen.kg',
      positions: [EmployeePosition.FOUNDER],
      bio: 'Сооснователь и идейный вдохновитель ОКУРМЭН',
      experience: 'с 2023',
      sortOrder: 1,
    },
    {
      fullName: 'Улукбек',
      email: 'ulukbek@okurmen.kg',
      positions: [EmployeePosition.FOUNDER],
      bio: 'Сооснователь ОКУРМЭН',
      experience: 'с 2023',
      sortOrder: 2,
    },

    // 2. Директорлор (DIRECTOR)
    {
      fullName: 'Улан',
      email: 'ulan@okurmen.kg',
      positions: [EmployeePosition.DIRECTOR],
      bio: 'Директор отдела продаж',
      experience: 'с 2024',
      sortOrder: 3,
    },
    {
      fullName: 'Арслан',
      email: 'arslan@okurmen.kg',
      positions: [EmployeePosition.DIRECTOR],
      bio: 'Директор отдела маркетинга',
      experience: 'с 2024',
      sortOrder: 4,
    },

    // 3. Завуч (HEAD_TEACHER)
    {
      fullName: 'Арууна',
      email: 'aruuna@okurmen.kg',
      positions: [EmployeePosition.HEAD_TEACHER, EmployeePosition.DIRECTOR],
      bio: 'Руководитель учебного отдела, завуч; Директор ОКУРМЭН Студии',
      experience: 'с 2024',
      sortOrder: 5,
    },

    // 4. Кураторлор (CURATOR)
    {
      fullName: 'Ясмин',
      email: 'yasmin@okurmen.kg',
      positions: [EmployeePosition.CURATOR],
      bio: 'Куратор студентов',
      experience: 'с 2024',
      sortOrder: 6,
    },
    {
      fullName: 'Сезим',
      email: 'sezim.curator@okurmen.kg',
      positions: [EmployeePosition.CURATOR],
      bio: 'Куратор студентов',
      experience: 'с 2024',
      sortOrder: 7,
    },

    // 5. Менторлор (MENTOR) - 8 адам
    {
      fullName: 'Мирбек',
      email: 'mirbek@okurmen.kg',
      positions: [EmployeePosition.MENTOR],
      bio: 'Ментор по программированию',
      experience: 'с 2024',
      sortOrder: 8,
    },
    {
      fullName: 'Бакыт',
      email: 'bakyt@okurmen.kg',
      positions: [EmployeePosition.MENTOR],
      bio: 'Ментор по разработке',
      experience: 'с 2024',
      sortOrder: 9,
    },
    {
      fullName: 'Дастан',
      email: 'dastan@okurmen.kg',
      positions: [EmployeePosition.MENTOR],
      bio: 'Ментор по программированию',
      experience: 'с 2024',
      sortOrder: 10,
    },
    {
      fullName: 'Бека',
      email: 'beka@okurmen.kg',
      positions: [EmployeePosition.MENTOR],
      bio: 'Ментор',
      experience: 'с 2024',
      sortOrder: 11,
    },
    {
      fullName: 'Даниель',
      email: 'daniel@okurmen.kg',
      positions: [EmployeePosition.MENTOR],
      bio: 'Ментор по разработке',
      experience: 'с 2024',
      sortOrder: 12,
    },
    {
      fullName: 'Гулназ',
      email: 'gulnaz@okurmen.kg',
      positions: [EmployeePosition.MENTOR],
      bio: 'Ментор',
      experience: 'с 2024',
      sortOrder: 13,
    },
    {
      fullName: 'Нурсултан',
      email: 'nursultan@okurmen.kg',
      positions: [EmployeePosition.MENTOR],
      bio: 'Ментор по программированию',
      experience: 'с 2024',
      sortOrder: 14,
    },
    {
      fullName: 'Сезим',
      email: 'sezim.mentor@okurmen.kg',
      positions: [EmployeePosition.MENTOR],
      bio: 'Ментор',
      experience: 'с 2024',
      sortOrder: 15,
    },

    // 6. РОП (ROP) - Руководители отдела продаж
    {
      fullName: 'Элона',
      email: 'elona@okurmen.kg',
      positions: [EmployeePosition.ROP],
      bio: 'Руководитель отдела продаж',
      experience: 'с 2024',
      sortOrder: 16,
    },
    {
      fullName: 'Арууке',
      email: 'aruuke@okurmen.kg',
      positions: [EmployeePosition.ROP],
      bio: 'Руководитель отдела продаж',
      experience: 'с 2024',
      sortOrder: 17,
    },
    {
      fullName: 'Бегимбек',
      email: 'begimbek@okurmen.kg',
      positions: [EmployeePosition.ROP],
      bio: 'Руководитель отдела продаж',
      experience: 'с 2024',
      sortOrder: 18,
    },

    // 7. Топ-5 менеджеры (SENIOR_MANAGER)
    {
      fullName: 'Топ-менеджер 1',
      email: 'manager1@okurmen.kg',
      positions: [EmployeePosition.SENIOR_MANAGER],
      bio: 'Старший менеджер по продажам',
      experience: 'с 2024',
      sortOrder: 19,
    },
    {
      fullName: 'Топ-менеджер 2',
      email: 'manager2@okurmen.kg',
      positions: [EmployeePosition.SENIOR_MANAGER],
      bio: 'Старший менеджер по продажам',
      experience: 'с 2024',
      sortOrder: 20,
    },
    {
      fullName: 'Топ-менеджер 3',
      email: 'manager3@okurmen.kg',
      positions: [EmployeePosition.SENIOR_MANAGER],
      bio: 'Старший менеджер по продажам',
      experience: 'с 2024',
      sortOrder: 21,
    },
    {
      fullName: 'Топ-менеджер 4',
      email: 'manager4@okurmen.kg',
      positions: [EmployeePosition.SENIOR_MANAGER],
      bio: 'Старший менеджер по продажам',
      experience: 'с 2024',
      sortOrder: 22,
    },
    {
      fullName: 'Топ-менеджер 5',
      email: 'manager5@okurmen.kg',
      positions: [EmployeePosition.SENIOR_MANAGER],
      bio: 'Старший менеджер по продажам',
      experience: 'с 2024',
      sortOrder: 23,
    },

    // 8. Офис-менеджер (ADMIN_STAFF)
    {
      fullName: 'Дилфуза',
      email: 'dilfuza@okurmen.kg',
      positions: [EmployeePosition.ADMIN_STAFF],
      bio: 'Офис-менеджер',
      experience: 'с 2024',
      sortOrder: 24,
    },
  ];

  for (const member of team) {
    // Создаём или обновляем пользователя
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: {
        fullName: member.fullName,
      },
      create: {
        email: member.email,
        fullName: member.fullName,
        passwordHash: '$2b$10$placeholder', // Временный хеш пароля
        role: 'EMPLOYEE',
      },
    });

    // Создаём или обновляем сотрудника
    await prisma.employee.upsert({
      where: { userId: user.id },
      update: {
        positions: member.positions,
        bio: member.bio,
        experience: member.experience,
        sortOrder: member.sortOrder,
      },
      create: {
        userId: user.id,
        positions: member.positions,
        bio: member.bio,
        experience: member.experience,
        sortOrder: member.sortOrder,
      },
    });

    console.log(`✅ ${member.fullName} - ${member.positions.join(', ')}`);
  }

  console.log('✅ Team seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding team:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
