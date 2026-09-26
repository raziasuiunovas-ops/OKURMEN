import { NextRequest, NextResponse } from 'next/server';
import { apiResponse } from '@/lib/api-response';
import { prisma } from '@okurmen/database';
import { verify2FACode } from '@/lib/services/telegram-2fa.service';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    console.log('=== VERIFY 2FA REQUEST START ===');
    console.log('Email:', email);
    console.log('Code received:', code);

    if (!email || !code) {
      console.log('ERROR: Missing email or code');
      return apiResponse.error('Email и код обязательны', 400);
    }

    // Проверяем код
    console.log('Calling verify2FACode...');
    const isValid = await verify2FACode(email, code);

    console.log('Code valid:', isValid);

    if (!isValid) {
      console.log('ERROR: Invalid or expired code');
      return apiResponse.error('Неверный или истекший код', 401);
    }

    // Получаем пользователя
    console.log('Getting user...');
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    console.log('User found:', !!user);

    if (!user) {
      console.log('ERROR: User not found');
      return apiResponse.error('Пользователь не найден', 404);
    }

    // Создаём JWT токен
    console.log('Creating JWT token...');
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(JWT_SECRET);

    console.log('Token created');

    // Создаём response с токеном
    const response = apiResponse.success({
      token, // Возвращаем токен в ответе
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
      },
    });

    // Также устанавливаем httpOnly cookie для безопасности (если порты совпадают)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    });

    console.log('Token and cookie set');
    console.log('=== VERIFY 2FA REQUEST SUCCESS ===');

    return response;
  } catch (error) {
    console.error('=== VERIFY 2FA REQUEST ERROR ===');
    console.error('Verify 2FA error:', error);
    return apiResponse.error('Внутренняя ошибка сервера', 500);
  }
}
