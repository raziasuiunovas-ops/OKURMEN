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
  BarChart3,
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
    { name: 'Статистика', href: '/admin/site-stats', icon: BarChart3 },
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
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:scale-105 transition-all"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          ) : (
            <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-xl`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <Link
              href="/admin"
              className="flex items-center space-x-3 group"
            >
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <img 
                  src={theme === 'dark' ? '/logo.svg' : '/logo.svg'}
                  alt="ОКУРМЭН" 
                  className="w-6 h-6 flex-shrink-0 brightness-0 invert"
                />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    ОКУРМЭН
                  </h1>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Admin Panel
                  </p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:scale-[1.01]'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span>{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Settings */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-2">
            {user && sidebarOpen && (
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-700/50 dark:to-slate-800/50 mb-2 border border-slate-200/50 dark:border-slate-600/50">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.email}
                </p>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all hover:scale-[1.01]"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{t('nav.logout')}</span>}
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
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all hover:scale-105"
              >
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {navigation.find((item) => item.href === pathname)?.name || t('nav.dashboard')}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all hover:scale-105"
                >
                  <Globe className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </button>
                
                {langMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setLangMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 py-2 z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all ${
                            language === lang.code
                              ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
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
                className="p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all hover:scale-105"
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
        <main className="p-6">
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
