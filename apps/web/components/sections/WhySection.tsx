'use client';

import { useTranslations } from 'next-intl';
import { RefreshCw, Users, Smartphone, Target, DollarSign, BookOpen, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CardTheme {
  gradient: string;
  glassGradient: string;
  circleColor: string;
  titleColor: string;
  textColor: string;
  shadowColor: string;
  shadowColorAlt: string;
}

const cardThemes: CardTheme[] = [
  {
    // Blue–Cyan
    gradient: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)',
    glassGradient: 'linear-gradient(0deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.82) 100%)',
    circleColor: 'rgba(6, 182, 212, 0.22)',
    titleColor: '#0c4a85',
    textColor: 'rgba(12, 74, 133, 0.82)',
    shadowColor: 'rgba(17, 71, 96, 0)',
    shadowColorAlt: 'rgba(17, 71, 96, 0.22)',
  },
  {
    // Purple–Pink
    gradient: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(236, 72, 153) 100%)',
    glassGradient: 'linear-gradient(0deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.82) 100%)',
    circleColor: 'rgba(236, 72, 153, 0.22)',
    titleColor: '#6d28d9',
    textColor: 'rgba(109, 40, 217, 0.82)',
    shadowColor: 'rgba(71, 17, 96, 0)',
    shadowColorAlt: 'rgba(71, 17, 96, 0.22)',
  },
  {
    // Green–Emerald
    gradient: 'linear-gradient(135deg, rgb(0, 210, 180) 0%, rgb(8, 200, 80) 100%)',
    glassGradient: 'linear-gradient(0deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.82) 100%)',
    circleColor: 'rgba(0, 200, 170, 0.22)',
    titleColor: '#065f46',
    textColor: 'rgba(6, 95, 70, 0.82)',
    shadowColor: 'rgba(5, 71, 17, 0)',
    shadowColorAlt: 'rgba(5, 71, 17, 0.22)',
  },
  {
    // Orange–Red
    gradient: 'linear-gradient(135deg, rgb(249, 115, 22) 0%, rgb(220, 38, 38) 100%)',
    glassGradient: 'linear-gradient(0deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.82) 100%)',
    circleColor: 'rgba(249, 115, 22, 0.22)',
    titleColor: '#9a3412',
    textColor: 'rgba(154, 52, 18, 0.82)',
    shadowColor: 'rgba(96, 30, 17, 0)',
    shadowColorAlt: 'rgba(96, 30, 17, 0.22)',
  },
  {
    // Yellow–Amber
    gradient: 'linear-gradient(135deg, rgb(234, 179, 8) 0%, rgb(245, 130, 11) 100%)',
    glassGradient: 'linear-gradient(0deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.82) 100%)',
    circleColor: 'rgba(234, 179, 8, 0.22)',
    titleColor: '#78350f',
    textColor: 'rgba(120, 53, 15, 0.82)',
    shadowColor: 'rgba(96, 71, 17, 0)',
    shadowColorAlt: 'rgba(96, 71, 17, 0.22)',
  },
  {
    // Indigo–Purple
    gradient: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(139, 92, 246) 100%)',
    glassGradient: 'linear-gradient(0deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.82) 100%)',
    circleColor: 'rgba(99, 102, 241, 0.22)',
    titleColor: '#312e81',
    textColor: 'rgba(49, 46, 129, 0.82)',
    shadowColor: 'rgba(30, 17, 96, 0)',
    shadowColorAlt: 'rgba(30, 17, 96, 0.22)',
  },
];

export default function WhySection() {
  const t = useTranslations('why');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const features: { icon: LucideIcon; title: string; description: string }[] = [
    { icon: RefreshCw,   title: t('hybrid.title'),      description: t('hybrid.description') },
    { icon: Users,       title: t('mentor.title'),      description: t('mentor.description') },
    { icon: Smartphone,  title: t('access.title'),      description: t('access.description') },
    { icon: Target,      title: t('methodology.title'), description: t('methodology.description') },
    { icon: DollarSign,  title: t('grant.title'),       description: t('grant.description') },
    { icon: BookOpen,    title: t('activities.title'),  description: t('activities.description') },
  ];

  // IntersectionObserver — появление + запуск автоплея
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setActiveCard(0);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Автоплей: каждые 2.5 сек переключаем активную карточку
  useEffect(() => {
    if (!isVisible || isPaused) return;
    const interval = setInterval(() => {
      setActiveCard((prev) => ((prev ?? -1) + 1) % features.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isVisible, isPaused, features.length]);

  // Accessibility — отключаем анимации при prefers-reduced-motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPaused(true);
    }
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-slate-50 dark:bg-slate-800/50 relative overflow-hidden"
    >
      {/* Декоративные блобы */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Заголовок секции */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6" />
          <p className="font-sans text-base sm:text-lg text-slate-600 dark:text-slate-400">{t('description')}</p>
        </div>

        {/* Прогресс-индикаторы */}
        <div
          className={`flex justify-center gap-2 mb-10 transition-all duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveCard(i); setIsPaused(true); }}
              className="h-1.5 rounded-full transition-all duration-500 focus:outline-none"
              style={{
                width: activeCard === i ? '2rem' : '0.5rem',
                background:
                  activeCard === i
                    ? cardThemes[i].gradient
                    : 'rgba(148, 163, 184, 0.4)',
              }}
              aria-label={`Card ${i + 1}`}
            />
          ))}
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const theme = cardThemes[index];
            const isActive = activeCard === index;

            return (
              <div
                key={index}
                className="why-card-parent w-full"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
                }}
                onMouseEnter={() => { setActiveCard(index); setIsPaused(true); }}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  className={`why-card${isActive ? ' why-card--active' : ''}`}
                  style={{
                    background: theme.gradient,
                    boxShadow: isActive
                      ? `${theme.shadowColor} 40px 50px 25px -40px, ${theme.shadowColorAlt} 0px 30px 35px -5px`
                      : `${theme.shadowColor} 40px 50px 25px -40px, ${theme.shadowColorAlt} 0px 25px 25px -5px`,
                  }}
                >
                  {/* Стеклянный слой */}
                  <div
                    className="why-glass"
                    style={{ background: theme.glassGradient }}
                  />

                  {/* Слоистые круги с иконкой */}
                  <div className="why-logo">
                    <span className="why-circle why-circle1" style={{ background: theme.circleColor }} />
                    <span className="why-circle why-circle2" style={{ background: theme.circleColor }} />
                    <span className="why-circle why-circle3" style={{ background: theme.circleColor }} />
                    <span className="why-circle why-circle4" style={{ background: theme.circleColor }} />
                    <span className="why-circle why-circle5" style={{ background: theme.circleColor }}>
                      <Icon style={{ width: 22, height: 22, color: 'white', strokeWidth: 2.5 }} />
                    </span>
                  </div>

                  {/* Текстовый контент */}
                  <div className="why-content">
                    <span className="why-title" style={{ color: theme.titleColor }}>
                      {feature.title}
                    </span>
                    <span className="why-text" style={{ color: theme.textColor }}>
                      {feature.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .why-card-parent {
          width: 100%;
          max-width: 320px;
          height: 300px;
          perspective: 1000px;
        }

        @media (min-width: 640px) {
          .why-card-parent {
            max-width: 290px;
            height: 320px;
          }
        }

        .why-card {
          height: 100%;
          border-radius: 50px;
          transition: transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
          transform-style: preserve-3d;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        /* Автоплей / hover — 3D поворот */
        .why-card--active,
        .why-card-parent:hover .why-card {
          transform: rotate3d(1, 1, 0, 30deg);
        }

        .why-glass {
          transform-style: preserve-3d;
          position: absolute;
          inset: 8px;
          border-radius: 55px;
          border-top-right-radius: 100%;
          transform: translate3d(0px, 0px, 25px);
          border-left: 1px solid white;
          border-bottom: 1px solid white;
          transition: all 0.5s ease-in-out;
          pointer-events: none;
        }

        .why-content {
          padding: 110px 60px 0px 28px;
          transform: translate3d(0, 0, 26px);
          position: relative;
        }

        /* Montserrat — display шрифт проекта */
        .why-title {
          display: block;
          font-family: var(--font-montserrat), system-ui, sans-serif;
          font-weight: 800;
          font-size: 17px;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        /* Open Sans — основной шрифт проекта */
        .why-text {
          display: block;
          font-family: var(--font-open-sans), system-ui, sans-serif;
          font-weight: 500;
          font-size: 13.5px;
          line-height: 1.6;
          margin-top: 10px;
        }

        /* Logo / circles */
        .why-logo {
          position: absolute;
          right: 0;
          top: 0;
          transform-style: preserve-3d;
        }

        .why-circle {
          display: block;
          position: absolute;
          aspect-ratio: 1;
          border-radius: 50%;
          top: 0;
          right: 0;
          box-shadow: rgba(100, 100, 111, 0.2) -10px 10px 20px 0px;
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
          transition: all 0.5s ease-in-out;
        }

        .why-circle1 { width: 170px; transform: translate3d(0,0,20px);  top: 8px;  right: 8px; }
        .why-circle2 { width: 140px; transform: translate3d(0,0,40px);  top: 10px; right: 10px; -webkit-backdrop-filter: blur(1px); backdrop-filter: blur(1px); transition-delay: 0.4s; }
        .why-circle3 { width: 110px; transform: translate3d(0,0,60px);  top: 17px; right: 17px; transition-delay: 0.8s; }
        .why-circle4 { width: 80px;  transform: translate3d(0,0,80px);  top: 23px; right: 23px; transition-delay: 1.2s; }
        .why-circle5 {
          width: 50px;
          transform: translate3d(0,0,100px);
          top: 30px;
          right: 30px;
          display: grid;
          place-content: center;
          transition-delay: 1.6s;
        }

        /* Круги выдвигаются при активности */
        .why-card--active ~ * .why-circle2,
        .why-card-parent:hover .why-circle2 { transform: translate3d(0,0,60px); }
        .why-card--active ~ * .why-circle3,
        .why-card-parent:hover .why-circle3 { transform: translate3d(0,0,80px); }
        .why-card--active ~ * .why-circle4,
        .why-card-parent:hover .why-circle4 { transform: translate3d(0,0,100px); }
        .why-card--active ~ * .why-circle5,
        .why-card-parent:hover .why-circle5 { transform: translate3d(0,0,120px); }

        /* Управляем кругами через класс на самой карточке */
        .why-card--active .why-circle2 { transform: translate3d(0,0,60px); }
        .why-card--active .why-circle3 { transform: translate3d(0,0,80px); }
        .why-card--active .why-circle4 { transform: translate3d(0,0,100px); }
        .why-card--active .why-circle5 { transform: translate3d(0,0,120px); }

        @media (prefers-reduced-motion: reduce) {
          .why-card,
          .why-circle,
          .why-glass {
            transition: none !important;
          }
          .why-card--active,
          .why-card-parent:hover .why-card {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
