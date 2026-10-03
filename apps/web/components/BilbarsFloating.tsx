'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface BilbarsState {
  image: string;
  animation: 'float' | 'think' | 'work' | 'present' | 'graduate';
  position: { x: number; y: number };
  scale?: number;
}

const BILBARS_STATES: Record<string, BilbarsState> = {
  courses: {
    image: 'работает.jpg',
    animation: 'work',
    position: { x: 90, y: 28 },
    scale: 0.9
  },
  why: {
    image: 'Задумался.jpg',
    animation: 'think',
    position: { x: 8, y: 54 },
    scale: 0.95
  },
  team: {
    image: 'Выступает перед доской.jpg',
    animation: 'present',
    position: { x: 88, y: 65 },
    scale: 0.9
  },
  alumni: {
    image: 'выпусник.jpg',
    animation: 'graduate',
    position: { x: 12, y: 80 }, // Сол капталда - форманы жаппайт
    scale: 0.95 // Бир аз чоңураак
  }
};

export default function BilbarsFloating() {
  const [currentState, setCurrentState] = useState<string>('courses');
  const [isVisible, setIsVisible] = useState(false);
  const [shouldHide, setShouldHide] = useState(false); // Footer алдында жашырылат
  const observerRefs = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Show BILBARS after welcome screen
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Setup intersection observer for sections
    const sections = [
      { id: 'courses', selector: '#courses' },
      { id: 'why', selector: '#about' },
      { id: 'team', selector: '#team' },
      { id: 'alumni', selector: '#alumni' }
    ];

    observerRefs.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find(s => 
              entry.target.matches(s.selector) || 
              entry.target.id === s.id.replace('#', '')
            );
            if (section) {
              setCurrentState(section.id);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px' }
    );

    // Observe all sections
    sections.forEach(({ selector }) => {
      const element = document.querySelector(selector);
      if (element && observerRefs.current) {
        observerRefs.current.observe(element);
      }
    });

    // Observer для Footer/Application form - БИЛБАРС жашырылат
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldHide(true);
          } else {
            setShouldHide(false);
          }
        });
      },
      { threshold: 0.05, rootMargin: '150px 0px' }
    );

    // Footer жана Application form издөө
    const footerElement = document.querySelector('footer');
    const applicationForm = document.querySelector('#application, #application-form, [id*="application"]');
    
    if (footerElement) {
      footerObserver.observe(footerElement);
    }
    if (applicationForm) {
      footerObserver.observe(applicationForm);
    }

    return () => {
      clearTimeout(timer);
      if (observerRefs.current) {
        observerRefs.current.disconnect();
      }
      footerObserver.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  const state = BILBARS_STATES[currentState];
  if (!state) return null;

  // Footer алдында opacity 0 кылуу
  const finalOpacity = shouldHide ? 0 : (isVisible ? 1 : 0);

  const getAnimationClass = () => {
    switch (state.animation) {
      case 'float':
        return 'bilbars-float';
      case 'think':
        return 'bilbars-think';
      case 'work':
        return 'bilbars-work';
      case 'present':
        return 'bilbars-present';
      case 'graduate':
        return 'bilbars-graduate'; // Жөнөкөй idle анимация
      default:
        return 'bilbars-float';
    }
  };

  return (
    <>
      {/* Desktop version */}
      <div
        className="fixed z-40 pointer-events-none transition-all duration-1000 ease-out hidden md:block"
        style={{
          left: `${state.position.x}%`,
          top: `${state.position.y}%`,
          transform: `translate(-50%, -50%) scale(${state.scale || 1})`,
          opacity: finalOpacity,
        }}
      >
        <div className={`relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 transition-all duration-700 ${getAnimationClass()}`}>
          <Image
            src={`/bilbars/${state.image}`}
            alt="БИЛБАРС"
            fill
            className="object-contain drop-shadow-2xl transition-opacity duration-300"
            sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
            priority={currentState === 'courses'}
          />
        </div>
      </div>

      {/* Mobile version */}
      <div
        className="fixed z-40 pointer-events-none transition-all duration-1000 ease-out md:hidden"
        style={{
          right: '0.25rem',
          bottom: '3.5rem',
          transform: `scale(${(state.scale || 1) * 0.7})`,
          opacity: finalOpacity,
        }}
      >
        <div className={`relative w-16 h-16 xs:w-20 xs:h-20 transition-all duration-700 ${getAnimationClass()}`}>
          <Image
            src={`/bilbars/${state.image}`}
            alt="БИЛБАРС"
            fill
            className="object-contain drop-shadow-xl transition-opacity duration-300"
            sizes="80px"
            priority={currentState === 'courses'}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes bilbars-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes bilbars-think {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.03) rotate(-2deg); }
        }

        @keyframes bilbars-work {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-6px) translateX(2px); }
        }

        @keyframes bilbars-present {
          0%, 100% { transform: translateX(0px) scale(1); }
          50% { transform: translateX(4px) scale(1.02); }
        }

        @keyframes bilbars-graduate {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(-1deg); }
          75% { transform: scale(1.05) rotate(1deg); }
        }

        .bilbars-float {
          animation: bilbars-float 3.5s ease-in-out infinite;
        }

        .bilbars-think {
          animation: bilbars-think 4s ease-in-out infinite;
        }

        .bilbars-work {
          animation: bilbars-work 2.5s ease-in-out infinite;
        }

        .bilbars-present {
          animation: bilbars-present 3s ease-in-out infinite;
        }

        .bilbars-graduate {
          animation: bilbars-graduate 3s ease-in-out infinite;
        }

        @media (max-width: 1024px) {
          .bilbars-float,
          .bilbars-think,
          .bilbars-work,
          .bilbars-present,
          .bilbars-graduate {
            animation-duration: 4s;
          }
        }

        @media (max-width: 768px) {
          .bilbars-float,
          .bilbars-think,
          .bilbars-work,
          .bilbars-present,
          .bilbars-graduate {
            animation: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bilbars-float,
          .bilbars-think,
          .bilbars-work,
          .bilbars-present,
          .bilbars-graduate {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
