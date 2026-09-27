'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Lock, 
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  Code,
  Brain,
  GraduationCap,
  Film,
  Wrench,
  Globe,
  Zap,
  LucideIcon,
} from 'lucide-react';

// Маппинг строковых имён на компоненты иконок
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Brain,
  GraduationCap,
  Film,
  Wrench,
  Globe,
  Zap,
  Sparkles,
  BookOpen,
  Users,
  Star,
  TrendingUp,
};

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  price: number;
  coverGradient: { from: string; to: string } | null;
  coverImage: string | null;
  icon: string | null;
  rating: number;
  totalReviews: number;
  enrolledStudents: number;
  totalHours: number;
  duration: string;
  // Enrollment info
  hasAccess: boolean;
  enrollmentStatus: string | null;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my'>('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:3002/api/student/courses/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error('Courses fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const myCourses = courses.filter(c => c.hasAccess);
  const filteredCourses = filter === 'my' ? myCourses : courses;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Курсы</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Всего курсов: {courses.length} • Мои курсы: {myCourses.length}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500'
          }`}
        >
          Все курсы ({courses.length})
        </button>
        <button
          onClick={() => setFilter('my')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            filter === 'my'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500'
          }`}
        >
          Мои курсы ({myCourses.length})
        </button>
      </div>

      {/* Info Banner for locked courses */}
      {filter === 'all' && myCourses.length < courses.length && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Доступ к курсам</p>
              <p className="mt-1">
                Курсы с замком 🔒 недоступны. Обратись к администратору, чтобы получить доступ к нужному курсу.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <BookOpen className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {filter === 'my' ? 'У тебя пока нет активных курсов' : 'Курсы не найдены'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'my' 
              ? 'Обратись к администратору для записи на курс'
              : 'Скоро здесь появятся новые курсы'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const gradient = course.coverGradient || { from: '#3B82F6', to: '#06B6D4' };
            const hours = course.totalHours || 0;
            const IconComponent = course.icon ? ICON_MAP[course.icon] || BookOpen : BookOpen;

            return (
              <div
                key={course.id}
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl ${
                  course.hasAccess ? 'hover:border-primary-500 hover:-translate-y-1' : 'opacity-75'
                }`}
              >
                {/* Cover with gradient or image */}
                <div
                  className="h-40 relative overflow-hidden"
                  style={
                    course.coverImage
                      ? { backgroundImage: `url(${course.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }
                  }
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
                  
                  {/* Icon (if gradient mode) */}
                  {!course.coverImage && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconComponent className="w-20 h-20 text-white drop-shadow-2xl" strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Access Badge */}
                  <div className="absolute top-3 right-3">
                    {course.hasAccess ? (
                      <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Открыт
                      </div>
                    ) : (
                      <div className="bg-gray-900/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Закрыт
                      </div>
                    )}
                  </div>

                  {/* Progress Badge (if enrolled) */}
                  {course.hasAccess && course.progress > 0 && (
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white">
                      {course.progress}%
                    </div>
                  )}

                  {/* Trending Badge */}
                  {course.rating >= 4.5 && (
                    <div className="absolute bottom-3 left-3 bg-orange-500/90 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Популярный
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* Level Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      course.level === 'BEGINNER'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : course.level === 'INTERMEDIATE'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {course.level === 'BEGINNER' ? 'Начальный' : course.level === 'INTERMEDIATE' ? 'Средний' : 'Продвинутый'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Progress Bar (if enrolled) */}
                  {course.hasAccess && course.totalLessons > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Прогресс</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {course.completedLessons}/{course.totalLessons} уроков
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-700">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(course.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-gray-600 dark:text-gray-400 font-medium">
                        {course.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Students */}
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{course.enrolledStudents}</span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {hours > 0 ? `${hours} часов` : 'TBD'}
                        </div>
                        <div className="text-xs">Длительность</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-4 h-4 text-primary-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {course.duration || 'TBD'}
                        </div>
                        <div className="text-xs">Период</div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary-600">
                        {course.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">сом</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {course.hasAccess ? (
                    <Link
                      href={`/courses/${course.id}`}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-lg transition-all text-center font-medium"
                    >
                      {course.progress > 0 ? 'Продолжить обучение' : 'Начать обучение'}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    >
                      <Lock className="w-5 h-5" />
                      Доступ закрыт
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
