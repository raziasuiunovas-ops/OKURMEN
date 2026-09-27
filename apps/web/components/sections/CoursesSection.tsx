'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Clock, Users, ArrowRight, Star, GraduationCap, Code, Palette, Globe, Brain, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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

// Иконки курсов (вместо emoji используем lucide-react)
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

export default function CoursesSection() {
  const t = useTranslations('courses');
  const locale = useLocale();
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses?limit=4&language=${locale.toUpperCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setCourses(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [locale]);

  return (
    <section 
      id="courses" 
      ref={ref}
      className={`py-20 bg-white dark:bg-slate-900 ${
        isVisible ? 'section-transition visible' : 'section-transition'
      }`}
    >
      <Container>
        <div className={`text-center mb-16 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200/50 dark:border-primary-800/50 mb-4">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">
              Наши курсы
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            {t('description')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700">
                <div></div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {courses.map((course, index) => {
              const gradient = course.coverGradient || { from: '#3B82F6', to: '#06B6D4' };
              const IconComponent = courseIcons[course.slug] || courseIcons.default;
              
              return (
                <Card
                  key={course.id}
                  hover
                  variant="glass"
                  className={`group relative overflow-hidden border border-gray-200 dark:border-gray-700 ${
                    isVisible ? 'stagger-item' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Course Icon with Premium Gradient */}
                  {course.coverImage ? (
                    <div className="w-full h-32 rounded-xl mb-4 overflow-hidden">
                      <img
                        src={course.coverImage}
                        alt={course.translation.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full h-32 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-all duration-500 relative overflow-hidden shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20"></div>
                      <IconComponent className="w-16 h-16 text-white relative z-10" strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Course Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
                      {course.translation.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {course.translation.description}
                    </p>

                    {/* Price */}
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      {course.price.toLocaleString()} {locale === 'ru' ? 'сом' : locale === 'ky' ? 'сом' : 'KGS'}
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {/* Rating */}
                      {course.rating > 0 && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-gray-900 dark:text-white">{course.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">
                            ({course.totalReviews} {locale === 'ru' ? 'отзывов' : locale === 'ky' ? 'пикир' : 'reviews'})
                          </span>
                        </div>
                      )}
                      
                      {/* Duration and lessons */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {course.totalHours > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{course.totalHours}ч</span>
                          </div>
                        )}
                        {course._count.lessons > 0 && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{course._count.lessons} {locale === 'ru' ? 'уроков' : locale === 'ky' ? 'сабак' : 'lessons'}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Students count */}
                      {course.enrolledStudents > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Users className="w-3 h-3" />
                          <span>{course.enrolledStudents} {locale === 'ru' ? 'студентов' : locale === 'ky' ? 'студент' : 'students'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Badge */}
                  {course.isActive && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Активен
                    </div>
                  )}

                  {/* Popular Badge */}
                  {course.rating >= 4.5 && course.totalReviews >= 5 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {locale === 'ru' ? 'Популярный' : locale === 'ky' ? 'Популярдуу' : 'Popular'}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link href={`/${locale}/courses`}>
            <Button
              variant="primary"
              size="lg"
              className="group"
            >
              <span className="flex items-center gap-2">
                {locale === 'ru' ? 'Смотреть все курсы' : locale === 'ky' ? 'Бардык курстарды көрүү' : 'View All Courses'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
