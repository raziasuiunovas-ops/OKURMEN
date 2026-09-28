'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export default function RevealOnScroll({ 
  children, 
  className = '', 
  delay = 0,
  threshold = 0.1 
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Добавляем класс с анимацией
            element.classList.add('reveal-visible');
          }
          // Не удаляем класс при выходе из viewport, чтобы избежать мигания
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px', // Начинаем анимацию чуть раньше
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`reveal-element ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
