'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Monitor, Users, GraduationCap, Rocket } from 'lucide-react';
import './sections.css';

export default function HeroSection() {
  const t = useTranslations('hero');

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero animated-gradient-bg">
      {/* Плавающие частицы */}
      <div className="floating-particle" style={{ left: '10%', top: '20%' }}></div>
      <div className="floating-particle" style={{ left: '80%', top: '40%' }}></div>
      <div className="floating-particle" style={{ left: '15%', top: '70%' }}></div>
      <div className="floating-particle" style={{ left: '85%', top: '15%' }}></div>
      <div className="floating-particle" style={{ left: '50%', top: '80%' }}></div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-title-stack">
            <div className="badge-enhanced pulse-glow" style={{ marginBottom: '2rem' }}>
              <Rocket size={20} />
              <span>Современное IT-образование в Бишкеке</span>
            </div>

            <h1 className="hero-title animated-title staggered-title">
              <span className="title-line title-line-1">{t('title').split(' ').slice(0, 2).join(' ')}</span>
              <span className="title-line title-line-2">{t('title').split(' ').slice(2).join(' ')}</span>
            </h1>
          </div>

          <p className="hero-subtitle text-shadow-soft">
            {t('subtitle')}
          </p>

          <p className="hero-description">
            {t('description')}
          </p>

          <div className="hero-buttons">
            <Button
              size="lg"
              variant="primary"
              onClick={() => scrollToSection('#courses')}
              className="btn-enhanced"
            >
              {t('cta_primary')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('#about')}
            >
              {t('cta_secondary')}
            </Button>
          </div>

          <div className="hero-features">
            {[
              { icon: Monitor, label: 'IT Education', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Users, label: 'Personal Mentor', gradient: 'from-purple-500 to-pink-500' },
              { icon: GraduationCap, label: '3000+ Students', gradient: 'from-orange-500 to-red-500' },
              { icon: Rocket, label: 'Real Results', gradient: 'from-green-500 to-emerald-500' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="hero-feature glass">
                  <div className="icon-gradient">
                    <Icon className="hero-feature-icon" size={32} />
                  </div>
                  <span className="hero-feature-label">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
