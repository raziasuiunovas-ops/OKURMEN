'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, ArrowRight, Star, Code, Brain, Sparkles, GraduationCap, Film, Wrench, Globe, Zap, TrendingUp, type LucideIcon } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

// Маппинг иконок по названиям (синхронизирован с Admin)
const iconMap: Record<string, LucideIcon> = {
  'Code': Code,
  'Brain': Brain,
  'GraduationCap': GraduationCap,
  'Film': Film,
  'Wrench': Wrench,
  'Globe': Globe,
  'Zap': Zap,
  'Sparkles': Sparkles,
  'BookOpen': BookOpen,
  'Users': Users,
  'Star': Star,
  'TrendingUp': TrendingUp,
};

interface CourseTranslation {
  id: string;
  languageCode: string;
  title: string;
  description: string;
  level: string;
}

interface Course {
  id: string;
  slug: string;
  price: number;
  icon: string | null;
  coverGradient: { from: string; to: string } | null;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  enrolledStudents: number;
  totalHours: number;
  translations: CourseTranslation[];
  _count: {
    lessons: number;
  };
}

export default function CoursesSection() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('courses');
  const levelT = useTranslations('levels');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/api/courses`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Helper для выбора правильного перевода с fallback
  const getTranslation = (course: Course) => {
    const langCode = locale.toUpperCase();
    
    // Ищем перевод для текущего языка
    let translation = course.translations.find(t => t.languageCode === langCode);
    
    // Fallback на русский
    if (!translation) {
      translation = course.translations.find(t => t.languageCode === 'RU');
    }
    
    // Fallback на первый доступный
    if (!translation) {
      translation = course.translations[0];
    }
    
    return translation || {
      title: 'Course',
      description: '',
      level: 'BEGINNER',
    };
  };

  const getLevelLabel = (level: string) => {
    return levelT(level) || level;
  };

  const getDefaultGradient = (index: number) => {
    const gradients = [
      { from: '#3b82f6', to: '#06b6d4' }, // blue to cyan
      { from: '#10b981', to: '#059669' }, // green to emerald
      { from: '#ec4899', to: '#f43f5e' }, // pink to rose
      { from: '#a855f7', to: '#6366f1' }, // purple to indigo
      { from: '#f97316', to: '#f59e0b' }, // orange to amber
      { from: '#14b8a6', to: '#06b6d4' }, // teal to cyan
      { from: '#ef4444', to: '#f97316' }, // red to orange
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <section id="courses" className="py-20 bg-white dark:bg-slate-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('title')}
            </h2>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[350px] bg-slate-100 dark:bg-slate-800 rounded-2xl h-[480px] animate-pulse"
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
              {t('title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {t('empty_title')}
            </p>
            <div className="p-12 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <BookOpen className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                {t('empty_message')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('description')}
          </p>
        </div>

        {/* Expanding Cards Container */}
        <div className="expanding-cards-container mx-auto" style={{ maxWidth: '1200px' }}>
          <div className="expanding-cards">
            {courses.map((course, index) => {
              const translation = getTranslation(course);
              const hasCustomGradient = course.coverGradient?.from && course.coverGradient?.to;
              const gradient = hasCustomGradient 
                ? { from: course.coverGradient!.from, to: course.coverGradient!.to }
                : getDefaultGradient(index);
              const IconComponent = course.icon && iconMap[course.icon] ? iconMap[course.icon] : BookOpen;
              const isActive = activeIndex === index;

              return (
                <div
                  key={course.id}
                  className={`expanding-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    ['--cardBackground' as any]: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                  }}
                >
                  {/* Shadow overlay */}
                  <div className="card-shadow"></div>

                  {/* Card label/content */}
                  <div className="card-label">
                    {/* Icon */}
                    <div className="card-icon">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="card-info">
                      <div className="card-main">{translation.title}</div>
                      <div className="card-sub">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course._count.lessons}
                          </span>
                          {course.totalHours > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.totalHours}ч
                            </span>
                          )}
                          {course.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {course.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-lg font-black text-white">
                          {course.price.toLocaleString()} {t('currency')}
                        </div>
                      </div>
                    </div>

                    {/* Detail button - visible when active */}
                    {isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/courses/${course.slug}`);
                        }}
                        className="card-detail-btn"
                      >
                        {t('details')}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Level badge */}
                  <div className="card-level-badge">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      translation.level === 'BEGINNER' 
                        ? 'bg-green-500 text-white'
                        : translation.level === 'INTERMEDIATE'
                        ? 'bg-blue-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}>
                      {getLevelLabel(translation.level)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12 animate-fade-in">
          <button 
            onClick={() => router.push('/courses')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            {t('view_all')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .expanding-cards-container {
          padding: 20px;
        }

        .expanding-cards {
          display: flex;
          gap: 15px;
          align-items: stretch;
          overflow: hidden;
          min-height: 500px;
        }

        .expanding-card {
          position: relative;
          overflow: hidden;
          min-width: 80px;
          background: var(--cardBackground);
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          border-radius: 30px;
          flex-grow: 1;
          flex-shrink: 1;
        }

        .expanding-card.active {
          flex-grow: 10000;
          min-width: 600px;
          max-width: 800px;
          border-radius: 40px;
        }

        .expanding-card:not(.active) {
          max-width: 120px;
        }

        .card-shadow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          transition: all 0.6s cubic-bezier(0.05, 0.61, 0.41, 0.95);
        }

        .expanding-card:not(.active) .card-shadow {
          bottom: -60px;
          background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
        }

        .card-label {
          display: flex;
          flex-direction: column;
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          transition: all 0.6s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          gap: 15px;
        }

        .expanding-card:not(.active) .card-label {
          bottom: 15px;
          left: 15px;
          right: 15px;
        }

        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          min-width: 50px;
          border-radius: 50%;
          background-color: white;
          color: #1e293b;
          transition: all 0.4s ease;
        }

        .expanding-card:not(.active) .card-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          color: white;
          gap: 8px;
        }

        .card-main {
          font-weight: 800;
          font-size: 1.5rem;
          line-height: 1.2;
          transition: all 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          opacity: 0;
          transform: translateX(30px);
        }

        .expanding-card.active .card-main {
          opacity: 1;
          transform: translateX(0);
        }

        .card-sub {
          transition: all 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95) 0.1s;
          opacity: 0;
          transform: translateX(30px);
        }

        .expanding-card.active .card-sub {
          opacity: 1;
          transform: translateX(0);
        }

        .card-detail-btn {
          margin-top: 10px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          font-weight: 700;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s ease forwards 0.3s;
        }

        .card-detail-btn:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-level-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          transition: all 0.4s ease;
          opacity: 0;
        }

        .expanding-card.active .card-level-badge {
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .expanding-cards {
            min-height: 400px;
          }

          .expanding-card.active {
            min-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .expanding-cards {
            flex-direction: column;
            gap: 15px;
            min-height: auto;
          }

          .expanding-card {
            min-width: 100% !important;
            max-width: 100% !important;
            min-height: 120px;
            border-radius: 20px !important;
          }

          .expanding-card.active {
            min-height: 350px;
          }

          .expanding-card:not(.active) .card-main,
          .expanding-card:not(.active) .card-sub {
            opacity: 1;
            transform: translateX(0);
          }

          .expanding-card:not(.active) .card-main {
            font-size: 1.1rem;
          }

          .expanding-card:not(.active) .card-sub {
            font-size: 0.85rem;
          }

          .card-label {
            flex-direction: row;
            align-items: center;
            gap: 12px;
          }

          .expanding-card.active .card-label {
            flex-direction: column;
            align-items: flex-start;
          }

          .card-level-badge {
            opacity: 1;
            top: 15px;
            left: 15px;
          }
        }

        @keyframes fadeInAnimation {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInAnimation 0.6s ease-out;
        }

        /* Dark mode adjustments */
        :global(.dark) .card-icon {
          background-color: rgba(255, 255, 255, 0.95);
          color: #1e293b;
        }

        :global(.dark) .card-detail-btn {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
        }

        :global(.dark) .card-detail-btn:hover {
          background: white;
        }
      `}</style>
    </section>
  );
}
