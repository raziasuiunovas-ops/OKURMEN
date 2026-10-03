'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { data: session } = useSession();
  const t = useTranslations('nav');
  const authT = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { key: 'courses', href: '#courses' },
    { key: 'about', href: '#about' },
    { key: 'team', href: '#team' },
    { key: 'alumni', href: '#alumni' },
    { key: 'reviews', href: '#reviews' },
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4 lg:gap-6">
            {/* Logo with Image */}
            <button
              onClick={() => scrollToSection('#')}
              className="flex items-center gap-1.5 sm:gap-2.5 hover:opacity-90 transition-opacity duration-200 flex-shrink-0"
              aria-label="OKURMEN"
            >
              <div className="relative w-7 h-7 sm:w-9 sm:h-9">
                <Image
                  src="/logo.svg"
                  alt="OKURMEN Logo"
                  width={36}
                  height={36}
                  className="object-contain dark:hidden"
                  priority
                />
                <Image
                  src="/logo-dark.svg"
                  alt="OKURMEN Logo"
                  width={36}
                  height={36}
                  className="object-contain hidden dark:block"
                  priority
                />
              </div>
              <span className="text-base sm:text-lg font-display font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                {t('brand_name')}
              </span>
            </button>


            {/* Desktop Navigation - Compact */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="group relative text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 whitespace-nowrap"
                >
                  {t(item.key as any)}
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                </button>
              ))}
              <button
                onClick={() => scrollToSection('#application')}
                className="group relative text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 whitespace-nowrap"
              >
                {t('application')}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Compact Language Switcher */}
              <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2 py-1 text-xs font-semibold rounded transition-all duration-200 ${
                      locale === lang.code
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Auth Buttons or User Menu */}
              {session?.user ? (
                <div className="relative group">
                  {/* Profile Icon - responsive size */}
                  <button className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-orange-500 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:border-orange-600 transition-colors">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {session.user.name || session.user.email}
                        </p>
                        {session.user.email && session.user.name && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                      
                      {/* Settings Button */}
                      <button
                        onClick={() => router.push('/settings')}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {authT('settings')}
                      </button>

                      {/* Logout Button */}
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center gap-2 border-t border-slate-200 dark:border-slate-700 mt-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {authT('logout')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
                  >
                    {authT('login')}
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {authT('register')}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-700 dark:text-slate-300 flex-shrink-0"
              aria-label="Menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
            <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-3 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
              <nav className="flex flex-col space-y-0.5">
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
              
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                {/* Theme Toggle Mobile */}
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>

                {/* Language Switcher Mobile */}
                <div className="flex gap-2 px-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex-1 px-2 py-2 text-sm font-semibold rounded-lg transition-all ${
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
                  <div className="space-y-2 px-2">
                    <div className="flex items-center justify-center">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-orange-500 flex items-center justify-center text-slate-700 dark:text-slate-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center px-2 py-1.5">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {session.user.name || session.user.email}
                      </p>
                      {session.user.email && session.user.name && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {session.user.email}
                        </p>
                      )}
                    </div>

                    {/* Settings Button */}
                    <button
                      onClick={() => {
                        router.push('/settings');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {authT('settings')}
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={() => signOut()}
                      className="w-full px-3 py-2.5 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {authT('logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 px-2">
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {authT('login')}
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg shadow-md"
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
