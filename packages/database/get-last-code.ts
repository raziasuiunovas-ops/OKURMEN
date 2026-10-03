import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getLastCode() {
  try {
    const result = await prisma.two_factor_codes.findFirst({
      where: { email: 'admin@okurmen.kg' },
      orderBy: { created_at: 'desc' },
      select: { code: true },
    });
    
    if (result) {
      console.log(result.code);
    } else {
      console.log('NO_CODE');
    }
  } catch (error) {
    console.error('ERROR');
  } finally {
    await prisma.$disconnect();
  }
}

getLastCode();
