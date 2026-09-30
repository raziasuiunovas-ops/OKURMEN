'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface SiteStats {
  id?: string;
  totalStudents: number;
  employmentRate: number;
}

export default function SiteStatsPage() {
  const [stats, setStats] = useState<SiteStats>({
    totalStudents: 0,
    employmentRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/admin/site-stats`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/admin/site-stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
        credentials: 'include',
      });

      if (response.ok) {
        alert('Статистика успешно сохранена');
      } else {
        alert('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error saving stats:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          Статистика сайта
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg">
          Управление статистикой, отображаемой на главной странице
        </p>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 max-w-2xl border border-slate-200/50 dark:border-slate-700/50">
        <div className="space-y-6">
          {/* Количество студентов */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Общее количество студентов
            </label>
            <input
              type="number"
              value={stats.totalStudents}
              onChange={(e) => setStats({ ...stats, totalStudents: parseInt(e.target.value) || 0 })}
              className="w-full px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 text-lg font-bold"
              min="0"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              На главной странице отобразится: <strong className="text-orange-600 dark:text-orange-400">{stats.totalStudents >= 1000 ? `${Math.floor(stats.totalStudents / 1000)}K+` : `${stats.totalStudents}+`}</strong>
            </p>
          </div>

          {/* Процент трудоустройства */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Процент трудоустройства
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={stats.employmentRate}
                onChange={(e) => setStats({ ...stats, employmentRate: parseInt(e.target.value) || 0 })}
                className="flex-1 px-5 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 text-lg font-bold"
                min="0"
                max="100"
              />
              <span className="text-3xl font-black text-slate-900 dark:text-white">%</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              На главной странице отобразится: <strong className="text-orange-600 dark:text-orange-400">{stats.employmentRate}%</strong>
            </p>
          </div>

          {/* Кнопка сохранения */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-2xl transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
