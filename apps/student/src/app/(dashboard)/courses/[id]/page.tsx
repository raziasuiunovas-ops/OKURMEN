'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Award,
  CheckCircle2,
  Lock,
  PlayCircle,
  BookOpen,
  Trophy,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  order: number;
  videoUrl: string | null;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  level: string;
  coverGradient: { from: string; to: string } | null;
  rating: number;
  totalReviews: number;
  totalDuration: number;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  modules: Module[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
          ?.split('=')[1];

        const response = await fetch(
          `http://localhost:3002/api/student/courses/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        if (result.success) {
          setCourse(result.data);
        } else {
          router.push('/courses');
        }
      } catch (error) {
        console.error('Course fetch error:', error);
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const gradient = course.coverGradient || { from: '#3B82F6', to: '#06B6D4' };
  const hours = Math.floor(course.totalDuration / 60);
  const minutes = course.totalDuration % 60;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Назад к курсам
      </Link>

      {/* Course Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Cover */}
        <div
          className="h-48 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30" />
          
          {/* Progress */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end justify-between">
                <div className="text-white">
                  <div className="text-sm opacity-90 mb-1">Прогресс курса</div>
                  <div className="text-3xl font-bold">{course.progress}%</div>
                </div>
                <div className="text-white text-right">
                  <div className="text-sm opacity-90">
                    {course.completedLessons} из {course.totalLessons} уроков
                  </div>
                </div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
              course.level === 'BEGINNER'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : course.level === 'INTERMEDIATE'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            }`}>
              {course.level === 'BEGINNER' ? 'Начальный' : course.level === 'INTERMEDIATE' ? 'Средний' : 'Продвинутый'}
            </span>
            
            {hours > 0 && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {hours > 0 && `${hours}ч`} {minutes > 0 && `${minutes}мин`}
                </span>
              </div>
            )}

            {course.rating > 0 && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({course.totalReviews} отзывов)
                </span>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {course.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {course.description}
          </p>
        </div>
      </div>

      {/* Modules & Lessons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-600" />
          Программа курса
        </h2>

        {course.modules.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Модули курса пока не добавлены
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {course.modules.map((module, moduleIndex) => (
              <div
                key={module.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Module Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Модуль {moduleIndex + 1}: {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {module.lessons.length} {module.lessons.length === 1 ? 'урок' : 'уроков'}
                  </p>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isAccessible = !lesson.isLocked;
                    const durationMin = Math.ceil(lesson.duration / 60);

                    return (
                      <div
                        key={lesson.id}
                        className={`px-6 py-4 transition-colors ${
                          isAccessible
                            ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            : 'opacity-60'
                        }`}
                      >
                        {isAccessible ? (
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="flex items-center gap-4"
                          >
                            {/* Status Icon */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              lesson.isCompleted
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'bg-primary-100 dark:bg-primary-900/30'
                            }`}>
                              {lesson.isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <PlayCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {lessonIndex + 1}. {lesson.title}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {durationMin} мин
                                </span>
                                {lesson.isCompleted && (
                                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <Trophy className="w-3 h-3" />
                                    +1 токен
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="text-gray-400">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-4">
                            {/* Lock Icon */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <Lock className="w-5 h-5 text-gray-400" />
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {lessonIndex + 1}. {lesson.title}
                              </h4>
                              <div className="text-sm text-gray-500 dark:text-gray-500">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {durationMin} мин • Заблокирован
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
