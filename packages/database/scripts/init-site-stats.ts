import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing site stats...');
  
  // Удаляем старые записи
  await prisma.siteStats.deleteMany();
  
  // Создаём начальную запись
  const stats = await prisma.siteStats.create({
    data: {
      totalStudents: 6000,
      employmentRate: 90,
    },
  });
  
  console.log('Site stats initialized:', stats);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
