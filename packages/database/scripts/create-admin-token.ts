import { PrismaClient, UserRole } from '@prisma/client';
import { SignJWT } from 'jose';

const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'default-secret-key-change-in-production'
);

async function main() {
  console.log('Creating admin token...');
  
  // Ищем админа в базе данных
  const admin = await prisma.user.findFirst({
    where: {
      role: UserRole.ADMIN
    }
  });
  
  if (!admin) {
    console.log('No admin found in database');
    return;
  }
  
  console.log('Found admin:', { id: admin.id, email: admin.email, fullName: admin.fullName });
  
  // Создаём JWT токен
  const token = await new SignJWT({
    id: admin.id,
    userId: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.fullName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .setIssuedAt()
    .sign(JWT_SECRET);
  
  console.log('Admin token created:', token);
  console.log('Token length:', token.length);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });