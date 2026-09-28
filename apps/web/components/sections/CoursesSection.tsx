'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, ArrowRight, TrendingUp } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

interface Course {
  id: string;
  slug: string;
  price: number;
  coverGradient: { from: string; to: string } | null;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  enrolledStudents: number;
  totalHours: number;
  translation: {
    title: string;
    description: string;
    level: string;
  };
  _count: {
    lessons: number;
  };
}

export default function CoursesSection() {
  const router = useRouter();
  const locale = useLocale();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(
          `${apiUrl}/api/courses?language=${locale.toUpperCase()}&limit=6`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Показываем пустое состояние при ошибке
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [locale]);

  const getLevelLabel = (level: string) => {
    const labels: Record<string, Record<string, string>> = {
      BEGINNER: { ru: 'Начальный', ky: 'Баштапкы', en: 'Beginner' },
      INTERMEDIATE: { ru: 'Средний', ky: 'Орточо', en: 'Intermediate' },
      ADVANCED: { ru: 'Продвинутый', ky: 'Өнүккөн', en: 'Advanced' },
    };
    return labels[level]?.[locale] || level;
  };

  const getDefaultGradient = (index: number) => {
    const gradients = [
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-orange-500 to-amber-500',
      'from-teal-500 to-cyan-500',
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <section id="courses" className="py-20 bg-white dark:bg-slate-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Популярные Курсы
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-[420px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section id="courses" className="py-20 bg-white dark:bg-slate-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Популярные Курсы
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              В настоящее время курсы находятся в разработке. Следите за обновлениями!
            </p>
            <div className="p-12 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <BookOpen className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                Скоро здесь появятся новые курсы
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20 bg-white dark:bg-slate-900">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Популярные Курсы
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Выберите курс который изменит вашу карьеру. Все курсы включают практические проекты и поддержку менторов.
          </p>
        </div>

        {/* Courses Grid - Улучшенные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => {
            const gradient = course.coverGradient
              ? `from-[${course.coverGradient.from}] to-[${course.coverGradient.to}]`
              : getDefaultGradient(index);

            return (
              <div
                key={course.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-premium-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Course Header with Gradient - Больше воздуха */}
                <div className={`relative h-52 bg-gradient-to-br ${gradient} overflow-hidden`}>
                  {/* Декоративные элементы */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '24px 24px'
                    }}></div>
                  </div>
                  
                  {/* Центральная иконка */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-16 h-16 text-slate-700 dark:text-slate-300" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      course.translation.level === 'BEGINNER' 
                        ? 'bg-green-500 text-white'
                        : course.translation.level === 'INTERMEDIATE'
                        ? 'bg-blue-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}>
                      {getLevelLabel(course.translation.level)}
                    </span>
                  </div>

                  {/* Rating badge */}
                  {course.rating > 0 && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-lg">
                      <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {course.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Popular badge */}
                  {course.enrolledStudents > 50 && (
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                      <TrendingUp className="w-3 h-3" />
                      Популярный
                    </div>
                  )}
                </div>

                {/* Course Content - Увеличены padding */}
                <div className="p-7 space-y-5">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                      {course.translation.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.translation.description}
                    </p>
                  </div>

                  {/* Meta Info - Улучшенная типографика */}
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <span className="flex items-center gap-1.5 font-medium">
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      {course._count.lessons} {course._count.lessons === 1 ? 'урок' : course._count.lessons < 5 ? 'урока' : 'уроков'}
                    </span>
                    {course.totalHours > 0 && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {course.totalHours}ч
                      </span>
                    )}
                  </div>

                  {/* Students count */}
                  {course.enrolledStudents > 0 && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{course.enrolledStudents} студентов</span>
                    </div>
                  )}

                  {/* Price and CTA - Улучшенный стиль */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-black text-orange-600 dark:text-orange-500">
                        {course.price.toLocaleString()}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">сом</div>
                    </div>
                    <button 
                      onClick={() => router.push('/courses')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 dark:bg-white hover:bg-orange-600 dark:hover:bg-orange-500 text-white dark:text-slate-900 hover:dark:text-white font-bold text-sm rounded-xl transition-all group/btn shadow-lg hover:shadow-xl"
                    >
                      Подробнее
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center animate-fade-in">
          <button 
            onClick={() => router.push('/courses')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Смотреть все курсы
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
