'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { Clock, BookOpen, Users, TrendingUp, Award, Calendar, Star, GraduationCap, Code, Palette, Globe, Brain, Zap, Film, Wrench, Sparkles, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses?language=${locale.toUpperCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setCourses(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-orange-500 via-orange-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <Container>
          <BackButton fallbackPath="/" className="mb-6" />
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {locale === 'ru' ? 'Наши Курсы' : locale === 'ky' ? 'Биздин Курстар' : 'Our Courses'}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {locale === 'ru' 
                ? 'Выберите курс и начните свой путь к новой профессии' 
                : locale === 'ky' 
                ? 'Курс тандап, жаңы кесипке жол тартыңыз'
                : 'Choose a course and start your journey to a new career'}
            </p>
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}+ {locale === 'ru' ? 'студентов' : locale === 'ky' ? 'студент' : 'students'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{courses.length} {locale === 'ru' ? 'курсов' : locale === 'ky' ? 'курс' : 'courses'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>{locale === 'ru' ? 'Сертификаты' : locale === 'ky' ? 'Сертификаттар' : 'Certificates'}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Filters */}
      <section className="py-8 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg z-40 border-b border-slate-200 dark:border-slate-800">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === level
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {labels[level]}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-[500px] animate-pulse bg-slate-200 dark:bg-slate-800">
                  <div />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => {
                const gradient = course.coverGradient || { from: '#3B82F6', to: '#06B6D4' };
                const IconComponent = course.icon && iconMap[course.icon] ? iconMap[course.icon] : BookOpen;
                
                return (
                  <Card
                    key={course.id}
                    hover
                    className="group relative overflow-hidden card-holographic gradient-border flex flex-col"
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
                      {/* Level Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          course.translation.level === 'BEGINNER' 
                            ? 'bg-green-100 text-green-700'
                            : course.translation.level === 'INTERMEDIATE'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
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
                        <a
                          href="/#application-form"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Navigate to home page with application form anchor
                            window.location.href = `/${locale}#application-form`;
                          }}
                          className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                        >
                          {t('learn_price')}
                        </a>
                        
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
                );
              })}
            </div>
          )}

          {!loading && filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {locale === 'ru' ? 'Курсы не найдены' : locale === 'ky' ? 'Курстар табылган жок' : 'No courses found'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {locale === 'ru' ? 'Попробуйте изменить фильтр' : locale === 'ky' ? 'Фильтрди өзгөртүп көрүңүз' : 'Try changing the filter'}
              </p>
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </main>
  );
}
