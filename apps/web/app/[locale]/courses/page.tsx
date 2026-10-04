'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { Clock, BookOpen, Users, TrendingUp, Award, Calendar, Star, GraduationCap, Code, Palette, Globe, Brain, Zap, Film, Wrench, Sparkles, ArrowLeft, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Course {
  id: string;
  slug: string;
  price: number;
  duration: string;
  totalHours: number;
  format: string;
  coverGradient: { from: string; to: string } | null;
  icon: string | null;
  coverImage: string | null;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  enrolledStudents: number;
  translation: {
    title: string;
    description: string;
    level: string;
  };
  _count: {
    lessons: number;
  };
}

// Маппинг иконок курсов (синхронизирован с Admin)
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

export default function CoursesPage() {
  const t = useTranslations('courses');
  const locale = useLocale();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses?language=${locale.toUpperCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setCourses(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
  }, [locale]);

  const filteredCourses = filter === 'ALL' 
    ? courses 
    : courses.filter(c => c.translation.level === filter);

  const levelLabels = {
    ru: { ALL: 'Все', BEGINNER: 'Начальный', INTERMEDIATE: 'Средний', ADVANCED: 'Продвинутый' },
    ky: { ALL: 'Баары', BEGINNER: 'Баштапкы', INTERMEDIATE: 'Орточо', ADVANCED: 'Өнүккөн' },
    en: { ALL: 'All', BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' },
  };

  const labels = levelLabels[locale as keyof typeof levelLabels] || levelLabels.en;

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(`/${locale}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <Header />
      
      {/* Modern Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6">
        <Container>
          {/* Back Button - Modern Design */}
          <button
            onClick={handleBack}
            className={`group mb-8 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg transform hover:-translate-x-1 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transition: 'all 0.5s ease-out' }}
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {locale === 'ru' ? 'Назад' : locale === 'ky' ? 'Артка' : 'Back'}
            </span>
          </button>

          {/* Hero Content */}
          <div className={`text-center max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-blue-500/10 dark:from-orange-500/20 dark:to-blue-500/20 backdrop-blur-sm rounded-full border border-orange-200/50 dark:border-orange-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400 animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-r from-orange-600 to-blue-600 dark:from-orange-400 dark:to-blue-400 bg-clip-text text-transparent">
                {locale === 'ru' ? 'Профессиональные IT-курсы' : locale === 'ky' ? 'Кесипке даярлоочу IT-курстар' : 'Professional IT Courses'}
              </span>
            </div>

            {/* Title with Gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="block text-slate-900 dark:text-white mb-2">
                {locale === 'ru' ? 'Наши' : locale === 'ky' ? 'Биздин' : 'Our'}
              </span>
              <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                {locale === 'ru' ? 'Курсы' : locale === 'ky' ? 'Курстар' : 'Courses'}
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {locale === 'ru' 
                ? 'Выберите курс и начните свой путь к новой профессии' 
                : locale === 'ky' 
                ? 'Курс тандап, жаңы кесипке жол тартыңыз'
                : 'Choose a course and start your journey to a new career'}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}+</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{locale === 'ru' ? 'студентов' : locale === 'ky' ? 'студент' : 'students'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{courses.length}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{locale === 'ru' ? 'курсов' : locale === 'ky' ? 'курс' : 'courses'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{locale === 'ru' ? 'Сертификаты' : locale === 'ky' ? 'Сертификаттар' : 'Certificates'}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{locale === 'ru' ? 'официальные' : locale === 'ky' ? 'расмий' : 'official'}</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Modern Filters */}
      <section className="sticky top-0 z-50 py-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level, index) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`group px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                  filter === level
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50 dark:shadow-orange-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-md'
                }`}
                style={{
                  animation: isVisible ? `slideInUp 0.5s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                <span className="flex items-center gap-2">
                  {filter === level && (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  )}
                  {labels[level]}
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Courses Grid - Enhanced */}
      <section className="relative py-20 px-4 sm:px-6">
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[520px] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => {
                const gradient = course.coverGradient || { from: '#3B82F6', to: '#06B6D4' };
                const IconComponent = course.icon && iconMap[course.icon] ? iconMap[course.icon] : BookOpen;
                
                return (
                  <div
                    key={course.id}
                    className="group"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <Card
                      hover
                      className="h-full flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-800"
                    >
                    {/* Course Cover */}
                    {course.coverImage ? (
                      <div className="w-full h-48 rounded-xl mb-6 overflow-hidden">
                        <img
                          src={course.coverImage}
                          alt={course.translation.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full h-48 rounded-xl mb-6 flex items-center justify-center group-hover:scale-105 transition-all duration-500 relative overflow-hidden shine-effect shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                        }}
                      >
                        {/* Gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20"></div>
                        <IconComponent className="w-20 h-20 text-white relative z-10 drop-shadow-2xl" strokeWidth={1.5} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    )}

                    {/* Course Info */}
                    <div className="flex-1 flex flex-col space-y-4">
                      {/* Level Badge - Enhanced */}
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          course.translation.level === 'BEGINNER' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700'
                            : course.translation.level === 'INTERMEDIATE'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-700'
                        }`}>
                          {labels[course.translation.level as keyof typeof labels]}
                        </span>
                        {course.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold">{course.rating.toFixed(1)}</span>
                            <span className="text-gray-400">({course.totalReviews})</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {course.translation.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-400 line-clamp-3 flex-1">
                        {course.translation.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100 dark:border-slate-700">
                        {course.totalHours > 0 && (
                          <div className="text-center">
                            <Clock className="w-5 h-5 mx-auto mb-1 text-orange-600 dark:text-orange-500" />
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{course.totalHours}ч</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{locale === 'ru' ? 'Часов' : locale === 'ky' ? 'Саат' : 'Hours'}</div>
                          </div>
                        )}
                        {course._count.lessons > 0 && (
                          <div className="text-center">
                            <BookOpen className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{course._count.lessons}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{locale === 'ru' ? 'Уроков' : locale === 'ky' ? 'Сабак' : 'Lessons'}</div>
                          </div>
                        )}
                        {course.enrolledStudents > 0 && (
                          <div className="text-center">
                            <Users className="w-5 h-5 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{course.enrolledStudents}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{locale === 'ru' ? 'Студентов' : locale === 'ky' ? 'Студент' : 'Students'}</div>
                          </div>
                        )}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-3 pt-2">
                        {/* Learn Price Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Navigate to home page with application form anchor
                            window.location.href = `/${locale}#application-form`;
                          }}
                          className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                        >
                          {t('learn_price')}
                        </button>
                        
                        {/* Details Button */}
                        <Button
                          variant="primary"
                          size="md"
                          className="btn-enhanced"
                          onClick={() => {
                            window.location.href = `/${locale}/courses/${course.slug}`;
                          }}
                        >
                          {locale === 'ru' ? 'Подробнее' : locale === 'ky' ? 'Кененирээк' : 'Learn more'}
                        </Button>
                      </div>

                      {/* Format Badge */}
                      {course.duration && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{course.duration}</span>
                          <span>•</span>
                          <span>{course.format === 'HYBRID' ? (locale === 'ru' ? 'Гибрид' : locale === 'ky' ? 'Гибрид' : 'Hybrid') : course.format}</span>
                        </div>
                      )}
                    </div>

                    {/* Active Badge */}
                    {course.isActive && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ✓ {locale === 'ru' ? 'Активен' : locale === 'ky' ? 'Активдүү' : 'Active'}
                      </div>
                    )}

                    {/* Popular Badge */}
                    {course.rating >= 4.5 && course.totalReviews >= 5 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {locale === 'ru' ? 'Популярный' : locale === 'ky' ? 'Популярдуу' : 'Popular'}
                      </div>
                    )}
                  </Card>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filteredCourses.length === 0 && (
            <div className="text-center py-20 animate-fadeIn">
              <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {locale === 'ru' ? 'Курсы не найдены' : locale === 'ky' ? 'Курстар табылган жок' : 'No courses found'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {locale === 'ru' ? 'Попробуйте изменить фильтр' : locale === 'ky' ? 'Фильтрди өзгөртүп көрүңүз' : 'Try changing the filter'}
              </p>
              <button
                onClick={() => setFilter('ALL')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {locale === 'ru' ? 'Сбросить фильтр' : locale === 'ky' ? 'Баштапкы абалга келтирүү' : 'Reset filter'}
              </button>
            </div>
          )}
        </Container>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </main>
  );
}
