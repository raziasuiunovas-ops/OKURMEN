import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@okurmen.kg';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!LocalDev';
  
  console.log('🔄 Updating admin password hash...');
  
  const passwordHash = hashSync(adminPassword, 10);
  
  const admin = await prisma.user.update({
    where: { email: adminEmail },
    data: {
      passwordHash,
    },
  });
  
  console.log(`✅ Admin password updated: ${admin.email}`);
  console.log(`   New hash starts with: ${passwordHash.substring(0, 20)}...`);
}

updateAdmin()
  .catch((e) => {
    console.error('❌ Error updating admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
