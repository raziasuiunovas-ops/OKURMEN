const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findCourses() {
  // Ищем AI Web Developer
  const aiWeb = await prisma.course.findFirst({
    where: { slug: 'ai-web-developer' },
    include: { translations: true }
  });
  
  // Ищем Компьютерная грамотность
  const computerLiteracy = await prisma.course.findFirst({
    where: { slug: 'computer-literacy' },
    include: { translations: true }
  });
  
  console.log('=== AI Web Developer ===');
  console.log('ID:', aiWeb?.id);
  if (aiWeb) {
    aiWeb.translations.forEach(t => {
      console.log(`${t.languageCode}: "${t.title}"`);
      console.log(`  Description: "${t.description}"`);
    });
  }
  
  console.log('\n=== Computer Literacy ===');
  console.log('ID:', computerLiteracy?.id);
  if (computerLiteracy) {
    computerLiteracy.translations.forEach(t => {
      console.log(`${t.languageCode}: "${t.title}"`);
      console.log(`  Description: "${t.description}"`);
    });
  }
  
  await prisma.$disconnect();
}

findCourses().catch(console.error);
