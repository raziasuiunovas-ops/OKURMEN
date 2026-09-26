'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('AuthGuard: Checking auth for pathname:', pathname);
    
    // Пропускаем страницы авторизации
    if (pathname?.startsWith('/auth/')) {
      console.log('AuthGuard: Auth page, skipping check');
      return;
    }

    // Проверяем наличие токена
    const token = localStorage.getItem('auth-token');
    console.log('AuthGuard: Token exists:', !!token);

    if (!token) {
      console.log('AuthGuard: No token found, redirecting to signin');
      router.push('/auth/signin');
    } else {
      console.log('AuthGuard: Token found, allowing access');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
