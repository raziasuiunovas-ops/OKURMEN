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
  coverImage: string | null;
  coverGradient: { from: string; to: string } | null;
  colorTheme: string | null; // NEW: Solid hex color
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
      <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-900">
        <div className="container px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 sm:mb-4">
              {t('title')}
            </h2>
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full sm:w-[350px] bg-slate-100 dark:bg-slate-800 rounded-2xl h-[300px] sm:h-[480px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-900">
        <div className="container px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 sm:mb-4">
              {t('title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">
              {t('empty_title')}
            </p>
            <div className="p-8 sm:p-12 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                {t('empty_message')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16 animate-fade-in">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 sm:mb-4">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            {t('description')}
          </p>
        </div>

        {/* Expanding Cards Container */}
        <div className="expanding-cards-container mx-auto px-2 sm:px-4 lg:px-5" style={{ maxWidth: '1200px' }}>
          <div className="expanding-cards">
            {courses.map((course, index) => {
              const translation = getTranslation(course);
              const IconComponent = course.icon && iconMap[course.icon] ? iconMap[course.icon] : BookOpen;
              const isActive = activeIndex === index;
              
              // Use coverImage if available, otherwise use solid color
              const hasCoverImage = course.coverImage && course.coverImage.trim() !== '';
              const solidColor = course.colorTheme || '#FF6B35'; // Default orange
              
              // Background: image if available, otherwise solid color
              const backgroundStyle = hasCoverImage 
                ? `url(${course.coverImage})`
                : solidColor;

              return (
                <div
                  key={course.id}
                  className={`expanding-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    ['--cardBackground' as any]: backgroundStyle,
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

                      </div>
                    </div>

                    {/* Learn Price Button - visible when active */}
                    {isActive && (
                      <>
                        <a
                          href="#application-form"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const element = document.getElementById('application-form');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          className="card-price-btn"
                        >
                          {t('learn_price')}
                        </a>
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
                      </>
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
        <div className="text-center mt-8 sm:mt-10 lg:mt-12 animate-fade-in">
          <button 
            onClick={() => router.push('/courses')}
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
          >
            {t('view_all')}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .expanding-cards-container {
          padding: 10px 0;
          overflow: visible;
        }

        @media (min-width: 640px) {
          .expanding-cards-container {
            padding: 20px 0;
          }
        }

        .expanding-cards {
          display: flex;
          gap: 12px;
          align-items: stretch;
          overflow: visible;
          min-height: 400px;
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .expanding-cards {
            gap: 15px;
            min-height: 500px;
          }
        }

        .expanding-card {
          position: relative;
          overflow: hidden;
          min-width: 70px;
          background: var(--cardBackground);
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          border-radius: 20px;
          flex-grow: 1;
          flex-shrink: 1;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0,0,0,0.15);
        }

        @media (min-width: 640px) {
          .expanding-card {
            min-width: 80px;
            border-radius: 30px;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0,0,0,0.15);
          }
        }

        .expanding-card:hover {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2), 0 8px 30px rgba(0,0,0,0.25);
          transform: translateY(-2px);
        }

        @media (min-width: 640px) {
          .expanding-card:hover {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2), 0 8px 30px rgba(0,0,0,0.25);
          }
        }

        .expanding-card.active {
          flex-grow: 10000;
          min-width: 600px;
          max-width: 800px;
          border-radius: 40px;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2), 0 10px 40px rgba(0,0,0,0.3);
        }

        @media (min-width: 640px) {
          .expanding-card.active {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25), 0 10px 40px rgba(0,0,0,0.3);
          }
        }

        .expanding-card:not(.active) {
          max-width: 120px;
        }

        .card-shadow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 220px;
          background: linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.3) 50%, transparent);
          transition: all 0.6s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          border-radius: 0 0 30px 30px;
        }

        .expanding-card.active .card-shadow {
          border-radius: 0 0 40px 40px;
        }

        .expanding-card:not(.active) .card-shadow {
          bottom: 0;
          height: 180px;
          background: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2) 40%, transparent);
        }

        .card-label {
          display: flex;
          flex-direction: column;
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          transition: all 0.6s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          gap: 10px;
        }

        @media (min-width: 640px) {
          .card-label {
            bottom: 20px;
            left: 20px;
            right: 20px;
            gap: 15px;
          }
        }

        .expanding-card:not(.active) .card-label {
          bottom: 10px;
          left: 10px;
          right: 10px;
        }

        @media (min-width: 640px) {
          .expanding-card:not(.active) .card-label {
            bottom: 15px;
            left: 15px;
            right: 15px;
          }
        }

        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          color: white;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
        }

        @media (min-width: 640px) {
          .card-icon {
            width: 48px;
            height: 48px;
            min-width: 48px;
          }
        }

        .card-icon:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.15) rotate(5deg);
          border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);
        }

        .card-icon:active {
          transform: scale(1.05);
        }

        .expanding-card:not(.active) .card-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          background-color: rgba(255, 255, 255, 0.06);
        }

        @media (min-width: 640px) {
          .expanding-card:not(.active) .card-icon {
            width: 38px;
            height: 38px;
            min-width: 38px;
          }
        }

        .card-info {
          display: flex;
          flex-direction: column;
          color: white;
          gap: 8px;
        }

        .card-main {
          font-weight: 800;
          font-size: 1.25rem;
          line-height: 1.2;
          transition: all 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          opacity: 0;
          transform: translateX(30px);
        }

        @media (min-width: 640px) {
          .card-main {
            font-size: 1.5rem;
          }
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

        .card-price-btn {
          margin-top: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(15px);
          animation: fadeInUp 0.5s ease forwards 0.2s;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          white-space: nowrap;
          width: fit-content;
        }

        .card-price-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .card-price-btn:active {
          transform: translateY(-1px) scale(0.98);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-detail-btn {
          margin-top: 8px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(15px);
          animation: fadeInUp 0.5s ease forwards 0.35s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          width: 100%;
        }

        .card-detail-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .card-detail-btn:active {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-level-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          transition: all 0.4s ease;
          opacity: 0;
          cursor: default;
        }

        @media (min-width: 640px) {
          .card-level-badge {
            top: 20px;
            left: 20px;
          }
        }

        .card-level-badge span {
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .card-level-badge span:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
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
            gap: 12px;
            min-height: auto;
          }

          .expanding-card {
            min-width: 100% !important;
            max-width: 100% !important;
            min-height: 100px;
            border-radius: 16px !important;
          }

          .expanding-card.active {
            min-height: 320px;
          }

          .expanding-card:not(.active) .card-main,
          .expanding-card:not(.active) .card-sub {
            opacity: 1;
            transform: translateX(0);
          }

          .expanding-card:not(.active) .card-main {
            font-size: 1rem;
          }

          .expanding-card:not(.active) .card-sub {
            font-size: 0.8rem;
          }

          .card-label {
            flex-direction: row;
            align-items: center;
            gap: 10px;
          }

          .expanding-card.active .card-label {
            flex-direction: column;
            align-items: flex-start;
          }

          .card-level-badge {
            opacity: 1;
            top: 12px;
            left: 12px;
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
          background-color: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(255, 255, 255, 0.15);
        }

        :global(.dark) .card-icon:hover {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.35);
        }

        :global(.dark) .card-price-btn {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }

        :global(.dark) .card-price-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          border-color: rgba(255, 255, 255, 0.4);
        }

        :global(.dark) .card-detail-btn {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }

        :global(.dark) .card-detail-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          border-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </section>
  );
}
