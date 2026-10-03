import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.findUnique({
    where: { slug: 'english-course' },
    include: { translations: true }
  });
  
  console.log('English course:');
  console.log(JSON.stringify(course, null, 2));
}

main().finally(() => prisma.$disconnect());
