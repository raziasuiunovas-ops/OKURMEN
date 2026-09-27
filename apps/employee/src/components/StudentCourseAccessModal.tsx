'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Lock,
  Unlock,
  Loader2,
  AlertCircle,
  Shield,
  Star,
  Users,
  Clock,
  Code,
  Brain,
  GraduationCap,
  Film,
  Wrench,
  Globe,
  Zap,
  Sparkles,
  TrendingUp,
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
  enrolledStudents: number;
  totalHours: number;
  duration: string;
  hasAccess: boolean; // У студента есть доступ
}

interface Props {
  studentId: string;
  studentName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentCourseAccessModal({ studentId, studentName, onClose, onSuccess }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [filter, setFilter] = useState<'all' | 'granted' | 'locked'>('all');

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      // Проверяем разрешение ментора
      const permissionRes = await fetch('http://localhost:3002/api/mentor/permissions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const permissionData = await permissionRes.json();
      
      if (permissionData.success) {
        const canManage = permissionData.data.some(
          (p: any) => p.permissionType === 'MANAGE_STUDENT_COURSES' && p.isActive
        );
        setHasPermission(canManage);
      }

      // Получаем курсы с информацией о доступе студента
      const coursesRes = await fetch(
        `http://localhost:3002/api/mentor/students/${studentId}/courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const coursesData = await coursesRes.json();

      if (coursesData.success) {
        setCourses(coursesData.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccess = async (courseId: string, currentAccess: boolean) => {
    if (!hasPermission) {
      alert('У вас нет разрешения на управление курсами студентов');
      return;
    }

    setToggling(courseId);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch(
        `http://localhost:3002/api/mentor/students/${studentId}/courses/${courseId}/toggle`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: currentAccess ? 'revoke' : 'grant',
          }),
        }
      );

      const result = await response.json();
      
      if (result.success) {
        // Обновляем локальное состояние
        setCourses(prevCourses =>
          prevCourses.map(course =>
            course.id === courseId
              ? { ...course, hasAccess: !currentAccess }
              : course
          )
        );
        onSuccess();
      } else {
        alert(result.error || 'Ошибка при изменении доступа');
      }
    } catch (error) {
      console.error('Failed to toggle access:', error);
      alert('Ошибка при изменении доступа');
    } finally {
      setToggling(null);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'granted') return course.hasAccess;
    if (filter === 'locked') return !course.hasAccess;
    return true;
  });

  const grantedCount = courses.filter(c => c.hasAccess).length;
  const lockedCount = courses.filter(c => !c.hasAccess).length;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Управление курсами студента
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {studentName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Permission Warning */}
          {!hasPermission && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Нет разрешения</p>
                  <p>
                    У вас нет разрешения на управление курсами студентов. 
                    Запросите разрешение в разделе{' '}
                    <a href="/employee/permissions" className="underline font-medium">
                      Разрешения
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Все курсы ({courses.length})
            </button>
            <button
              onClick={() => setFilter('granted')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                filter === 'granted'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Открыто ({grantedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                filter === 'locked'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Lock className="w-4 h-4" />
              Закрыто ({lockedCount})
            </button>
          </div>
        </div>

        {/* Courses List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'granted' && 'Нет открытых курсов'}
                {filter === 'locked' && 'Нет закрытых курсов'}
                {filter === 'all' && 'Курсы не найдены'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((course) => {
                const gradient = course.coverGradient || { from: '#3B82F6', to: '#06B6D4' };
                const isToggling = toggling === course.id;
                const IconComponent = course.icon ? ICON_MAP[course.icon] || BookOpen : BookOpen;

                return (
                  <div
                    key={course.id}
                    className={`rounded-xl border-2 overflow-hidden transition-all ${
                      course.hasAccess
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    {/* Cover */}
                    <div
                      className="h-24 relative"
                      style={
                        course.coverImage
                          ? { backgroundImage: `url(${course.coverImage})`, backgroundSize: 'cover' }
                          : { background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }
                      }
                    >
                      {!course.coverImage && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent className="w-12 h-12 text-white drop-shadow-lg" strokeWidth={1.5} />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        {course.hasAccess ? (
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Открыт
                          </div>
                        ) : (
                          <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Закрыт
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Level Badge */}
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${
                        course.level === 'BEGINNER'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : course.level === 'INTERMEDIATE'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {course.level === 'BEGINNER' ? 'Начальный' : course.level === 'INTERMEDIATE' ? 'Средний' : 'Продвинутый'}
                      </span>

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{course.enrolledStudents}</span>
                        </div>
                        {course.totalHours > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{course.totalHours}ч</span>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-sm font-bold text-primary-600">
                        {course.price.toLocaleString()} сом
                      </div>

                      {/* Toggle Button */}
                      <button
                        onClick={() => toggleAccess(course.id, course.hasAccess)}
                        disabled={!hasPermission || isToggling}
                        className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          course.hasAccess
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isToggling ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Обработка...
                          </>
                        ) : course.hasAccess ? (
                          <>
                            <Lock className="w-4 h-4" />
                            Закрыть доступ
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4" />
                            Открыть доступ
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
