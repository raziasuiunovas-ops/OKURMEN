'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Target, Users, BarChart3 } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import './sections.css';

export default function AboutSection() {
  const t = useTranslations('about');
  const { ref, isVisible } = useScrollAnimation(0.2);

  const stats = [
    { number: '2022', label: t('founded'), icon: Target },
    { number: '3000+', label: t('students'), icon: Users },
    { number: '15-50', label: t('age_range'), icon: BarChart3 },
  ];

  const founders = [
    { name: 'Санжарбек Мадумаров', role: t('founders') },
    { name: 'Улукбек Бакыбек уулу', role: t('founders') },
  ];

  return (
    <section id="about" className="section section-bg-white">
      <Container>
        <div className="section-header">
          <h2 className="section-title">{t('title')}</h2>
          <div className="section-divider"></div>
        </div>

        <div className="about-stats">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="about-stat-card">
                <Icon className="about-stat-icon" size={48} />
                <div className="about-stat-number">{stat.number}</div>
                <p className="about-stat-label">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="about-founders">
          <h3>{t('founders')}</h3>
          <div className="about-founders-grid">
            {founders.map((founder, index) => (
              <div key={index} className="about-founder-card">
                <div className="about-founder-avatar">
                  {founder.name.charAt(0)}
                </div>
                <div>
                  <p className="about-founder-name">{founder.name}</p>
                  <p className="about-founder-role">{founder.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-timeline">
          <div className="about-timeline-card">
            <div className="about-timeline-badge">Май 2022</div>
            <p className="about-timeline-text">Основание ОКУРМЕН IT</p>
            <div className="about-timeline-dots">
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-dot"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
