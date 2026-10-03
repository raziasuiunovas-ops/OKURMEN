import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Activating admin account...');

  const result = await prisma.users.update({
    where: { email: 'admin@okurmen.kg' },
    data: { is_active: true },
    select: {
      id: true,
      email: true,
      full_name: true,
      role: true,
      is_active: true,
    },
  });

  console.log('✅ Admin account activated:');
  console.log('   Email:', result.email);
  console.log('   Name:', result.full_name);
  console.log('   Role:', result.role);
  console.log('   Active:', result.is_active);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
