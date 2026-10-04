import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking site stats...');
  
  const stats = await prisma.siteStats.findMany({
    orderBy: { updatedAt: 'desc' }
  });
  
  console.log('Found site stats:', stats);
  console.log('Count:', stats.length);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });