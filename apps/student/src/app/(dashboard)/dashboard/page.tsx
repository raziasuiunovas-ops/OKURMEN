'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Trophy,
  Flame,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight,
  Play,
} from 'lucide-react';

interface DashboardData {
  student: {
    fullName: string;
    email: string;
  };
  courses: Array<{
    id: string;
    title: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
  }>;
  stats: {
    totalTokens: number;
    tokensToday: number;
    streak: number;
    leaderboardPosition: number;
    activeCourses: number;
  };
  upcomingBooking: {
    date: string;
    mentorName: string;
  } | null;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log('=== STUDENT DASHBOARD FETCH ===');
        
        // Получаем токен из localStorage (как в layout)
        const token = localStorage.getItem('auth-token');
        console.log('Token exists:', !!token);
        console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null');
        
        if (!token) {
          console.log('❌ No token - redirecting to signin');
          window.location.href = '/auth/signin?callbackUrl=/dashboard';
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const fullUrl = `${apiUrl}/api/student/dashboard`;
        console.log('API URL:', apiUrl);
        console.log('Full request URL:', fullUrl);
        
        const response = await fetch(fullUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        // Проверяем что ответ - JSON, а не HTML
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          console.error('❌ Received non-JSON response');
          const text = await response.text();
          console.error('Response body (first 500 chars):', text.substring(0, 500));
          
          if (response.status === 401 || response.status === 403) {
            console.log('Unauthorized - clearing token and redirecting');
            localStorage.removeItem('auth-token');
            window.location.href = '/auth/signin?callbackUrl=/dashboard';
          }
          return;
        }

        const result = await response.json();
        console.log('Response JSON:', result);
        
        if (result.success) {
          console.log('✅ Dashboard loaded successfully');
          setData(result.data);
        } else {
          console.error('❌ Response not successful:', result);
          // Если API вернул ошибку авторизации - редирект
          if (response.status === 401 || response.status === 403) {
            console.log('Unauthorized - clearing token and redirecting');
            localStorage.removeItem('auth-token');
            window.location.href = '/auth/signin?callbackUrl=/dashboard';
          }
        }
      } catch (error) {
        console.error('❌ Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Не удалось загрузить данные</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <span>Привет, {data.student.fullName}!</span>
          {data.stats.streak > 0 && (
            <Link 
              href="/streak" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all text-lg"
            >
              <Flame className="w-5 h-5" />
              {data.stats.streak} {data.stats.streak === 1 ? 'день' : data.stats.streak < 5 ? 'дня' : 'дней'} подряд
            </Link>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Добро пожаловать в твою учебную зону
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tokens */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white card-shadow">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8" />
            <div className="text-right">
              <div className="text-sm opacity-90">Всего токенов</div>
              <div className="text-3xl font-bold">{data.stats.totalTokens}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            +{data.stats.tokensToday} сегодня
          </div>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white card-shadow">
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8" />
            <div className="text-right">
              <div className="text-sm opacity-90">Дней подряд</div>
              <div className="text-3xl font-bold">{data.stats.streak}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            Продолжай в том же духе!
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white card-shadow">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <div className="text-right">
              <div className="text-sm opacity-90">Место в рейтинге</div>
              <div className="text-3xl font-bold">#{data.stats.leaderboardPosition}</div>
            </div>
          </div>
          <Link
            href="/leaderboard"
            className="text-sm opacity-90 hover:opacity-100 flex items-center gap-1"
          >
            Смотреть рейтинг <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Active Courses */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white card-shadow">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8" />
            <div className="text-right">
              <div className="text-sm opacity-90">Активных курсов</div>
              <div className="text-3xl font-bold">{data.stats.activeCourses}</div>
            </div>
          </div>
          <Link
            href="/courses"
            className="text-sm opacity-90 hover:opacity-100 flex items-center gap-1"
          >
            Перейти к курсам <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Progress Banner */}
      {data.courses.length > 0 && (
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white card-shadow">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Продолжай обучение</h2>
              <p className="text-white/90 mb-4">
                {data.courses[0].title}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Прогресс</span>
                  <span className="font-bold">{data.courses[0].progress}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${data.courses[0].progress}%` }}
                  />
                </div>
                <div className="text-sm text-white/80">
                  {data.courses[0].completedLessons} из {data.courses[0].totalLessons} уроков завершено
                </div>
              </div>
            </div>
            <Link
              href={`/courses/${data.courses[0].id}`}
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Play className="w-5 h-5" />
              Продолжить
            </Link>
          </div>
        </div>
      )}

      {/* Upcoming Booking */}
      {data.upcomingBooking && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Ближайший урок с ментором
              </h3>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(data.upcomingBooking.date).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(data.upcomingBooking.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Ментор: {data.upcomingBooking.mentorName}
              </p>
            </div>
            <Link
              href="/bookings"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Подробнее
            </Link>
          </div>
        </div>
      )}

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Мои курсы</h2>
          <Link
            href="/courses"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            Все курсы <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {data.courses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              У тебя пока нет активных курсов
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Обратись к администратору для записи на курс
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.courses.slice(0, 3).map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">{course.progress}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">прогресс</div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h3>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="progress-bar"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {course.completedLessons}/{course.totalLessons} уроков
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
