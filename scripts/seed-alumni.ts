import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const alumniData = [
  {
    name: 'Мамбеткулова Зайнаб',
    position: 'Full Stack Developer',
    company: 'Freelance',
    story: 'Успешно разработала два проекта: систему заказов такси и водительский дашборд',
    projects: [
      {
        title: 'Ekidos Order',
        url: 'https://ekidos-client.vercel.app/order',
      },
      {
        title: 'Ekidos Taxi Driver',
        url: 'https://ekidos-taxi.vercel.app/driver/dashboard',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Илияз',
    position: 'Frontend Developer',
    company: 'Bilimtaymash',
    story: 'Создал образовательную платформу',
    projects: [
      {
        title: 'Bilimtaymash',
        url: 'https://bilimtaymash.vercel.app/',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Кутман',
    position: 'Full Stack Developer',
    company: 'Pizza Shop',
    story: 'Разработал полнофункциональный интернет-магазин пиццы',
    projects: [
      {
        title: 'Pizza Shop',
        url: 'https://pizzashop-updated.vercel.app/',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Азимбек',
    position: 'Frontend Developer',
    company: '3D Market',
    story: 'Создал современный интернет-магазин',
    projects: [
      {
        title: '3D Market',
        url: 'https://3-d-market-black.vercel.app/',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Аслан',
    position: 'Web Developer',
    company: 'Cristall',
    story: 'Разработал корпоративный сайт',
    projects: [
      {
        title: 'Cristall',
        url: 'https://cristall-phi.vercel.app/',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Актан',
    position: 'Frontend Developer',
    company: 'AnimallPedia',
    story: 'Создал образовательный портал о животных',
    projects: [
      {
        title: 'AnimallPedia',
        url: 'https://animall-pedia-ympb.vercel.app/',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Дастан',
    position: 'Full Stack Developer',
    company: 'Pulsar Pro',
    story: 'Разработал коммерческую платформу',
    projects: [
      {
        title: 'Pulsar Pro Plus',
        url: 'https://pulsar-pro-plus.vercel.app/',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Бексултан',
    position: 'Web Developer',
    company: 'OKURMEN',
    story: 'Работал над тестовым проектом ОКУРМЭН',
    projects: [
      {
        title: 'OKURMEN Test',
        url: 'https://test-okurmen.vercel.app/',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Мирбек',
    position: 'Frontend Developer',
    company: 'OKURMEN',
    story: 'Разработал альтернативную версию платформы ОКУРМЭН',
    projects: [
      {
        title: 'OKURMEN Platform',
        url: 'https://okurmen-test.vercel.app/',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Асир',
    position: 'Full Stack Developer',
    company: 'Starbucks Clone',
    story: 'Создал полную копию сайта Starbucks',
    projects: [
      {
        title: 'Starbucks',
        url: 'https://star-bucks1.vercel.app/',
      },
    ],
    isFeatured: true,
  },
  {
    name: 'Ахмет',
    position: 'Frontend Developer',
    company: 'Front Zone',
    story: 'Разработал портфолио-платформу',
    projects: [
      {
        title: 'Front Zone',
        url: 'https://front-zone.vercel.app/',
      },
    ],
    isFeatured: true,
  },
];

async function main() {
  console.log('🌱 Начинаем добавление выпускников...');

  // Удаляем существующих выпускников (опционально)
  await prisma.alumni.deleteMany({});
  console.log('✅ Очистили таблицу alumni');

  // Добавляем новых выпускников
  for (const data of alumniData) {
    const alumni = await prisma.alumni.create({
      data: {
        name: data.name,
        position: data.position,
        company: data.company,
        story: data.story,
        projects: data.projects,
        isFeatured: data.isFeatured,
      },
    });
    console.log(`✅ Добавлен: ${alumni.name}`);
  }

  console.log('🎉 Все выпускники успешно добавлены!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
