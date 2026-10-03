import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function main() {
  console.log('🔐 Создание/обновление admin пользователя...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@okurmen.kg';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!LocalDev';

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Проверяем существует ли уже этот email
  const existingUser = await prisma.users.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    // Обновляем пароль если admin уже существует
    await prisma.users.update({
      where: { email: adminEmail },
      data: {
        password_hash: hashedPassword,
        role: 'ADMIN',
        is_active: true,
      },
    });
    console.log('✅ Admin пользователь обновлен:', adminEmail);
  } else {
    // Создаем нового admin
    await prisma.users.create({
      data: {
        email: adminEmail,
        password_hash: hashedPassword,
        full_name: 'Admin OKURMEN',
        role: 'ADMIN',
        preferred_language: 'RU',
        is_active: true,
      },
    });
    console.log('✅ Admin пользователь создан:', adminEmail);
  }

  console.log('\n🎉 Успешно!');
  console.log('\n📝 Данные для входа:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('URL:    http://localhost:3000/auth/signin');
  console.log('Email: ', adminEmail);
  console.log('Пароль:', adminPassword);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
