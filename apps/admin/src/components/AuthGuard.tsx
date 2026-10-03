'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('[AuthGuard] === ПРОВЕРКА АВТОРИЗАЦИИ ===');
    console.log('[AuthGuard] Pathname:', pathname);
    
    // Пропускаем страницы авторизации
    if (pathname?.startsWith('/auth/')) {
      console.log('[AuthGuard] Страница auth, пропуск проверки');
      return;
    }

    // Проверяем наличие токена
    const token = localStorage.getItem('auth-token');
    console.log('[AuthGuard] Токен существует:', !!token);
    if (token) {
      console.log('[AuthGuard] Длина токена:', token.length);
      console.log('[AuthGuard] Первые 30 символов:', token.substring(0, 30));
    }

    if (!token) {
      console.error('[AuthGuard] ❌ Токен не найден, редирект на signin');
      router.push('/auth/signin');
    } else {
      console.log('[AuthGuard] ✅ Токен найден, доступ разрешён');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
