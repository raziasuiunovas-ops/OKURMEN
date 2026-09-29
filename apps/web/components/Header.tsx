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
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-500 to-accent-500 shadow-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Icon */}
            <button
              onClick={() => scrollToSection('#')}
              className="flex items-center gap-2 text-lg font-bold text-white hover:text-white/90 transition-colors duration-200"
              aria-label="OKURMEN"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <span>ОКУРМЭН</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors duration-200"
                >
                  {t(item.key as any)}
                </button>
              ))}
              <button
                onClick={() => openAuthModal('register')}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors duration-200"
              >
                Заявка
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Language Switcher */}
              <div className="flex items-center gap-1 text-sm font-medium text-white/80">
                {languages.map((lang, index) => (
                  <span key={lang.code} className="flex items-center">
                    <button
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`transition-colors duration-200 ${
                        locale === lang.code
                          ? 'text-white font-semibold'
                          : 'text-white/60 hover:text-white/90'
                      }`}
                    >
                      {lang.label}
                    </button>
                    {index < languages.length - 1 && (
                      <span className="mx-2 text-white/40">/</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Auth Buttons or User Menu */}
              {session?.user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-5 py-2 bg-white text-primary-600 text-sm font-semibold rounded-lg hover:bg-white/95 transition-all duration-200 shadow-md"
                  >
                    Регистрация
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white"
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
            <div className="lg:hidden border-t border-white/20 py-4">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded"
                  >
                    {t(item.key as any)}
                  </button>
                ))}
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded"
                >
                  Заявка
                </button>
              </nav>
              
              <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
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
                        locale === lang.code ? 'bg-white text-primary-600' : 'bg-white/20 text-white'
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
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {session.user.name || session.user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg"
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
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg"
                    >
                      Войти
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-white text-primary-600 text-sm font-semibold rounded-lg"
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
