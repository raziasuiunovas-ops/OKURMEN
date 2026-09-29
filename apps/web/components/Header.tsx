'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSession, signOut } from 'next-auth/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('nav');
  const authT = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { key: 'courses', href: '#courses' },
    { key: 'about', href: '#about' },
    { key: 'team', href: '#team' },
    { key: 'contacts', href: '#contacts' },
  ];

  const languages = [
    { code: 'ky', label: 'KY' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  const scrollToSection = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0 });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView();
      }
    }
    setIsMobileMenuOpen(false);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 shadow-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Image */}
            <button
              onClick={() => scrollToSection('#')}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200"
              aria-label="OKURMEN"
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt="OKURMEN Logo"
<<<<<<< ours
                  width={40}
                  height={40}
                  className="object-contain rounded-lg"
=======
                  fill
                  className="object-contain dark:hidden"
                  priority
                />
                <Image
                  src="/logo-dark.svg"
                  alt="OKURMEN Logo"
                  fill
                  className="object-contain hidden dark:block"
>>>>>>> theirs
                  priority
                />
              </div>
              <span className="text-xl font-display font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                ОКУРМЭН
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                >
                  {t(item.key as any)}
                </button>
              ))}
              <button
<<<<<<< ours
                onClick={() => scrollToSection('#contacts')}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors duration-200"
=======
                onClick={() => scrollToSection('#application')}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
>>>>>>> theirs
              >
                {t('application')}
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={theme === 'light' ? 'Караңгы тема' : 'Жарык тема'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

<<<<<<< ours
              {/* Language Switcher - Buttons */}
              <div className="flex items-center gap-2">
=======
              {/* Language Switcher as Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
>>>>>>> theirs
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
<<<<<<< ours
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      locale === lang.code
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
=======
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-all duration-200 ${
                      locale === lang.code
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
>>>>>>> theirs
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Auth Buttons or User Menu */}
              {session?.user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {authT('logout')}
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
                  >
                    {authT('login')}
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {authT('register')}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-4">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  >
                    {t(item.key as any)}
                  </button>
                ))}
                <button
                  onClick={() => {
                    scrollToSection('#application');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                >
                  {t('application')}
                </button>
              </nav>
              
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                {/* Language Switcher Mobile */}
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                        locale === lang.code 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>

                {/* Auth Buttons Mobile */}
                {session?.user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {session.user.name || session.user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {authT('logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {authT('login')}
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg shadow-md"
                    >
                      {authT('register')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
