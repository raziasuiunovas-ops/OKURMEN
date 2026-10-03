import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.update({
    where: { slug: 'english-course' },
    data: { isActive: true }
  });
  
  console.log('✅ English course activated!');
  console.log('Active:', course.isActive);
}

main()
  .then(() => console.log('Done'))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
