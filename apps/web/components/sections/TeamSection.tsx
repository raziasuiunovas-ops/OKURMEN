'use client';

import { useTranslations } from 'next-intl';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from 'next-intl';

interface Employee {
  id: string;
  positions: string[];
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

// Иерархия должностей для сортировки (порядок важен!)
// 1. Основатели → 2. Завуч → 3. Руководители → 4. Кураторы → 5. Менторы → 6. Остальные
const POSITION_HIERARCHY: Record<string, number> = {
  // Категория 1: Основатели
  FOUNDER: 1,
  
  // Категория 2: Завуч / Руководитель образовательного направления
  HEAD_TEACHER: 2,
  
  // Категория 3: Руководители / Директора
  DIRECTOR: 3,
  DEPARTMENT_HEAD: 4,
  ROP: 5,
  
  // Категория 4: Кураторы
  CURATOR: 6,
  
  // Категория 5: Менторы
  MENTOR: 7,
  
  // Категория 6: Остальные сотрудники
  SENIOR_MANAGER: 8,
  MANAGER: 9,
  TEACHER: 10,
  DEVELOPER: 11,
  HR: 12,
  MARKETING: 13,
  SMM: 14,
  SALES: 15,
  ADMIN_STAFF: 16,
  OTHER: 99,
};

// Цветовая система для категорий должностей
const POSITION_COLORS: Record<string, { from: string; via: string; to: string; glow: string }> = {
  // Основатели - Оранжевый (фирменный цвет OKURMEN)
  FOUNDER: { 
    from: 'from-orange-500', 
    via: 'via-orange-600', 
    to: 'to-amber-600', 
    glow: 'rgba(249, 115, 22, 0.3)' 
  },
  
  // Завуч - Фиолетовый (образование, знания)
  HEAD_TEACHER: { 
    from: 'from-purple-500', 
    via: 'via-violet-600', 
    to: 'to-indigo-600', 
    glow: 'rgba(168, 85, 247, 0.3)' 
  },
  
  // Руководители - Синий (лидерство, стабильность)
  DIRECTOR: { 
    from: 'from-blue-500', 
    via: 'via-blue-600', 
    to: 'to-indigo-600', 
    glow: 'rgba(59, 130, 246, 0.3)' 
  },
  DEPARTMENT_HEAD: { 
    from: 'from-blue-500', 
    via: 'via-blue-600', 
    to: 'to-indigo-600', 
    glow: 'rgba(59, 130, 246, 0.3)' 
  },
  ROP: { 
    from: 'from-blue-500', 
    via: 'via-blue-600', 
    to: 'to-indigo-600', 
    glow: 'rgba(59, 130, 246, 0.3)' 
  },
  
  // Кураторы - Изумрудный (поддержка, забота)
  CURATOR: { 
    from: 'from-emerald-500', 
    via: 'via-green-600', 
    to: 'to-teal-600', 
    glow: 'rgba(16, 185, 129, 0.3)' 
  },
  
  // Менторы - Голубой (наставничество, развитие)
  MENTOR: { 
    from: 'from-cyan-500', 
    via: 'via-teal-600', 
    to: 'to-blue-600', 
    glow: 'rgba(6, 182, 212, 0.3)' 
  },
  
  // Остальные - Розовый (команда)
  SENIOR_MANAGER: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
  MANAGER: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
  TEACHER: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
  DEVELOPER: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
  HR: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
  MARKETING: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
  SMM: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
  SALES: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
  ADMIN_STAFF: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
  OTHER: { 
    from: 'from-rose-500', 
    via: 'via-pink-600', 
    to: 'to-fuchsia-600', 
    glow: 'rgba(244, 63, 94, 0.3)' 
  },
};

export default function TeamSection() {
  const t = useTranslations('team');
  const locale = useLocale();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isInViewport, setIsInViewport] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Функция для получения цвета по должности
  const getGradientForPosition = (positions: string[]) => {
    if (!positions || positions.length === 0) {
      return POSITION_COLORS.OTHER;
    }
    
    // Берем самую приоритетную должность
    const sortedPositions = [...positions].sort((a, b) => {
      const aPriority = POSITION_HIERARCHY[a] || 99;
      const bPriority = POSITION_HIERARCHY[b] || 99;
      return aPriority - bPriority;
    });
    
    const topPosition = sortedPositions[0];
    return POSITION_COLORS[topPosition] || POSITION_COLORS.OTHER;
  };

  // Update itemsPerView on mount and resize
  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width >= 1280) {
          setItemsPerView(4); // xl screens
        } else if (width >= 1024) {
          setItemsPerView(3); // lg screens
        } else if (width >= 640) {
          setItemsPerView(2); // sm screens
        } else {
          setItemsPerView(1); // mobile
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
          const sortedEmployees = [...data.data].sort((a, b) => {
            const aMinPriority = Math.min(...(a.positions || []).map((p: string) => POSITION_HIERARCHY[p] || 99));
            const bMinPriority = Math.min(...(b.positions || []).map((p: string) => POSITION_HIERARCHY[p] || 99));
            return aMinPriority - bMinPriority;
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

  // Viewport observer - адам жакындаганда autoplay башталат
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, []);

  // Autoplay - viewport'ко кирген учурда башталат, чыкканда токтойт
  useEffect(() => {
    // Эски interval'ды тазала
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }

    // Шарттар: жетиштүү карточка болсун, viewport'то болсун, hover жок болсун
    if (employees.length <= itemsPerView || !isInViewport || isHovering) {
      return;
    }

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, employees.length - itemsPerView);
        return prev + 1 > maxIndex ? 0 : prev + 1;
      });
    }, 3500);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [employees.length, itemsPerView, isInViewport, isHovering]);

  // AUTOPLAY АЛЫНДЫ - адам өзү navigate кылсын
  
  // Navigation функциялары - 1 КАРТОЧКА ТОЛУК ЖЫЛСЫН
  // Navigation функциялары - 1 КАРТОЧКА ТОЛУК ЖЫЛСЫН
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, employees.length - itemsPerView);
      // 1 карточка толук жылат
      const nextIndex = prev + 1;
      return nextIndex > maxIndex ? 0 : nextIndex;
    });
  }, [employees.length, itemsPerView]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, employees.length - itemsPerView);
      // 1 карточка толук артка
      const prevIndex = prev - 1;
      return prevIndex < 0 ? maxIndex : prevIndex;
    });
  }, [employees.length, itemsPerView]);

  if (loading) {
    return (
      <section id="team" className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('title')}
            </h2>
          </div>
          <div className="flex gap-6 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-3xl w-72 h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (employees.length === 0) {
    return (
      <section id="team" className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {t('description')}
            </p>
            <div className="p-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-700">
              <User className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                Команда формируется
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getPositionLabel = (pos: string) => {
    const positions: Record<string, Record<string, string>> = {
      FOUNDER: { ru: 'Основатель', ky: 'Негиздөөчү', en: 'Founder' },
      DIRECTOR: { ru: 'Руководитель/Директор', ky: 'Жетекчи/Директор', en: 'Director' },
      HEAD_TEACHER: { ru: 'Завуч', ky: 'Окуу бөлүмүнүн башчысы', en: 'Head Teacher' },
      DEPARTMENT_HEAD: { ru: 'Руководитель отдела', ky: 'Бөлүм башчысы', en: 'Department Head' },
      ROP: { ru: 'РОП', ky: 'РОП', en: 'Head of Sales' },
      SENIOR_MANAGER: { ru: 'Старший менеджер', ky: 'Улук менеджер', en: 'Senior Manager' },
      MANAGER: { ru: 'Менеджер', ky: 'Менеджер', en: 'Manager' },
      CURATOR: { ru: 'Куратор', ky: 'Куратор', en: 'Curator' },
      MENTOR: { ru: 'Ментор', ky: 'Ментор', en: 'Mentor' },
      TEACHER: { ru: 'Преподаватель', ky: 'Мугалим', en: 'Teacher' },
      DEVELOPER: { ru: 'Разработчик', ky: 'Иштеп чыгуучу', en: 'Developer' },
      HR: { ru: 'HR', ky: 'HR', en: 'HR' },
      MARKETING: { ru: 'Маркетолог', ky: 'Маркетолог', en: 'Marketing' },
      SMM: { ru: 'SMM', ky: 'SMM', en: 'SMM' },
      SALES: { ru: 'Продажи', ky: 'Сатуу', en: 'Sales' },
      ADMIN_STAFF: { ru: 'Административный персонал', ky: 'Администрациялык кызматкер', en: 'Admin Staff' },
      OTHER: { ru: 'Другое', ky: 'Башка', en: 'Other' },
    };
    return positions[pos]?.[locale] || pos;
  };
  
  const getPositionLabels = (positions: string[]) => {
    if (!positions || positions.length === 0) return '';
    return positions.map(p => getPositionLabel(p)).join(', ');
  };

  const translateText = (text: string | null): string | null => {
    if (!text || locale !== 'en') return text;
    
    const translations: Record<string, string> = {
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
      'с 01.06.2026': 'since June 1, 2026',
      '2023–2026': '2023–2026',
      'месяцев': 'months',
      'месяца': 'months',
      'месяц': 'month',
      'года': 'years',
      'год': 'year',
      'лет': 'years',
    };
    
    let translated = text;
    const sortedEntries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
    sortedEntries.forEach(([ru, en]) => {
      const regex = new RegExp(ru.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      translated = translated.replace(regex, en);
    });
    
    return translated;
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  return (
    <section 
      ref={sectionRef}
      id="team" 
      className="py-24 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-400/10 dark:bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {t('title')}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent via-orange-500 to-orange-500 rounded-full"></div>
            <div className="h-1.5 w-1.5 bg-orange-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-orange-500 via-blue-500 to-blue-600 rounded-full"></div>
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation Buttons */}
          {employees.length > itemsPerView && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:scale-110 hover:bg-white dark:hover:bg-slate-800 group"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:scale-110 hover:bg-white dark:hover:bg-slate-800 group"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
              </button>
            </>
          )}

          {/* Carousel Track with Cards */}
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-700 ease-out gap-4 sm:gap-6 py-4"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {employees.map((employee, index) => {
                const gradient = getGradientForPosition(employee.positions || []);
                const photoUrl = employee.photoUrl 
                  ? (employee.photoUrl.startsWith('data:') ? employee.photoUrl : `${apiUrl}${employee.photoUrl}`)
                  : null;

                return (
                  <div
                    key={employee.id}
                    className="flex-shrink-0 group"
                    style={{ width: `calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 24) / itemsPerView}px)` }}
                  >
                    {/* Card */}
                    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                      {/* Gradient Glow on Hover */}
                      <div 
                        className="absolute -inset-1 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10 rounded-3xl"
                        style={{
                          background: `linear-gradient(135deg, ${gradient.glow}, transparent)`,
                        }}
                      ></div>

                      {/* Photo */}
                      <div className={`relative aspect-[3/4] bg-gradient-to-br ${gradient.from} ${gradient.via} ${gradient.to} overflow-hidden`}>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 group-hover:from-black/20 transition-colors duration-500"></div>
                        
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={employee.user.fullName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            draggable="false"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="p-8 bg-white/95 dark:bg-slate-900/95 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-500 shadow-xl">
                              <User className="w-20 h-20 text-slate-700 dark:text-slate-300" />
                            </div>
                          </div>
                        )}

                        {/* Decorative Corner */}
                        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-2xl group-hover:w-16 group-hover:h-16 transition-all duration-500"></div>
                      </div>

                      {/* Info */}
                      <div className="p-5 sm:p-6 space-y-3">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-tight">
                          {employee.user.fullName}
                        </h3>
                        
                        <div className={`inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r ${gradient.from} ${gradient.via} ${gradient.to} text-white shadow-md`}>
                          {getPositionLabels(employee.positions || [])}
                        </div>

                        {employee.bio && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {translateText(employee.bio)}
                          </p>
                        )}
                        
                        {employee.experience && (
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                              {t('experience')}: {translateText(employee.experience)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination Dots */}
          {employees.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(employees.length / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index 
                      ? 'w-8 h-2 bg-gradient-to-r from-orange-500 to-blue-600' 
                      : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
