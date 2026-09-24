import { auth } from './index';
import { UserRole } from '@okurmen/database';

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  
  if (session.user.role !== UserRole.ADMIN) {
    throw new Error('Forbidden: Admin access required');
  }
  
  return session;
}

export async function isAdmin(session: Awaited<ReturnType<typeof getSession>>) {
  return session?.user?.role === UserRole.ADMIN;
}
