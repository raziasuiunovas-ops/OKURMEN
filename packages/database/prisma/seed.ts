import { PrismaClient, UserRole, EmployeePosition, CourseFormat, LanguageCode, ReviewType, ReviewStatus, StudentStatus } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

// Hash password using bcryptjs (same as auth system)
function hashPassword(password: string): string {
  return hashSync(password, 10);
}

async function main() {
  console.log('🌱 Starting seed...');

  // Get admin credentials from env or use defaults
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@okurmen.kg';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  // 1. Create ADMIN user
  console.log('Creating admin user...');
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      fullName: 'Admin OKURMEN',
      phone: '+996555123456',
      passwordHash: hashPassword(adminPassword),
      role: UserRole.ADMIN,
      preferredLanguage: LanguageCode.RU,
      isActive: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Create Founders
  console.log('Creating founders...');
  const founder1 = await prisma.user.create({
    data: {
      fullName: 'Санжарбек Мадумаров',
      phone: '+996700000001',
      role: UserRole.CLIENT,
      preferredLanguage: LanguageCode.RU,
      employeeProfile: {
        create: {
          position: EmployeePosition.FOUNDER,
          bio: 'Сооснователь ОКУРМЕН. Опыт в образовании и технологиях.',
          joinedAt: new Date('2022-05-01'),
          sortOrder: 1,
          isActive: true,
        },
      },
    },
  });

  const founder2 = await prisma.user.create({
    data: {
      fullName: 'Улукбек Бакыбек уулу',
      phone: '+996700000002',
      role: UserRole.CLIENT,
      preferredLanguage: LanguageCode.KY,
      employeeProfile: {
        create: {
          position: EmployeePosition.FOUNDER,
          bio: 'Сооснователь ОКУРМЕН. Эксперт в IT-образовании.',
          joinedAt: new Date('2022-05-01'),
          sortOrder: 2,
          isActive: true,
        },
      },
    },
  });
  console.log('✅ Founders created');

  // 3. Create Teacher (Айзада Акылбекова)
  console.log('Creating teachers...');
  const teacher = await prisma.user.create({
    data: {
      fullName: 'Айзада Акылбекова',
      phone: '+996700000003',
      role: UserRole.CLIENT,
      preferredLanguage: LanguageCode.RU,
      employeeProfile: {
        create: {
          position: EmployeePosition.TEACHER,
          bio: 'Ведущий преподаватель. Работает в США. Проводит онлайн-уроки.',
          education: 'Computer Science, USA',
          experience: '5+ лет опыта преподавания программирования',
          joinedAt: new Date('2022-06-01'),
          sortOrder: 3,
          isActive: true,
        },
      },
    },
    include: {
      employeeProfile: true,
    },
  });
  console.log('✅ Teacher created');

  // 4. Create Mentors
  console.log('Creating mentors...');
  const mentor1 = await prisma.user.create({
    data: {
      fullName: 'Азамат Токтобеков',
      phone: '+996700000004',
      role: UserRole.CLIENT,
      preferredLanguage: LanguageCode.RU,
      employeeProfile: {
        create: {
          position: EmployeePosition.MENTOR,
          bio: 'Ментор по Frontend разработке',
          experience: '3 года опыта',
          joinedAt: new Date('2023-01-15'),
          sortOrder: 4,
          isActive: true,
        },
      },
    },
    include: {
      employeeProfile: true,
    },
  });

  const mentor2 = await prisma.user.create({
    data: {
      fullName: 'Айгерим Сатыбалдиева',
      phone: '+996700000005',
      role: UserRole.CLIENT,
      preferredLanguage: LanguageCode.KY,
      employeeProfile: {
        create: {
          position: EmployeePosition.MENTOR,
          bio: 'Ментор по Backend разработке',
          experience: '4 года опыта',
          joinedAt: new Date('2023-02-01'),
          sortOrder: 5,
          isActive: true,
        },
      },
    },
    include: {
      employeeProfile: true,
    },
  });
  console.log('✅ Mentors created');

  // 5. Create Courses
  console.log('Creating courses...');
  
  const frontendCourse = await prisma.course.create({
    data: {
      slug: 'frontend-development',
      price: 25000,
      duration: '6 месяцев',
      format: CourseFormat.HYBRID,
      isActive: true,
      translations: {
        create: [
          {
            languageCode: LanguageCode.RU,
            title: 'Frontend разработка',
            description: 'Полный курс по Frontend разработке с нуля до Junior уровня',
            program: 'HTML, CSS, JavaScript, React, TypeScript, Git',
          },
          {
            languageCode: LanguageCode.EN,
            title: 'Frontend Development',
            description: 'Complete Frontend development course from zero to Junior level',
            program: 'HTML, CSS, JavaScript, React, TypeScript, Git',
          },
          {
            languageCode: LanguageCode.KY,
            title: 'Frontend иштеп чыгуу',
            description: 'Нөлдөн баштап Junior деңгээлге чейин Frontend иштеп чыгуу курсу',
            program: 'HTML, CSS, JavaScript, React, TypeScript, Git',
          },
        ],
      },
      teachers: {
        create: [
          { employeeId: teacher.employeeProfile!.id },
          { employeeId: mentor1.employeeProfile!.id },
        ],
      },
    },
  });

  const backendCourse = await prisma.course.create({
    data: {
      slug: 'backend-development',
      price: 28000,
      duration: '7 месяцев',
      format: CourseFormat.HYBRID,
      isActive: true,
      translations: {
        create: [
          {
            languageCode: LanguageCode.RU,
            title: 'Backend разработка',
            description: 'Профессиональный курс по Backend разработке',
            program: 'Node.js, Express, PostgreSQL, MongoDB, REST API, Docker',
          },
          {
            languageCode: LanguageCode.EN,
            title: 'Backend Development',
            description: 'Professional Backend development course',
            program: 'Node.js, Express, PostgreSQL, MongoDB, REST API, Docker',
          },
          {
            languageCode: LanguageCode.KY,
            title: 'Backend иштеп чыгуу',
            description: 'Backend иштеп чыгуу боюнча профессионалдык курс',
            program: 'Node.js, Express, PostgreSQL, MongoDB, REST API, Docker',
          },
        ],
      },
      teachers: {
        create: [
          { employeeId: teacher.employeeProfile!.id },
          { employeeId: mentor2.employeeProfile!.id },
        ],
      },
    },
  });

  const fullstackCourse = await prisma.course.create({
    data: {
      slug: 'fullstack-development',
      price: 35000,
      duration: '10 месяцев',
      format: CourseFormat.HYBRID,
      isActive: true,
      translations: {
        create: [
          {
            languageCode: LanguageCode.RU,
            title: 'Fullstack разработка',
            description: 'Комплексный курс по Fullstack разработке',
            program: 'Frontend + Backend + DevOps основы',
          },
          {
            languageCode: LanguageCode.EN,
            title: 'Fullstack Development',
            description: 'Comprehensive Fullstack development course',
            program: 'Frontend + Backend + DevOps basics',
          },
          {
            languageCode: LanguageCode.KY,
            title: 'Fullstack иштеп чыгуу',
            description: 'Fullstack иштеп чыгуу боюнча комплекстүү курс',
            program: 'Frontend + Backend + DevOps негиздери',
          },
        ],
      },
      teachers: {
        create: [
          { employeeId: teacher.employeeProfile!.id },
          { employeeId: mentor1.employeeProfile!.id },
          { employeeId: mentor2.employeeProfile!.id },
        ],
      },
    },
  });
  console.log('✅ Courses created');

  // 6. Create Students
  console.log('Creating students...');
  const student1 = await prisma.user.create({
    data: {
      fullName: 'Бекжан Исаков',
      phone: '+996555111111',
      email: 'bekzhan@example.com',
      role: UserRole.CLIENT,
      preferredLanguage: LanguageCode.RU,
      studentProfile: {
        create: {
          status: StudentStatus.ACTIVE,
          enrollments: {
            create: {
              courseId: frontendCourse.id,
              mentorId: mentor1.employeeProfile!.id,
              startedAt: new Date('2024-01-15'),
              status: 'ACTIVE',
            },
          },
        },
      },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      fullName: 'Нургуль Асанова',
      phone: '+996555222222',
      email: 'nurgul@example.com',
      role: UserRole.CLIENT,
      preferredLanguage: LanguageCode.KY,
      studentProfile: {
        create: {
          status: StudentStatus.ACTIVE,
          enrollments: {
            create: {
              courseId: backendCourse.id,
              mentorId: mentor2.employeeProfile!.id,
              startedAt: new Date('2024-02-01'),
              status: 'ACTIVE',
            },
          },
        },
      },
    },
  });
  console.log('✅ Students created');

  // 7. Create Alumni (Graduates)
  console.log('Creating alumni...');
  await prisma.alumni.createMany({
    data: [
      {
        name: 'Эрлан Бекмуратов',
        company: 'Apple',
        position: 'Software Engineer',
        story: 'После окончания курса Frontend разработки получил работу в Apple в США',
        isFeatured: true,
      },
      {
        name: 'Айгерим Токтогулова',
        company: 'Kulikovsky',
        position: 'Frontend Developer',
        story: 'Работает Frontend разработчиком в компании Kulikovsky',
        isFeatured: true,
      },
      {
        name: 'Максат Акылбеков',
        company: 'Мэрия Бишкека',
        position: 'Backend Developer',
        story: 'Разрабатывает цифровые решения для Мэрии Бишкека',
        isFeatured: false,
      },
    ],
  });
  console.log('✅ Alumni created');

  // 8. Create Reviews
  console.log('Creating reviews...');
  await prisma.review.createMany({
    data: [
      {
        authorName: 'Азамат Турдубеков',
        reviewType: ReviewType.STUDENT,
        text: 'Отличный курс! Преподаватели профессионалы, ментор всегда помогает. Рекомендую!',
        rating: 5,
        status: ReviewStatus.PUBLISHED,
      },
      {
        authorName: 'Гульмира Асанова',
        reviewType: ReviewType.PARENT,
        text: 'Мой сын учится здесь уже 4 месяца. Видим реальный прогресс. Спасибо команде ОКУРМЕН!',
        rating: 5,
        status: ReviewStatus.PUBLISHED,
      },
      {
        authorName: 'Жаныбек Касымов',
        reviewType: ReviewType.STUDENT,
        text: 'Гибридный формат очень удобен. Онлайн уроки + живое общение с ментором - идеально!',
        rating: 5,
        status: ReviewStatus.PUBLISHED,
      },
    ],
  });
  console.log('✅ Reviews created');

  // 9. Create Social Links
  console.log('Creating social links...');
  await prisma.socialLink.createMany({
    data: [
      {
        platform: 'Instagram',
        url: 'https://instagram.com/okurmen.kg',
        label: '@okurmen.kg',
        sortOrder: 1,
        isActive: true,
      },
      {
        platform: 'Facebook',
        url: 'https://facebook.com/okurmen.kg',
        label: 'ОКУРМЕН',
        sortOrder: 2,
        isActive: true,
      },
      {
        platform: 'Telegram',
        url: 'https://t.me/okurmen_kg',
        label: '@okurmen_kg',
        sortOrder: 3,
        isActive: true,
      },
      {
        platform: 'WhatsApp',
        url: 'https://wa.me/996555123456',
        label: '+996 555 123 456',
        sortOrder: 4,
        isActive: true,
      },
    ],
  });
  console.log('✅ Social links created');

  // 10. Create Activities
  console.log('Creating activities...');
  const oratoryActivity = await prisma.activity.create({
    data: {
      slug: 'oratory-course',
      type: 'ORATORY_COURSE',
      isActive: true,
      translations: {
        create: [
          {
            languageCode: LanguageCode.RU,
            title: 'Ораторское мастерство',
            description: 'Курс по развитию навыков публичных выступлений',
          },
          {
            languageCode: LanguageCode.EN,
            title: 'Public Speaking',
            description: 'Public speaking skills development course',
          },
          {
            languageCode: LanguageCode.KY,
            title: 'Оратордук чеберчилик',
            description: 'Элдин алдында сүйлөө көндүмдөрүн өнүктүрүү курсу',
          },
        ],
      },
    },
  });

  const talkingClub = await prisma.activity.create({
    data: {
      slug: 'talking-club',
      type: 'TALKING_CLUB',
      isActive: true,
      translations: {
        create: [
          {
            languageCode: LanguageCode.RU,
            title: 'Talking Club',
            description: 'Разговорный клуб английского языка',
          },
          {
            languageCode: LanguageCode.EN,
            title: 'Talking Club',
            description: 'English conversation club',
          },
          {
            languageCode: LanguageCode.KY,
            title: 'Talking Club',
            description: 'Англис тилинде сүйлөшүү клубу',
          },
        ],
      },
    },
  });
  console.log('✅ Activities created');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log('-----------------------------------');
  console.log(`Admin: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log('');
  console.log('✅ 2 Founders');
  console.log('✅ 1 Teacher');
  console.log('✅ 2 Mentors');
  console.log('✅ 3 Courses');
  console.log('✅ 2 Students');
  console.log('✅ 3 Alumni');
  console.log('✅ 3 Reviews');
  console.log('✅ 4 Social Links');
  console.log('✅ 2 Activities');
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
