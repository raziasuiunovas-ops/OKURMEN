'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import './sections/sections.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'about', href: '#about' },
    { key: 'courses', href: '#courses' },
    { key: 'learning', href: '#learning' },
    { key: 'team', href: '#team' },
    { key: 'students', href: '#students' },
    { key: 'reviews', href: '#reviews' },
    { key: 'contacts', href: '#contacts' },
  ];

  const languages = [
    { code: 'ky', label: 'Кырг' },
    { code: 'ru', label: 'Рус' },
    { code: 'en', label: 'Eng' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-content container">
        <a href="#" className="header-logo">
          <img 
            src={theme === 'dark' ? '/logo-dark.svg' : '/logo.svg'} 
            alt="ОКУРМЕН IT" 
            className="header-logo-img" 
          />
        </a>

        <nav className="header-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => scrollToSection(item.href)}
              className="header-nav-link"
            >
              {t(item.key as any)}
            </button>
          ))}
        </nav>

        <div className="header-lang">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`header-lang-btn ${locale === lang.code ? 'active' : ''}`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          className="header-theme-btn"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="header-menu-btn"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="header-mobile-menu container">
          <nav className="header-mobile-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.href)}
                className="header-mobile-nav-link"
              >
                {t(item.key as any)}
              </button>
            ))}
          </nav>
          <div className="header-mobile-lang">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  handleLanguageChange(lang.code);
                  setIsMobileMenuOpen(false);
                }}
                className={`header-mobile-lang-btn ${locale === lang.code ? 'active' : ''}`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
