'use client';

import { useTranslations } from 'next-intl';
import { User, ChevronLeft, ChevronRight, Linkedin, Mail } from 'lucide-react';
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

export default function TeamSection() {
  const t = useTranslations('team');
  const locale = useLocale();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [founders, setFounders] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);

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
        console.log('[TeamSection] Fetching employees from:', `${apiUrl}/api/employees`);
        const response = await fetch(`${apiUrl}/api/employees`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        console.log('[TeamSection] API Response:', { 
          success: data.success, 
          totalEmployees: data.data?.length,
          employees: data.data 
        });
        
        if (data.success && data.data) {
          // Разделяем на founders и остальных
          const allEmployees = data.data;
          const foundersData = allEmployees.filter((emp: Employee) => emp.position === 'FOUNDER');
          const regularEmployees = allEmployees.filter((emp: Employee) => emp.position !== 'FOUNDER');
          
          console.log('[TeamSection] Founders:', foundersData.length, 'Regular:', regularEmployees.length);
          setFounders(foundersData);
          setEmployees(regularEmployees);
        }
      } catch (error) {
        console.error('[TeamSection] Error fetching employees:', error);
        setEmployees([]);
        setFounders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Carousel controls
  const maxIndex = Math.max(0, Math.ceil(employees.length / itemsPerView) - 1);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (loading) {
    return (
      <section id="team" className="py-20 bg-white dark:bg-slate-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Наша Команда
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

  if (employees.length === 0 && founders.length === 0) {
    return (
      <section id="team" className="py-20 bg-white dark:bg-slate-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Наша Команда
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
            Наша Команда
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Профессиональные преподаватели с реальным опытом работы в IT-индустрии
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {employees.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: Math.ceil(employees.length / itemsPerView) }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2"
                >
                  {employees
                    .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                    .map((employee, index) => {
                      const gradient = gradients[index % gradients.length];
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
                      const photoUrl = employee.photoUrl ? `${apiUrl}${employee.photoUrl}` : null;

                      return (
                        <div
                          key={employee.id}
                          className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-premium-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-transparent hover:-translate-y-2"
                        >
                          {/* Avatar */}
                          <div className={`relative h-64 bg-gradient-to-br ${gradient} overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={employee.user.fullName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                          <div className="p-6 space-y-3">
                            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {employee.user.fullName}
                            </h3>
                            {employee.bio && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                                {employee.bio}
                              </p>
                            )}
                            {employee.experience && (
                              <p className="text-xs text-slate-500 dark:text-slate-500">
                                Опыт: {employee.experience}
                              </p>
                            )}

                            {/* Social Links - удалены пока нет данных */}
                          </div>

                          {/* Hover Gradient Border */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl border-2 border-transparent bg-gradient-to-br ${gradient} bg-clip-border" style={{ padding: '2px' }}></div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {employees.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'w-8 bg-orange-600'
                      : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
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
