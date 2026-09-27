import { NextRequest, NextResponse } from 'next/server';
import { apiResponse } from '@/lib/api-response';
import { prisma } from '@okurmen/database';
import { send2FACode } from '@/lib/services/telegram-2fa.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('=== REQUEST 2FA START ===');
    console.log('Email:', email);
    console.log('Password length:', password?.length);

    if (!email || !password) {
      console.log('ERROR: Missing email or password');
      return apiResponse.error('Email и пароль обязательны', 400);
    }

    // Проверяем, существует ли пользователь с таким email
    console.log('Looking up user...');
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log('User found:', !!user);
    console.log('User role:', user?.role);
    console.log('Has passwordHash:', !!user?.passwordHash);

    if (!user) {
      console.log('ERROR: User not found');
      return apiResponse.error('Неверный email или пароль', 401);
    }

    // Проверяем пароль
    if (!user.passwordHash) {
      console.log('ERROR: No passwordHash');
      return apiResponse.error('Неверный email или пароль', 401);
    }

    console.log('Checking password...');
    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('ERROR: Invalid password');
      return apiResponse.error('Неверный email или пароль', 401);
    }

    // Проверяем что пользователь активен
    if (!user.isActive) {
      console.log('ERROR: User is not active');
      return apiResponse.error('Аккаунт неактивен', 403);
    }

    // 2FA доступна для всех ролей: ADMIN, EMPLOYEE, CLIENT
    console.log('User role check passed:', user.role);

    // Генерируем и отправляем 2FA код
    console.log('Sending 2FA code...');
    const sent = await send2FACode(email);

    console.log('2FA code sent:', sent);

    if (!sent) {
      console.log('ERROR: Failed to send code');
      return apiResponse.error('Не удалось отправить код подтверждения', 500);
    }

    console.log('=== REQUEST 2FA SUCCESS ===');
    return apiResponse.success({
      message: 'Код подтверждения отправлен в Telegram',
      email,
    });
  } catch (error) {
    console.error('=== REQUEST 2FA ERROR ===');
    console.error('Request 2FA error:', error);
    return apiResponse.error('Внутренняя ошибка сервера', 500);
  }
}
