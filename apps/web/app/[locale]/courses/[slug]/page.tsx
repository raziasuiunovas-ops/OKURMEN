'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BackButton } from '@/components/ui/BackButton';
import { 
  Clock, 
  BookOpen, 
  Users, 
  Star, 
  TrendingUp,
  Code,
  Brain,
  Sparkles,
  GraduationCap,
  Film,
  Wrench,
  Globe,
  Zap,
  Award,
  Calendar,
  CheckCircle,
  type LucideIcon
} from 'lucide-react';

// Маппинг иконок (синхронизирован с Admin)
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
  program: string | null;
}

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
  translations: CourseTranslation[];
  _count: {
    lessons: number;
    enrollments: number;
    courseReviews: number;
  };
}

export default function CourseDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('courses');
  const levelT = useTranslations('levels');
  const commonT = useTranslations('common');
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/api/courses`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // Находим курс по slug
          const foundCourse = data.data.find((c: Course) => c.slug === params.slug);
          if (foundCourse) {
            setCourse(foundCourse);
          } else {
            setError(true);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchCourse();
    }
  }, [params.slug]);

  // Helper для выбора правильного перевода с fallback
  const getTranslation = (course: Course) => {
    const langCode = locale.toUpperCase();
    
    let translation = course.translations.find(t => t.languageCode === langCode);
    
    if (!translation) {
      translation = course.translations.find(t => t.languageCode === 'RU');
    }
    
    if (!translation) {
      translation = course.translations[0];
    }
    
    return translation || {
      title: course.slug,
      description: '',
      level: 'BEGINNER',
      program: null,
    };
  };

  const getDefaultGradient = () => {
    return 'from-blue-500 to-cyan-500';
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-3xl mx-auto text-center">
            <BackButton fallbackPath="/courses" className="mb-8" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {locale === 'ru' ? 'Курс не найден' : locale === 'ky' ? 'Курс табылган жок' : 'Course not found'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {locale === 'ru' ? 'Извините, этот курс не существует или был удален.' : locale === 'ky' ? 'Кечиресиз, бул курс жок же өчүрүлгөн.' : 'Sorry, this course does not exist or has been removed.'}
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const translation = getTranslation(course);
  const hasCustomGradient = course.coverGradient?.from && course.coverGradient?.to;
  const defaultGradient = getDefaultGradient();
  const IconComponent = course.icon && iconMap[course.icon] ? iconMap[course.icon] : BookOpen;

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div 
          className={`absolute inset-0 ${!hasCustomGradient ? `bg-gradient-to-br ${defaultGradient}` : ''}`}
          style={hasCustomGradient && course.coverGradient ? {
            background: `linear-gradient(to bottom right, ${course.coverGradient.from}, ${course.coverGradient.to})`
          } : undefined}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <BackButton fallbackPath="/courses" className="mb-8 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white" />
            
            <div className="flex items-start gap-8">
              {/* Icon */}
              <div className="hidden md:block flex-shrink-0">
                <div className="w-32 h-32 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
                  <IconComponent className="w-16 h-16 text-slate-700 dark:text-slate-300" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow">
                {/* Level Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-4 py-2 text-sm font-bold rounded-full ${
                    translation.level === 'BEGINNER' 
                      ? 'bg-green-500 text-white'
                      : translation.level === 'INTERMEDIATE'
                      ? 'bg-blue-500 text-white'
                      : 'bg-purple-500 text-white'
                  }`}>
                    {levelT(translation.level)}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                  {translation.title}
                </h1>

                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  {translation.description}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-6 text-white">
                  {/* Rating */}
                  {course.rating > 0 && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{course.rating.toFixed(1)}</span>
                      <span className="text-white/70">({course.totalReviews})</span>
                    </div>
                  )}

                  {/* Students/Views */}
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <Users className="w-5 h-5" />
                    <span className="font-bold">{course.enrolledStudents}</span>
                    <span className="text-white/70">{t('students_enrolled')}</span>
                  </div>

                  {/* Lessons */}
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-bold">{course._count.lessons}</span>
                    <span className="text-white/70">
                      {course._count.lessons === 1 ? t('lesson_one') : course._count.lessons < 5 ? t('lesson_few') : t('lesson_many')}
                    </span>
                  </div>

                  {/* Hours */}
                  {course.totalHours > 0 && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <Clock className="w-5 h-5" />
                      <span className="font-bold">{course.totalHours}</span>
                      <span className="text-white/70">{t('hours')}</span>
                    </div>
                  )}

                  {/* Duration/Period */}
                  {course.duration && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <Calendar className="w-5 h-5" />
                      <span className="font-bold">{course.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Description */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-soft border border-slate-200 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    {locale === 'ru' ? 'О курсе' : locale === 'ky' ? 'Курс жөнүндө' : 'About the course'}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {translation.description}
                  </p>
                  
                  {/* Add Review Button */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => {
                        // Scroll to reviews section if it exists, or show modal
                        const reviewsSection = document.querySelector('#reviews');
                        if (reviewsSection) {
                          reviewsSection.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          // Future: open review modal or navigate to review form
                          alert(locale === 'ru' 
                            ? 'Функция добавления отзыва будет доступна в ближайшее время' 
                            : locale === 'ky' 
                            ? 'Пикир кошуу функциясы жакынкы убакта иштейт' 
                            : 'Review feature coming soon');
                        }
                      }}
                      className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors duration-200 group"
                    >
                      <Star className="w-4 h-4 group-hover:fill-orange-600 dark:group-hover:fill-orange-500 transition-all duration-200" />
                      <span className="border-b border-transparent group-hover:border-orange-600 dark:group-hover:border-orange-500">
                        {locale === 'ru' ? 'Добавить отзыв' : locale === 'ky' ? 'Пикир кошуу' : 'Add review'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Program if available */}
                {translation.program && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-soft border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      {locale === 'ru' ? 'Программа курса' : locale === 'ky' ? 'Курстун программасы' : 'Course program'}
                    </h2>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {translation.program}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Price Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-soft border border-slate-200 dark:border-slate-700">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        {locale === 'ru' ? 'Готовы начать обучение?' : locale === 'ky' ? 'Окууну баштоого даярсызбы?' : 'Ready to start learning?'}
                      </h3>
                    </div>

                    {/* Learn Price Button */}
                    <a
                      href="/#application-form"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Navigate to home page with application form anchor
                        window.location.href = `/${locale}#application-form`;
                      }}
                      className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 mb-4"
                    >
                      {t('learn_price')}
                    </a>

                    <button 
                      onClick={() => {
                        // Scroll to application form
                        const applicationSection = document.querySelector('#application');
                        if (applicationSection) {
                          applicationSection.scrollIntoView({ behavior: 'smooth' });
                          // Prefill course name if possible
                          const courseInput = document.querySelector('select[name="course"]') as HTMLSelectElement;
                          if (courseInput) {
                            setTimeout(() => {
                              const options = Array.from(courseInput.options);
                              const matchingOption = options.find(opt => 
                                opt.text.toLowerCase().includes(translation.title.toLowerCase()) ||
                                translation.title.toLowerCase().includes(opt.text.toLowerCase())
                              );
                              if (matchingOption) {
                                courseInput.value = matchingOption.value;
                                courseInput.dispatchEvent(new Event('change', { bubbles: true }));
                              }
                            }, 500);
                          }
                        } else {
                          // Fallback - navigate to home with hash
                          window.location.href = `/${locale}#application-form`;
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-orange-500 dark:hover:border-orange-500 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                    >
                      {locale === 'ru' ? 'Записаться на курс' : locale === 'ky' ? 'Курска жазылуу' : 'Enroll now'}
                    </button>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {locale === 'ru' ? 'Личный ментор' : locale === 'ky' ? 'Жеке ментор' : 'Personal mentor'}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {locale === 'ru' ? 'Сертификат по окончании' : locale === 'ky' ? 'Аяктагандан кийин сертификат' : 'Certificate upon completion'}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {locale === 'ru' ? 'Доступ к материалам навсегда' : locale === 'ky' ? 'Материалдарга түбөлүккө жетүү' : 'Lifetime access to materials'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                      {locale === 'ru' ? 'Статистика курса' : locale === 'ky' ? 'Курстун статистикасы' : 'Course stats'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {locale === 'ru' ? 'Студентов' : locale === 'ky' ? 'Студенттер' : 'Students'}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {course.enrolledStudents}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {locale === 'ru' ? 'Уроков' : locale === 'ky' ? 'Сабактар' : 'Lessons'}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {course._count.lessons}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {locale === 'ru' ? 'Отзывов' : locale === 'ky' ? 'Пикирлер' : 'Reviews'}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {course.totalReviews}
                        </span>
                      </div>
                      {course.rating > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {locale === 'ru' ? 'Рейтинг' : locale === 'ky' ? 'Рейтинг' : 'Rating'}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            {course.rating.toFixed(1)}
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
