import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@okurmen/database';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'default-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
  try {
    // Пробуем получить токен из Authorization заголовка или cookie
    const authHeader = request.headers.get('authorization');
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('auth-token')?.value;
    
    let token = cookieToken;
    
    // Если есть Authorization заголовок, используем его
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('Using token from Authorization header');
    } else {
      console.log('Using token from cookie');
    }

    console.log('Token exists:', !!token);

    if (!token) {
      console.log('No token found');
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT
    console.log('Verifying JWT...');
    const { payload } = await jwtVerify(token, JWT_SECRET);

    console.log('JWT payload:', payload);

    // Проверяем userId (может быть в разных полях)
    const userId = (payload.id || payload.userId) as string;

    if (!userId) {
      console.log('No userId in token');
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('User ID from token:', userId);

    // Get fresh user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        preferredLanguage: true,
        isActive: true,
        employeeProfile: {
          select: {
            id: true,
            position: true,
            photoUrl: true,
          },
        },
      },
    });

    console.log('User found:', !!user);

    if (!user || !user.isActive) {
      console.log('User not found or inactive');
      return NextResponse.json(
        { success: false, error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    console.log('Returning user data');
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        position: user.employeeProfile?.position,
        photoUrl: user.employeeProfile?.photoUrl,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
