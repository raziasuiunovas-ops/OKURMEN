import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔐 Creating admin user...');
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@okurmen.kg' },
      update: {},
      create: {
        email: 'admin@okurmen.kg',
        fullName: 'Admin OKURMEN',
        passwordHash: hashSync('Admin123!LocalDev', 10),
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Admin user created:', admin.email);
    console.log('📧 Email: admin@okurmen.kg');
    console.log('🔑 Password: Admin123!LocalDev');
    
    // Create test student
    const student = await prisma.user.upsert({
      where: { email: 'student@test.com' },
      update: {},
      create: {
        email: 'student@test.com',
        fullName: 'Тестовый Студент',
        passwordHash: hashSync('test123', 10),
        role: 'CLIENT',
        isActive: true,
        studentProfile: {
          create: {
            status: 'ACTIVE',
          },
        },
      },
    });

    console.log('✅ Student user created:', student.email);
    console.log('📧 Email: student@test.com');
    console.log('🔑 Password: test123');

    // Create test mentor
    const mentor = await prisma.user.upsert({
      where: { email: 'mentor@okurmen.kg' },
      update: {},
      create: {
        email: 'mentor@okurmen.kg',
        fullName: 'Ментор Тестовый',
        passwordHash: hashSync('Employee123!', 10),
        role: 'EMPLOYEE',
        isActive: true,
        employeeProfile: {
          create: {
            position: 'MENTOR',
            bio: 'Тестовый ментор',
          },
        },
      },
    });

    console.log('✅ Mentor user created:', mentor.email);
    console.log('📧 Email: mentor@okurmen.kg');
    console.log('🔑 Password: Employee123!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
