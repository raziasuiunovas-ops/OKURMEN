'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { useTranslations } from 'next-intl';

interface SiteStats {
  totalStudents: number;
  employedCount: number;
  employmentRate: number;
}

interface StatsCarouselProps {
  stats: SiteStats | null;
}

interface StatCard {
  id: number;
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
  glowColor: string;
}

export default function StatsCarousel({ stats }: StatsCarouselProps) {
  const t = useTranslations('hero');
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const studentsValue = stats?.totalStudents 
    ? (stats.totalStudents >= 1000 ? `${Math.floor(stats.totalStudents / 1000)}K+` : `${stats.totalStudents}+`)
    : '670+';

  const cards: StatCard[] = [
    {
      id: 1,
      title: t('students_count'),
      value: studentsValue,
      subtitle: 'бир айда',
      gradient: 'from-orange-500 via-orange-600 to-red-500',
      glowColor: 'rgba(249, 115, 22, 0.4)',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Ийгилик',
      value: stats?.employmentRate ? `${stats.employmentRate}%` : '81%',
      subtitle: 'иштеп жайгашуу',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Курстар',
      value: '10+',
      subtitle: 'программалар',
      gradient: 'from-purple-500 via-purple-600 to-pink-600',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Менторлор',
      value: '20+',
      subtitle: 'тажрыйбалуу',
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      glowColor: 'rgba(34, 197, 94, 0.4)',
      icon: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % cards.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovering, cards.length]);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absPosition = ((index - activeIndex + cards.length) % cards.length);
    
    // Calculate position
    let translateX = 0;
    let translateZ = -200;
    let scale = 0.7;
    let opacity = 0.4;
    let rotateY = 0;
    
    if (absPosition === 0) {
      // Active card - center
      translateX = 0;
      translateZ = 0;
      scale = 1;
      opacity = 1;
      rotateY = mousePosition.x * 5; // Parallax tilt
    } else if (absPosition === 1) {
      // Next card - right
      translateX = 280;
      translateZ = -150;
      scale = 0.85;
      opacity = 0.6;
      rotateY = -15;
    } else if (absPosition === cards.length - 1) {
      // Previous card - left
      translateX = -280;
      translateZ = -150;
      scale = 0.85;
      opacity = 0.6;
      rotateY = 15;
    } else {
      // Hidden cards
      opacity = 0;
    }

    return {
      transform: `
        translateX(${translateX}px) 
        translateZ(${translateZ}px) 
        rotateY(${rotateY}deg) 
        scale(${scale})
      `,
      opacity,
      zIndex: absPosition === 0 ? 10 : 5 - absPosition,
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Cards */}
      {cards.map((card, index) => {
        const style = getCardStyle(index);
        const isActive = index === activeIndex;
        
        return (
          <div
            key={card.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700 ease-out"
            style={{
              ...style,
              transformStyle: 'preserve-3d',
            }}
            onClick={() => setActiveIndex(index)}
          >
            {/* Card */}
            <div 
              className={`
                relative w-[280px] sm:w-[320px] h-[200px] sm:h-[220px] 
                rounded-3xl overflow-hidden
                backdrop-blur-xl
                border-2 border-white/20 dark:border-white/10
                transition-all duration-500
                ${isActive ? 'shadow-2xl' : 'shadow-lg'}
              `}
              style={{
                background: `linear-gradient(135deg, ${card.gradient})`,
              }}
            >
              {/* Glow effect on hover */}
              {isActive && (
                <div 
                  className="absolute -inset-4 blur-2xl opacity-60 transition-opacity duration-500"
                  style={{
                    background: card.glowColor,
                  }}
                />
              )}

              {/* Card content */}
              <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between">
                {/* Icon */}
                <div className="flex justify-between items-start">
                  <div className={`
                    w-12 h-12 sm:w-14 sm:h-14 
                    bg-white/20 backdrop-blur-sm rounded-2xl 
                    flex items-center justify-center
                    p-2.5 sm:p-3
                    transition-transform duration-500
                    ${isActive ? 'scale-110 rotate-6' : 'scale-100'}
                  `}>
                    <div className="text-white">
                      {card.icon}
                    </div>
                  </div>

                  {/* Decorative particles */}
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <div className="text-sm sm:text-base font-semibold text-white/90 mb-2">
                    {card.title}
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-white mb-1 tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 font-medium">
                    {card.subtitle}
                  </div>
                </div>

                {/* Bottom decorative line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>

              {/* Shine effect */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              )}
            </div>
          </div>
        );
      })}

      {/* Navigation dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === activeIndex 
                ? 'bg-white w-8' 
                : 'bg-white/30 hover:bg-white/50'
              }
            `}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
