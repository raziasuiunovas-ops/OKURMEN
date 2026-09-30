const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { slug: 'ai-web-developer' },
        { slug: 'computer-literacy' }
      ]
    },
    include: { translations: true }
  });
  
  courses.forEach(course => {
    console.log('Course:', course.slug);
    console.log('ID:', course.id);
    course.translations.forEach(t => {
      console.log('  ' + t.languageCode + ':', t.title);
    });
    console.log('');
  });
  
  await prisma.$disconnect();
}

run();
