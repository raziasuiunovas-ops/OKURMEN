import { PrismaClient, CourseFormat } from '@prisma/client';

const prisma = new PrismaClient();

// Предустановленные градиенты
const GRADIENTS = [
  { from: '#FF6B6B', to: '#FFE66D' }, // Sunset
  { from: '#667eea', to: '#764ba2' }, // Ocean
  { from: '#56ab2f', to: '#a8e063' }, // Forest
  { from: '#f12711', to: '#f5af19' }, // Fire
  { from: '#2196F3', to: '#21CBF3' }, // Sky
  { from: '#eb3349', to: '#f45c43' }, // Rose
  { from: '#8e2de2', to: '#4a00e0' }, // Purple
  { from: '#00d2ff', to: '#3a7bd5' }, // Teal
];

const courses = [
  {
    slug: 'computer-literacy',
    price: 10000,
    duration: '3 месяца',
    format: CourseFormat.HYBRID,
    coverGradient: JSON.stringify(GRADIENTS[0]), // Sunset
    icon: 'Wrench',
    isActive: true,
    translations: [
      {
        languageCode: 'RU' as const,
        title: 'Компьютерная грамотность',
        description: 'Базовые навыки работы с компьютером для начинающих. Изучите основы Windows, Office, интернета и безопасности.',
        level: 'BEGINNER' as const,
      },
      {
        languageCode: 'KY' as const,
        title: 'Компьютердик сабаттулук',
        description: 'Башталгыч деңгээлдеги компьютер менен иштөө көндүмдөрү. Windows, Office, интернет жана коопсуздуктун негиздерин үйрөнүңүз.',
        level: 'BEGINNER' as const,
      },
      {
        languageCode: 'EN' as const,
        title: 'Computer Literacy',
        description: 'Basic computer skills for beginners. Learn Windows, Office, internet basics and security.',
        level: 'BEGINNER' as const,
      },
    ],
  },
  {
    slug: 'ai-web-developer',
    price: 45000,
    duration: '6 месяцев',
    format: CourseFormat.HYBRID,
    coverGradient: JSON.stringify(GRADIENTS[1]), // Ocean
    icon: 'Brain',
    isActive: true,
    translations: [
      {
        languageCode: 'RU' as const,
        title: 'AI Web Developer',
        description: 'Современная веб-разработка с использованием искусственного интеллекта. Изучите HTML, CSS, JavaScript, React и AI-инструменты.',
        level: 'INTERMEDIATE' as const,
      },
      {
        languageCode: 'KY' as const,
        title: 'AI Web Developer',
        description: 'Жасалма интеллект менен заманбап веб-иштеп чыгуу. HTML, CSS, JavaScript, React жана AI куралдарын үйрөнүңүз.',
        level: 'INTERMEDIATE' as const,
      },
      {
        languageCode: 'EN' as const,
        title: 'AI Web Developer',
        description: 'Modern web development with artificial intelligence. Learn HTML, CSS, JavaScript, React and AI tools.',
        level: 'INTERMEDIATE' as const,
      },
    ],
  },
  {
    slug: 'english-course',
    price: 3000,
    duration: '4 месяца',
    format: CourseFormat.OFFLINE,
    coverGradient: JSON.stringify(GRADIENTS[4]), // Sky
    icon: 'GraduationCap',
    isActive: true,
    translations: [
      {
        languageCode: 'RU' as const,
        title: 'English',
        description: 'Английский язык для IT-специалистов. Технический английский, общение, чтение документации.',
        level: 'BEGINNER' as const,
      },
      {
        languageCode: 'KY' as const,
        title: 'English',
        description: 'IT адистер үчүн англис тили. Техникалык англис тили, баарлашуу, документтерди окуу.',
        level: 'BEGINNER' as const,
      },
      {
        languageCode: 'EN' as const,
        title: 'English',
        description: 'English for IT professionals. Technical English, communication, reading documentation.',
        level: 'BEGINNER' as const,
      },
    ],
  },
  {
    slug: 'aem-audio-video',
    price: 33000,
    duration: '4 месяца',
    format: CourseFormat.HYBRID,
    coverGradient: JSON.stringify(GRADIENTS[2]), // Forest
    icon: 'Film',
    isActive: true,
    translations: [
      {
        languageCode: 'RU' as const,
        title: 'АЭМ - Аудио и Видео Монтаж',
        description: 'Профессиональный монтаж видео и аудио. Adobe Premiere Pro, After Effects, звуковой дизайн.',
        level: 'INTERMEDIATE' as const,
      },
      {
        languageCode: 'KY' as const,
        title: 'АЭМ - Аудио жана Видео Монтаж',
        description: 'Кесиптик видео жана аудио монтаж. Adobe Premiere Pro, After Effects, үн дизайны.',
        level: 'INTERMEDIATE' as const,
      },
      {
        languageCode: 'EN' as const,
        title: 'AVM - Audio and Video Editing',
        description: 'Professional video and audio editing. Adobe Premiere Pro, After Effects, sound design.',
        level: 'INTERMEDIATE' as const,
      },
    ],
  },
  {
    slug: 'ai-video-creation',
    price: 5000,
    duration: '2 месяца',
    format: CourseFormat.ONLINE,
    coverGradient: JSON.stringify(GRADIENTS[6]), // Purple
    icon: 'Sparkles',
    isActive: true,
    translations: [
      {
        languageCode: 'RU' as const,
        title: 'AI менен видео жасоо',
        description: 'Создание видео с помощью искусственного интеллекта. Midjourney, Runway ML, ChatGPT для видеопроизводства.',
        level: 'BEGINNER' as const,
      },
      {
        languageCode: 'KY' as const,
        title: 'AI менен видео жасоо',
        description: 'Жасалма интеллект аркылуу видео түзүү. Midjourney, Runway ML, ChatGPT видео өндүрүш үчүн.',
        level: 'BEGINNER' as const,
      },
      {
        languageCode: 'EN' as const,
        title: 'Video Creation with AI',
        description: 'Create videos using artificial intelligence. Midjourney, Runway ML, ChatGPT for video production.',
        level: 'BEGINNER' as const,
      },
    ],
  },
  {
    slug: 'frontend-development',
    price: 45000,
    duration: '6 месяцев',
    format: CourseFormat.HYBRID,
    coverGradient: JSON.stringify(GRADIENTS[3]), // Fire
    icon: 'Code',
    isActive: true,
    translations: [
      {
        languageCode: 'RU' as const,
        title: 'Frontend Development',
        description: 'Полный курс frontend разработки. HTML, CSS, JavaScript, React, Next.js, TypeScript. От основ до продвинутого уровня.',
        level: 'INTERMEDIATE' as const,
      },
      {
        languageCode: 'KY' as const,
        title: 'Frontend иштеп чыгуу',
        description: 'Толук frontend иштеп чыгуу курсу. HTML, CSS, JavaScript, React, Next.js, TypeScript. Негизден өнүгүү деңгээлге чейин.',
        level: 'INTERMEDIATE' as const,
      },
      {
        languageCode: 'EN' as const,
        title: 'Frontend Development',
        description: 'Complete frontend development course. HTML, CSS, JavaScript, React, Next.js, TypeScript. From basics to advanced.',
        level: 'INTERMEDIATE' as const,
      },
    ],
  },
  {
    slug: 'backend-python',
    price: 45000,
    duration: '6 месяцев',
    format: CourseFormat.HYBRID,
    coverGradient: JSON.stringify(GRADIENTS[7]), // Teal
    icon: 'Code',
    isActive: true,
    translations: [
      {
        languageCode: 'RU' as const,
        title: 'Backend Development (Python)',
        description: 'Серверная разработка на Python. Django, FastAPI, базы данных, API, деплой и масштабирование.',
        level: 'ADVANCED' as const,
      },
      {
        languageCode: 'KY' as const,
        title: 'Backend иштеп чыгуу (Python)',
        description: 'Python тилинде сервердик иштеп чыгуу. Django, FastAPI, маалымат базалары, API, жайгаштыруу жана масштабдоо.',
        level: 'ADVANCED' as const,
      },
      {
        languageCode: 'EN' as const,
        title: 'Backend Development (Python)',
        description: 'Server-side development with Python. Django, FastAPI, databases, APIs, deployment and scaling.',
        level: 'ADVANCED' as const,
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting courses seed...');

  // Применяем миграцию, если нужно (для новых полей)
  console.log('📦 Checking database schema...');

  for (const courseData of courses) {
    try {
      // Проверяем, существует ли курс
      const existing = await prisma.course.findUnique({
        where: { slug: courseData.slug },
      });

      if (existing) {
        console.log(`⏭️  Курс "${courseData.translations[0].title}" уже существует, пропускаем...`);
        continue;
      }

      // Создаём курс с реальными значениями (без фиктивных данных)
      const course = await prisma.course.create({
        data: {
          slug: courseData.slug,
          price: courseData.price,
          duration: courseData.duration,
          format: courseData.format,
          coverGradient: courseData.coverGradient,
          icon: courseData.icon,
          rating: 0, // Будет рассчитываться из реальных отзывов
          totalReviews: 0, // Будет рассчитываться из courseReviews
          enrolledStudents: 0, // Будет рассчитываться из enrollments
          isActive: courseData.isActive,
          translations: {
            create: courseData.translations,
          },
        },
        include: {
          translations: true,
        },
      });

      console.log(`✅ Создан курс: ${course.translations[0].title}`);
    } catch (error) {
      console.error(`❌ Ошибка при создании курса "${courseData.translations[0].title}":`, error);
    }
  }

  console.log('✨ Courses seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
