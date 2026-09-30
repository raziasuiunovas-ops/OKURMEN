'use client';

import { useTranslations } from 'next-intl';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';

interface Employee {
  id: string;
  position: string;
  bio: string | null;
  photoUrl: string | null;
  experience: string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  };
}

// Иерархия должностей для сортировки
const POSITION_HIERARCHY: Record<string, number> = {
  FOUNDER: 1,
  MANAGER: 2,
  MENTOR: 3,
  TEACHER: 4,
};

export default function TeamSection() {
  const t = useTranslations('team');
  const locale = useLocale();
  const [employees, setEmployees] = useState<Employee[]>([]);
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
    const fetchEmployees = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/api/employees`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // Сортировка по иерархии: FOUNDER → MANAGER → MENTOR → TEACHER
          const sortedEmployees = [...data.data].sort((a, b) => {
            const orderA = POSITION_HIERARCHY[a.position] || 999;
            const orderB = POSITION_HIERARCHY[b.position] || 999;
            return orderA - orderB;
          });
          
          setEmployees(sortedEmployees);
        }
      } catch (error) {
        console.error('[TeamSection] Error fetching employees:', error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Баштапкы позицияга scroll кылуу (биринчиден башталсын)
  useEffect(() => {
    if (carouselRef.current && employees.length > 0) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [employees.length]);

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
      <section id="team" className="py-20 bg-white dark:bg-slate-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (employees.length === 0) {
    return (
      <section id="team" className="py-20 bg-white dark:bg-slate-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Наши преподаватели скоро появятся здесь
            </p>
            <div className="p-12 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <User className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                Команда в процессе формирования
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-200/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('description')}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
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

          {/* Infinite Carousel Track */}
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
              {employees.map((employee, index) => {
                const gradient = gradients[index % gradients.length];
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
                // Base64 болсо туура колдон, file path болсо API URL кош
                const photoUrl = employee.photoUrl 
                  ? (employee.photoUrl.startsWith('data:') ? employee.photoUrl : `${apiUrl}${employee.photoUrl}`)
                  : null;

                // Position enum'ду котормо
                const getPositionLabel = (pos: string) => {
                  const positions: Record<string, Record<string, string>> = {
                    FOUNDER: { ru: 'Основатель', ky: 'Негиздөөчү', en: 'Founder' },
                    MANAGER: { ru: 'Менеджер', ky: 'Менеджер', en: 'Manager' },
                    MENTOR: { ru: 'Ментор', ky: 'Ментор', en: 'Mentor' },
                    TEACHER: { ru: 'Преподаватель', ky: 'Мугалим', en: 'Teacher' },
                  };
                  return positions[pos]?.[locale] || pos;
                };

                // Bio жана experience толук англисче котормо
                const translateText = (text: string | null): string | null => {
                  if (!text || locale !== 'en') return text;
                  
                  // Толук сүйлөмдөр жана фразалар (эң узундарынан баштап)
                  const translations: Record<string, string> = {
                    // Толук кызмат орду аталыштары
                    'Руководитель учебного отдела, завуч; Директор ОКУРМЭН Студии': 'Head of Education Department, Academic Supervisor; Director of OKURMEN Studio',
                    'Руководитель учебного отдела, завуч': 'Head of Education Department, Academic Supervisor',
                    'Старший менеджер отдела продаж, сектор «Сота»': 'Senior Sales Manager, Sota Sector',
                    'РО / Руководитель отдела продаж': 'SO / Head of Sales Department',
                    'Руководитель отдела продаж': 'Head of Sales Department',
                    'Директор отдела продаж': 'Sales Director',
                    'Старший менеджер отдела продаж': 'Senior Sales Manager',
                    'Менеджер отдела продаж': 'Sales Manager',
                    'Коммерческий директор': 'Commercial Director',
                    'Топ-менеджер': 'Top Manager',
                    'HR жетекчи': 'HR Manager',
                    'Основатель': 'Founder',
                    'Куратор': 'Curator',
                    'Ментор': 'Mentor',
                    
                    // Experience котормолору
                    'с 01.06.2026': 'since June 1, 2026',
                    '2023–2026': '2023–2026',
                    
                    // Убакыт бирдиктери
                    'месяцев': 'months',
                    'месяца': 'months',
                    'месяц': 'month',
                    'года': 'years',
                    'год': 'year',
                    'лет': 'years',
                    
                    // Бөлүктөр
                    'отдела': 'Department',
                    'отдел': 'Department',
                    'продаж': 'Sales',
                    'сектор': 'sector',
                    
                    // Жалпы сөздөр
                    'Руководитель': 'Head',
                    'Директор': 'Director',
                    'Старший': 'Senior',
                    'Менеджер': 'Manager',
                    'завуч': 'Academic Supervisor',
                  };
                  
                  let translated = text;
                  // Эң узун фразалардан баштап которобуз (толук туура келиш үчүн)
                  const sortedEntries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
                  sortedEntries.forEach(([ru, en]) => {
                    // Global, case-insensitive replace
                    const regex = new RegExp(ru.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                    translated = translated.replace(regex, en);
                  });
                  
                  return translated;
                };

                return (
                  <div
                    key={employee.id}
                    className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-premium-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-transparent hover:-translate-y-2 flex-shrink-0"
                    style={{ 
                      width: itemsPerView === 1 ? 'calc(100vw - 80px)' : 
                             itemsPerView === 2 ? 'calc(50vw - 60px)' : 
                             'calc(25vw - 50px)',
                      maxWidth: '320px'
                    }}
                  >
                    {/* Avatar - 3:4 Aspect Ratio */}
                    <div className={`relative aspect-[3/4] bg-gradient-to-br ${gradient} overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={employee.user.fullName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          draggable="false"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="p-6 bg-white/90 dark:bg-slate-900/90 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                            <User className="w-16 h-16 text-slate-700 dark:text-slate-300" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-2">
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                        {employee.user.fullName}
                      </h3>
                      {/* Position */}
                      <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        {getPositionLabel(employee.position)}
                      </p>
                      {employee.bio && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {translateText(employee.bio)}
                        </p>
                      )}
                      {employee.experience && (
                        <p className="text-xs text-slate-500 dark:text-slate-500 font-medium pt-1">
                          {t('experience')}: {translateText(employee.experience)}
                        </p>
                      )}
                    </div>

                    {/* Hover Gradient Border */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl border-2 border-transparent bg-gradient-to-br ${gradient} bg-clip-border" style={{ padding: '2px' }}></div>
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
