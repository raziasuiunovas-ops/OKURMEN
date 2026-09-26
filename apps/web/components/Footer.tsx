'use client';

import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import './sections/sections.css';

export default function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  const navSections = [
    {
      title: 'Навигация',
      links: [
        { label: navT('about'), href: '#about' },
        { label: navT('courses'), href: '#courses' },
        { label: navT('learning'), href: '#learning' },
        { label: navT('team'), href: '#team' },
      ],
    },
    {
      title: 'Информация',
      links: [
        { label: navT('students'), href: '#students' },
        { label: navT('reviews'), href: '#reviews' },
        { label: navT('contacts'), href: '#contacts' },
      ],
    },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img 
              src={theme === 'dark' ? '/logo-dark.svg' : '/logo.svg'} 
              alt="ОКУРМЕН IT" 
              className="footer-logo" 
            />
            <p>{t('about')}</p>
            <div className="footer-address">
              <MapPin size={20} />
              <span>ОРОЗБЕКОВА, 136, Бишкек</span>
            </div>
          </div>

          {navSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h4>{section.title}</h4>
              <div className="footer-links">
                {section.links.map((link, linkIndex) => (
                  <button
                    key={linkIndex}
                    onClick={() => scrollToSection(link.href)}
                    className="footer-link"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} ОКУРМЕН IT. {t('rights')}
          </div>
          <div className="footer-legal">
            <a href="#">Политика конфиденциальности</a>
            <span>|</span>
            <a href="#">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
