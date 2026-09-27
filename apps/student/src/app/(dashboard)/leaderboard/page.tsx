'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Flame, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  totalTokens: number;
  isCurrentUser: boolean;
}

type Period = 'today' | 'month' | 'all';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
          ?.split('=')[1];

        const response = await fetch(
          `http://localhost:3002/api/student/leaderboard?period=${period}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setLeaderboard(result.data);
        } else {
          setLeaderboard([]);
        }
      } catch (error) {
        console.error('Leaderboard fetch error:', error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
    return 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Рейтинг студентов
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Соревнуйся с другими студентами и зарабатывай ОКУРМЭН токены
        </p>
      </div>

      {/* Period Filter */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setPeriod('today')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              period === 'today'
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Сегодня
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              period === 'month'
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              period === 'all'
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Всё время
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Пока нет данных
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Начни зарабатывать токены, проходя уроки
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top 3 */}
          {Array.isArray(leaderboard) && leaderboard.slice(0, 3).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {leaderboard.slice(0, 3).map((entry) => (
                <div
                  key={entry.userId}
                  className={`relative ${
                    entry.isCurrentUser
                      ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900'
                      : ''
                  }`}
                >
                  <div className={`rounded-2xl p-6 text-center ${
                    entry.rank === 1
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                      : entry.rank === 2
                      ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                      : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                  }`}>
                    <div className="mb-4">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="text-4xl font-bold mb-2">#{entry.rank}</div>
                    <div className="font-bold text-lg mb-1">{entry.userName}</div>
                    <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                      <Flame className="w-4 h-4" />
                      <span>{entry.totalTokens} токенов</span>
                    </div>
                    {entry.isCurrentUser && (
                      <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Ты
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rest of leaderboard */}
          {Array.isArray(leaderboard) && leaderboard.slice(3).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.slice(3).map((entry) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-4 transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {/* Rank */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankBadgeColor(
                        entry.rank
                      )}`}
                    >
                      {entry.rank}
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {entry.userName}
                        {entry.isCurrentUser && (
                          <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full">
                            Ты
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tokens */}
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span>{entry.totalTokens}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
