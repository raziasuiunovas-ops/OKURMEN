'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, BookOpen, Users, TrendingUp, Award, Calendar, Star, GraduationCap, Code, Palette, Globe, Brain, Zap } from 'lucide-react';
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

// Мапинг иконок курсов (вместо emoji используем lucide-react)
const courseIcons: Record<string, any> = {
  'computer-literacy': Code,
  'ai-web-developer': Brain,
  'english-course': Globe,
  'aem-audio-video': Palette,
  'ai-video-creation': Zap,
  'frontend-development': Code,
  'backend-python': Code,
  'default': GraduationCap,
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-300 rounded-full blur-3xl"></div>
        </div>
        
        <Container>
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
      <section className="py-8 sticky top-0 bg-white/80 backdrop-blur-lg z-40 border-b">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === level
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <Card key={i} className="h-[500px] animate-pulse bg-gray-200">
                  <div />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => {
                const gradient = course.coverGradient || { from: '#3B82F6', to: '#06B6D4' };
                const IconComponent = courseIcons[course.slug] || courseIcons.default;
                
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

                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {course.translation.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-3 flex-1">
                        {course.translation.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                        {course.totalHours > 0 && (
                          <div className="text-center">
                            <Clock className="w-5 h-5 mx-auto mb-1 text-primary-600" />
                            <div className="text-sm font-bold text-gray-900">{course.totalHours}ч</div>
                            <div className="text-xs text-gray-500">{locale === 'ru' ? 'Часов' : locale === 'ky' ? 'Саат' : 'Hours'}</div>
                          </div>
                        )}
                        {course._count.lessons > 0 && (
                          <div className="text-center">
                            <BookOpen className="w-5 h-5 mx-auto mb-1 text-accent-600" />
                            <div className="text-sm font-bold text-gray-900">{course._count.lessons}</div>
                            <div className="text-xs text-gray-500">{locale === 'ru' ? 'Уроков' : locale === 'ky' ? 'Сабак' : 'Lessons'}</div>
                          </div>
                        )}
                        {course.enrolledStudents > 0 && (
                          <div className="text-center">
                            <Users className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                            <div className="text-sm font-bold text-gray-900">{course.enrolledStudents}</div>
                            <div className="text-xs text-gray-500">{locale === 'ru' ? 'Студентов' : locale === 'ky' ? 'Студент' : 'Students'}</div>
                          </div>
                        )}
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <div className="text-3xl font-bold text-primary-600">
                            {course.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">{locale === 'ru' ? 'сом' : locale === 'ky' ? 'сом' : 'KGS'}</div>
                        </div>
                        <Button
                          variant="primary"
                          size="md"
                          className="btn-enhanced"
                        >
                          {locale === 'ru' ? 'Записаться' : locale === 'ky' ? 'Жазылуу' : 'Enroll'}
                        </Button>
                      </div>

                      {/* Format Badge */}
                      {course.duration && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
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
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {locale === 'ru' ? 'Курсы не найдены' : locale === 'ky' ? 'Курстар табылган жок' : 'No courses found'}
              </h3>
              <p className="text-gray-600">
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
