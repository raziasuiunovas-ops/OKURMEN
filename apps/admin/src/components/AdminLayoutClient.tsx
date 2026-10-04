'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  Star,
  Award,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiUrl } from '@/config/api';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Получаем токен из localStorage
        const token = localStorage.getItem('auth-token');
        
        if (!token) {
          console.log('No token found, redirecting to signin');
          router.push('/auth/signin');
          return;
        }

        console.log('Token found, checking with API...');
        const response = await fetch(getApiUrl('api/auth/me'), {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.log('Auth check failed, clearing token and redirecting');
          localStorage.removeItem('auth-token');
          router.push('/auth/signin');
          return;
        }

        const data = await response.json();
        console.log('Auth check successful, user:', data.user);
        setUser(data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth-token');
        router.push('/auth/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      
      await fetch(getApiUrl('api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });
      
      // Удаляем токен из localStorage
      localStorage.removeItem('auth-token');
      
      router.push('/auth/signin');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      // Всё равно удаляем токен и редиректим
      localStorage.removeItem('auth-token');
      router.push('/auth/signin');
    }
  };

  const navigation = [
    { name: t('nav.dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('nav.courses'), href: '/admin/courses', icon: BookOpen },
    { name: t('nav.lessons'), href: '/admin/lessons', icon: GraduationCap },
    { name: t('nav.students'), href: '/admin/students', icon: GraduationCap },
    { name: t('nav.employees'), href: '/admin/employees', icon: Users },
    { name: 'Статистика', href: '/admin/statistics', icon: TrendingUp },
    { name: t('nav.applications'), href: '/admin/applications', icon: FileText },
    { name: t('nav.reviews'), href: '/admin/reviews', icon: Star },
    { name: t('nav.alumni'), href: '/admin/alumni', icon: Award },
  ];

  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'ky', name: 'Кыргызча' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          ) : (
            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-xl`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-3 border-b border-slate-200/50 dark:border-slate-700/50">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-[44px] h-[44px] p-2.5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all flex items-center justify-center flex-shrink-0">
                <img 
                  src={theme === 'dark' ? '/logo.svg' : '/logo.svg'}
                  alt="ОКУРМЭН" 
                  className="w-5 h-5 brightness-0 invert"
                />
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <h1 className="text-base font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent truncate">
                    ОКУРМЭН
                  </h1>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                    {t('nav.adminPanel')}
                  </p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg font-medium transition-all duration-150 min-h-[44px] w-full ${
                    isActive
                      ? 'px-3 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md'
                      : 'px-3 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  } ${!sidebarOpen && isActive ? '!w-[44px] !h-[44px] !p-0 justify-center' : ''}`}
                >
                  <div className={`flex items-center justify-center flex-shrink-0 ${sidebarOpen ? 'w-5 h-5' : 'w-5 h-5'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {sidebarOpen && (
                    <span className="text-sm truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Settings */}
          <div className="p-2 border-t border-slate-200/50 dark:border-slate-700/50 space-y-1">
            {user && sidebarOpen && (
              <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 mb-2 border border-slate-200/50 dark:border-slate-600/50">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
            
            {/* Settings button */}
            <Link
              href="/admin/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 font-medium transition-all min-h-[44px]"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {sidebarOpen && <span className="text-sm truncate">{t('nav.settings')}</span>}
            </Link>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all min-h-[44px]"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm truncate">{t('nav.logout')}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-3 sm:px-4 py-2.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {navigation.find((item) => item.href === pathname)?.name || t('nav.dashboard')}
              </h2>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label="Change language"
                >
                  <Globe className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </button>
                
                {langMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setLangMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-36 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-xl border border-slate-200/50 dark:border-slate-700/50 py-1.5 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm font-medium transition-all ${
                            language === lang.code
                              ? 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-3 sm:p-4">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
