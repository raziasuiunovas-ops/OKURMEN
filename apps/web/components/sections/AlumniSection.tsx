'use client';

import { useState, useEffect, useRef } from 'react';
import { User, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface Project {
  title: string;
  url: string;
}

interface Alumni {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  story: string | null;
  photoUrl: string | null;
  projects?: Project[];
  isFeatured: boolean;
}

export default function AlumniSection() {
  const t = useTranslations('stats');
  const commonT = useTranslations('common');
  const alumniT = useTranslations('alumni');
  const locale = useLocale();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [itemsPerView, setItemsPerView] = useState(1);

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-orange-500 to-amber-500',
    'from-teal-500 to-cyan-500',
  ];

  // Update itemsPerView on mount and resize
  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width >= 1024) {
          setItemsPerView(4);
        } else if (width >= 640) {
          setItemsPerView(2);
        } else {
          setItemsPerView(1);
        }
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/api/alumni?featured=true`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch alumni');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setAlumni(data.data);
        }
      } catch (error) {
        console.error('Error fetching alumni:', error);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Scroll to start
  useEffect(() => {
    if (carouselRef.current && alumni.length > 0) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [alumni.length]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    carouselRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (carouselRef.current) {
        carouselRef.current.style.cursor = 'grab';
      }
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Navigation buttons
  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <section id="alumni" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('alumni')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (alumni.length === 0) {
    return (
      <section id="alumni" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('alumni')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-8"></div>
            <div className="p-12 bg-white dark:bg-slate-800 rounded-2xl">
              <User className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                {t('alumni_empty')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="alumni" className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('alumni')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('alumni_description')}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {alumni.length > itemsPerView && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-110"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-110"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className="flex gap-8 px-2 py-2" style={{ width: 'fit-content' }}>
              {alumni.map((alum, index) => {
                const gradient = gradients[index % gradients.length];
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
                const photoUrl = alum.photoUrl 
                  ? (alum.photoUrl.startsWith('data:') ? alum.photoUrl : `${apiUrl}${alum.photoUrl}`)
                  : null;

                // Проекттер бардыгын көрсөт
                const projects = alum.projects && Array.isArray(alum.projects) ? alum.projects : [];

                return (
                  <div
                    key={alum.id}
                    className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-premium-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-transparent hover:-translate-y-2 flex-shrink-0"
                    style={{ 
                      width: itemsPerView === 1 ? 'calc(100vw - 80px)' : 
                             itemsPerView === 2 ? 'calc(50vw - 60px)' : 
                             'calc(25vw - 50px)',
                      maxWidth: '280px'
                    }}
                  >
                    {/* Avatar - 3:4 Aspect Ratio (бирок кичинерээк) */}
                    <div className={`relative aspect-[3/4] bg-gradient-to-br ${gradient} overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={alum.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          draggable="false"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="p-6 bg-white/90 dark:bg-slate-900/90 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                            <User className="w-12 h-12 text-slate-700 dark:text-slate-300" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                        {alum.name}
                      </h3>
                      
                      {alum.position && (
                        <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                          {alum.position}
                        </p>
                      )}
                      
                      {alum.story && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {alum.story}
                        </p>
                      )}

                      {/* Project Buttons */}
                      {projects.length > 0 && (
                        <div className="pt-2 space-y-1.5">
                          {projects.map((project, idx) => (
                            <a
                              key={idx}
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span className="truncate">
                                {locale === 'ky' ? 'Проектти көрүү' : 
                                 locale === 'ru' ? 'Посмотреть проект' : 
                                 'View project'}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
