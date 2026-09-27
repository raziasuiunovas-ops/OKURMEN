'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Calendar,
  BookOpen,
  Trophy,
  ArrowLeft,
  TrendingUp,
  Award,
} from 'lucide-react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  dailyProgress: Array<{
    date: string;
    lessonsWatched: number;
    tokensEarned: number;
    isCompleted: boolean;
  }>;
}

export default function StreakPage() {
  const [data, setData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:3002/api/student/streak', {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { weekday: 'long' });
  };

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
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к дашборду
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Твой прогресс-страйк
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Отслеживай свой ежедневный прогресс обучения
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Flame className="w-8 h-8" />
            <div className="text-right">
              <div className="text-sm opacity-90">Текущий страйк</div>
              <div className="text-4xl font-bold">{data.currentStreak}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            {data.currentStreak === 1 ? 'день' : data.currentStreak < 5 ? 'дня' : 'дней'} подряд
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <div className="text-right">
              <div className="text-sm opacity-90">Лучший страйк</div>
              <div className="text-4xl font-bold">{data.longestStreak}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            {data.longestStreak === 1 ? 'день' : data.longestStreak < 5 ? 'дня' : 'дней'} максимум
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <div className="text-right">
              <div className="text-sm opacity-90">Всего дней</div>
              <div className="text-4xl font-bold">{data.totalDays}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">дней активности</div>
        </div>
      </div>

      {/* Motivation Banner */}
      {data.currentStreak > 0 && (
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4">
            <Award className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Отличная работа!</h2>
              <p className="text-white/90">
                Ты занимаешься уже {data.currentStreak}{' '}
                {data.currentStreak === 1 ? 'день' : data.currentStreak < 5 ? 'дня' : 'дней'} подряд!
                Продолжай в том же духе! 🎉
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Daily Progress */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          История активности
        </h2>

        {data.dailyProgress.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Пока нет активности
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Начни смотреть уроки, чтобы отслеживать свой прогресс
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Перейти к курсам
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data.dailyProgress.map((day, index) => (
              <div
                key={day.date}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all ${
                  day.isCompleted
                    ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/10'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        day.isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white capitalize">
                        {getDayName(day.date)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(day.date)}
                      </div>
                    </div>
                  </div>

                  {day.isCompleted && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                      <Flame className="w-4 h-4" />
                      День засчитан
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {day.lessonsWatched}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {day.lessonsWatched === 1 ? 'урок' : day.lessonsWatched < 5 ? 'урока' : 'уроков'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {day.tokensEarned}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {day.tokensEarned === 1 ? 'токен' : day.tokensEarned < 5 ? 'токена' : 'токенов'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
