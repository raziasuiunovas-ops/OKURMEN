import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@okurmen/database';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { SignJWT } from 'jose';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'default-secret-key-change-in-production'
);

async function createSessionToken(user: { id: string; email: string; role: string; name: string }) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = loginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат данных' },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Check password
    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Аккаунт неактивен' },
        { status: 403 }
      );
    }

    // Check if user has student profile
    if (!user.studentProfile) {
      return NextResponse.json(
        { success: false, error: 'Студенческий профиль не найден' },
        { status: 403 }
      );
    }

    // Create JWT token
    const token = await createSessionToken({
      id: user.id,
      email: user.email!,
      role: user.role,
      name: user.fullName,
    });

    // Return success with token
    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Student sign in error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при входе' },
      { status: 500 }
    );
  }
}
