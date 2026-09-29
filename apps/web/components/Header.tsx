'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSession, signOut } from 'next-auth/react';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { data: session } = useSession();
  const t = useTranslations('nav');
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('#')}
              className="text-lg font-bold text-dark-900 hover:text-primary-600 transition-colors duration-200"
              aria-label="OKURMEN"
            >
              ОКУРМЕН
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium text-dark-600 hover:text-dark-900 transition-colors duration-200"
                >
                  {t(item.key as any)}
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-1 text-sm font-medium text-dark-600">
                {languages.map((lang, index) => (
                  <span key={lang.code} className="flex items-center">
                    <button
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`transition-colors duration-200 ${
                        locale === lang.code
                          ? 'text-dark-900'
                          : 'text-dark-400 hover:text-dark-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                    {index < languages.length - 1 && (
                      <span className="mx-2 text-dark-300">/</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Auth Buttons or User Menu */}
              {session?.user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-600">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-dark-700">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-dark-600 hover:text-dark-900 transition-colors"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-5 py-2.5 text-sm font-medium text-dark-700 hover:text-dark-900 transition-colors"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-6 py-2.5 bg-dark-900 text-white text-sm font-medium rounded-lg hover:bg-dark-800 transition-all duration-200"
                  >
                    Регистрация
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-dark-700"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
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
            <div className="lg:hidden border-t border-gray-100 py-4">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left px-3 py-2 text-sm font-medium text-dark-700 hover:text-dark-900"
                  >
                    {t(item.key as any)}
                  </button>
                ))}
              </nav>
              
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {/* Language Switcher Mobile */}
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-1.5 text-sm font-medium rounded ${
                        locale === lang.code ? 'bg-dark-900 text-white' : 'bg-gray-100 text-dark-600'
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
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600">
                          {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-dark-700">
                        {session.user.name || session.user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full px-4 py-2 text-sm font-medium text-dark-600 bg-gray-100 rounded-lg"
                    >
                      Выйти
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-dark-700 bg-gray-100 rounded-lg"
                    >
                      Войти
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-dark-900 text-white text-sm font-medium rounded-lg"
                    >
                      Регистрация
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
