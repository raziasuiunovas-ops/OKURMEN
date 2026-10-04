'use client';

import React, { useState, useEffect } from 'react';
import { Save, TrendingUp, Calendar, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { getApiUrl } from '@/config/api';

type PeriodType = 'MONTH' | 'YEAR' | 'ALL_TIME';
type MetricType = 'NEW_STUDENTS' | 'NEW_APPLICATIONS' | 'COMPLETED_APPLICATIONS' | 'NEW_PAYMENTS' | 'TOTAL_PAYMENT_AMOUNT' | 'NEW_REVIEWS' | 'NEW_BOOKINGS' | 'TOTAL_STUDENTS' | 'ACTIVE_STUDENTS' | 'TOTAL_COURSES' | 'ACTIVE_COURSES' | 'TOTAL_EMPLOYEES' | 'ACTIVE_EMPLOYEES' | 'TOTAL_GROUPS' | 'TOTAL_LESSONS' | 'TOTAL_ALUMNI';

interface MetricDefinition {
  key: MetricType;
  label: string;
  description: string;
  isPeriodBased: boolean;
}

interface SiteStats {
  id?: string;
  totalStudents: number;
  employmentRate: number;
}

const AVAILABLE_METRICS: MetricDefinition[] = [
  { key: 'NEW_STUDENTS', label: 'Новые студенты', description: 'Количество новых студентов за период', isPeriodBased: true },
  { key: 'NEW_APPLICATIONS', label: 'Новые заявки', description: 'Количество новых заявок за период', isPeriodBased: true },
  { key: 'COMPLETED_APPLICATIONS', label: 'Завершённые заявки', description: 'Количество подтверждённых заявок', isPeriodBased: true },
  { key: 'NEW_PAYMENTS', label: 'Новые оплаты', description: 'Количество новых оплат за период', isPeriodBased: true },
  { key: 'TOTAL_PAYMENT_AMOUNT', label: 'Сумма оплат (сом)', description: 'Общая сумма оплат за период', isPeriodBased: true },
  { key: 'NEW_REVIEWS', label: 'Новые отзывы', description: 'Количество новых отзывов', isPeriodBased: true },
  { key: 'NEW_BOOKINGS', label: 'Новые бронирования', description: 'Количество новых бронирований', isPeriodBased: true },
  { key: 'TOTAL_STUDENTS', label: 'Всего студентов', description: 'Текущее количество студентов', isPeriodBased: false },
  { key: 'ACTIVE_STUDENTS', label: 'Активные студенты', description: 'Количество активных студентов', isPeriodBased: false },
  { key: 'TOTAL_COURSES', label: 'Всего курсов', description: 'Текущее количество курсов', isPeriodBased: false },
  { key: 'ACTIVE_COURSES', label: 'Активные курсы', description: 'Количество активных курсов', isPeriodBased: false },
  { key: 'TOTAL_EMPLOYEES', label: 'Всего сотрудников', description: 'Текущее количество сотрудников', isPeriodBased: false },
  { key: 'ACTIVE_EMPLOYEES', label: 'Активные сотрудники', description: 'Количество активных сотрудников', isPeriodBased: false },
  { key: 'TOTAL_GROUPS', label: 'Всего групп', description: 'Текущее количество групп', isPeriodBased: false },
  { key: 'TOTAL_LESSONS', label: 'Всего уроков', description: 'Текущее количество уроков', isPeriodBased: false },
  { key: 'TOTAL_ALUMNI', label: 'Выпускники', description: 'Количество выпускников', isPeriodBased: false },
];

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export default function StatisticsPage() {
  const [settings, setSettings] = useState({
    periodType: 'ALL_TIME' as PeriodType,
    month: null as number | null,
    year: new Date().getFullYear(),
    enabledMetrics: [] as MetricType[],
    displayOrder: [] as Array<{ metric: MetricType; order: number }>,
    isPublished: true,
  });
  
  const [siteStats, setSiteStats] = useState<SiteStats>({
    totalStudents: 0,
    employmentRate: 0,
  });
  
  const [calculatedStats, setCalculatedStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSiteStats, setSavingSiteStats] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchSiteStats();
  }, []);

  useEffect(() => {
    if (!loading && settings.enabledMetrics.length > 0) {
      calculateStatistics();
    }
  }, [settings.periodType, settings.month, settings.year, settings.enabledMetrics]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(getApiUrl('api/statistics/settings'), {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSettings({ ...data.data, year: data.data.year || new Date().getFullYear() });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteStats = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/admin/site-stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSiteStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching site stats:', error);
    }
  };

  const calculateStatistics = async () => {
    try {
      const params = new URLSearchParams({ periodType: settings.periodType, metrics: settings.enabledMetrics.join(',') });
      if (settings.periodType === 'MONTH' && settings.month && settings.year) {
        params.append('month', settings.month.toString());
        params.append('year', settings.year.toString());
      } else if (settings.periodType === 'YEAR' && settings.year) {
        params.append('year', settings.year.toString());
      }
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${getApiUrl('api/statistics/calculate')}?${params}`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.stats) setCalculatedStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(getApiUrl('api/statistics/settings'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        alert('✅ Настройки сохранены');
        fetchSettings();
      } else {
        alert('❌ Ошибка сохранения');
      }
    } catch (error) {
      alert('❌ Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSiteStats = async () => {
    setSavingSiteStats(true);
    try {
      const token = localStorage.getItem('auth-token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/admin/site-stats`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(siteStats),
        credentials: 'include',
      });

      if (response.ok) {
        alert('✅ Статистика сайта сохранена');
        await fetchSiteStats(); // Перезагружаем данные после сохранения
      } else {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        alert('❌ Ошибка сохранения');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Ошибка');
    } finally {
      setSavingSiteStats(false);
    }
  };

  const toggleMetric = (metric: MetricType) => {
    const enabled = settings.enabledMetrics.includes(metric);
    if (enabled) {
      setSettings({
        ...settings,
        enabledMetrics: settings.enabledMetrics.filter(m => m !== metric),
        displayOrder: settings.displayOrder.filter(item => item.metric !== metric),
      });
    } else {
      setSettings({
        ...settings,
        enabledMetrics: [...settings.enabledMetrics, metric],
        displayOrder: [...settings.displayOrder, { metric, order: settings.enabledMetrics.length }],
      });
    }
  };

  if (loading) return <div className="flex items-center justify-center py-8 min-h-[50vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div></div>;

  return (
    <div className="space-y-3 sm:space-y-4 max-w-full overflow-x-hidden">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Управление статистикой</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">Настройте период и показатели для отображения на сайте</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 font-medium text-xs sm:text-sm flex-shrink-0 min-h-[44px]">
          <Save className="w-4 h-4 flex-shrink-0" /><span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
        </button>
      </div>

      {/* Site Stats Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white">Статистика главной страницы</h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">Эти данные отображаются на главной странице сайта</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Общее количество студентов
            </label>
            <input
              type="number"
              value={siteStats.totalStudents}
              onChange={(e) => setSiteStats({ ...siteStats, totalStudents: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 text-sm min-h-[44px]"
              min="0"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              На главной странице: <strong className="text-orange-500 dark:text-orange-400">{siteStats.totalStudents >= 1000 ? `${Math.floor(siteStats.totalStudents / 1000)}K+` : `${siteStats.totalStudents}+`}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Процент трудоустройства
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={siteStats.employmentRate}
                onChange={(e) => setSiteStats({ ...siteStats, employmentRate: parseInt(e.target.value) || 0 })}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 text-sm min-h-[44px]"
                min="0"
                max="100"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex-shrink-0">%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              На главной странице: <strong className="text-orange-500 dark:text-orange-400">{siteStats.employmentRate}%</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSiteStats}
          disabled={savingSiteStats}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 text-xs sm:text-sm min-h-[44px]"
        >
          <Save className="w-4 h-4 flex-shrink-0" />
          <span>{savingSiteStats ? 'Сохранение...' : 'Сохранить статистику сайта'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2 sm:mb-3"><Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" /><h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Период</h2></div>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Тип периода</label>
                <select value={settings.periodType} onChange={(e) => setSettings({ ...settings, periodType: e.target.value as PeriodType })} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white text-sm min-h-[44px]">
                  <option value="MONTH">За месяц</option>
                  <option value="YEAR">За год</option>
                  <option value="ALL_TIME">За всё время</option>
                </select>
              </div>
              {settings.periodType === 'MONTH' && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Месяц</label>
                  <select value={settings.month || 1} onChange={(e) => setSettings({ ...settings, month: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white text-sm min-h-[44px]">
                    {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                  </select>
                </div>
              )}
              {(settings.periodType === 'MONTH' || settings.periodType === 'YEAR') && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Год</label>
                  <input type="number" value={settings.year} onChange={(e) => setSettings({ ...settings, year: parseInt(e.target.value) })} min="2020" max="2099" className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:text-white text-sm min-h-[44px]" />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">{settings.isPublished ? <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />}<h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Публикация</h2></div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="isPublished" checked={settings.isPublished} onChange={(e) => setSettings({ ...settings, isPublished: e.target.checked })} className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5 flex-shrink-0" />
              <label htmlFor="isPublished" className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Отображать статистику на сайте</label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2 sm:mb-3"><TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" /><h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Показатели за период</h2></div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">Эти показатели считаются за выбранный период</p>
            <div className="space-y-2">
              {AVAILABLE_METRICS.filter(m => m.isPeriodBased).map(metric => {
                const isEnabled = settings.enabledMetrics.includes(metric.key);
                const statValue = calculatedStats[metric.key];
                return (
                  <div key={metric.key} className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${isEnabled ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-start gap-2">
                      <input type="checkbox" checked={isEnabled} onChange={() => toggleMetric(metric.key)} className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white break-words">{metric.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 break-words">{metric.description}</div>
                        {isEnabled && statValue !== undefined && <div className="text-xs mt-0.5 text-orange-500 dark:text-orange-400 font-medium">Значение: {statValue.toLocaleString()}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Текущие показатели</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">Эти показатели не зависят от периода</p>
            <div className="space-y-2">
              {AVAILABLE_METRICS.filter(m => !m.isPeriodBased).map(metric => {
                const isEnabled = settings.enabledMetrics.includes(metric.key);
                const statValue = calculatedStats[metric.key];
                return (
                  <div key={metric.key} className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${isEnabled ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-start gap-2">
                      <input type="checkbox" checked={isEnabled} onChange={() => toggleMetric(metric.key)} className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white break-words">{metric.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 break-words">{metric.description}</div>
                        {isEnabled && statValue !== undefined && <div className="text-xs mt-0.5 text-orange-500 dark:text-orange-400 font-medium">Значение: {statValue.toLocaleString()}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
