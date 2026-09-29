import { auth } from './index';
import { UserRole } from '@okurmen/database';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'default-secret-key-change-in-production'
);

export async function getSession() {
  return await auth();
}

// Новая функция для проверки JWT из заголовка или cookie
export async function verifyJWT(request?: NextRequest) {
  try {
    let token: string | undefined;

    // Пробуем получить токен из Authorization заголовка
    if (request) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // Если нет в заголовке, пробуем из cookie
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('auth-token')?.value;
    }

    if (!token) {
      return null;
    }

    // Проверяем JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    const userId = (payload.id || payload.userId) as string;
    const email = payload.email as string;
    const role = payload.role as string;

    if (!userId) {
      return null;
    }

    return {
      user: {
        id: userId,
        email,
        role,
      },
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function requireAuth(request?: NextRequest) {
  // Пробуем новый способ с JWT
  const jwtSession = await verifyJWT(request);
  
  if (jwtSession) {
    return jwtSession;
  }

  // Fallback на старый способ
  const session = await getSession();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

export async function requireAdmin(request?: NextRequest) {
  const session = await requireAuth(request);
  
  // Только пользователи с ролью ADMIN имеют административный доступ
  if (session.user.role !== UserRole.ADMIN) {
    throw new Error('Forbidden: Admin access required');
  }
  
  return session;
}

export async function isAdmin(session: Awaited<ReturnType<typeof getSession>>) {
  return session?.user?.role === UserRole.ADMIN;
}
