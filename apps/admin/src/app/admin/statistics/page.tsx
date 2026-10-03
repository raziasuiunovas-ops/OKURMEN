'use client';

import React, { useState, useEffect } from 'react';
import { Save, TrendingUp, Calendar, Eye, EyeOff } from 'lucide-react';
import { getApiUrl } from '@/config/api';

type PeriodType = 'MONTH' | 'YEAR' | 'ALL_TIME';
type MetricType = 'NEW_STUDENTS' | 'NEW_APPLICATIONS' | 'COMPLETED_APPLICATIONS' | 'NEW_PAYMENTS' | 'TOTAL_PAYMENT_AMOUNT' | 'NEW_REVIEWS' | 'NEW_BOOKINGS' | 'TOTAL_STUDENTS' | 'ACTIVE_STUDENTS' | 'TOTAL_COURSES' | 'ACTIVE_COURSES' | 'TOTAL_EMPLOYEES' | 'ACTIVE_EMPLOYEES' | 'TOTAL_GROUPS' | 'TOTAL_LESSONS' | 'TOTAL_ALUMNI';

interface MetricDefinition {
  key: MetricType;
  label: string;
  description: string;
  isPeriodBased: boolean;
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
  { key: 'TOTAL_GROUPS', label: 'Всего групп', description: 'Текущее количество групп', isPериodBased: false },
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
  
  const [calculatedStats, setCalculatedStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
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

  if (loading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Управление статистикой</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Настройте период и показатели для отображения на сайте</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 font-medium">
          <Save className="w-5 h-5" />{saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-orange-500" /><h2 className="text-lg font-bold text-gray-900 dark:text-white">Период</h2></div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Тип периода</label>
                <select value={settings.periodType} onChange={(e) => setSettings({ ...settings, periodType: e.target.value as PeriodType })} className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white">
                  <option value="MONTH">За месяц</option>
                  <option value="YEAR">За год</option>
                  <option value="ALL_TIME">За всё время</option>
                </select>
              </div>
              {settings.periodType === 'MONTH' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Месяц</label>
                  <select value={settings.month || 1} onChange={(e) => setSettings({ ...settings, month: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white">
                    {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                  </select>
                </div>
              )}
              {(settings.periodType === 'MONTH' || settings.periodType === 'YEAR') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Год</label>
                  <input type="number" value={settings.year} onChange={(e) => setSettings({ ...settings, year: parseInt(e.target.value) })} min="2020" max="2099" className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white" />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">{settings.isPublished ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-400" />}<h2 className="text-lg font-bold text-gray-900 dark:text-white">Публикация</h2></div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isPublished" checked={settings.isPublished} onChange={(e) => setSettings({ ...settings, isPublished: e.target.checked })} className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
              <label htmlFor="isPublished" className="text-sm text-gray-700 dark:text-gray-300">Отображать статистику на сайте</label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-orange-500" /><h2 className="text-lg font-bold text-gray-900 dark:text-white">Показатели за период</h2></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Эти показатели считаются за выбранный период</p>
            <div className="space-y-3">
              {AVAILABLE_METRICS.filter(m => m.isPeriodBased).map(metric => {
                const isEnabled = settings.enabledMetrics.includes(metric.key);
                const statValue = calculatedStats[metric.key];
                return (
                  <div key={metric.key} className={`p-4 rounded-xl border-2 transition-all ${isEnabled ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={isEnabled} onChange={() => toggleMetric(metric.key)} className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 dark:text-white">{metric.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</div>
                        {isEnabled && statValue !== undefined && <div className="text-sm mt-1 text-orange-600 dark:text-orange-400 font-bold">Значение: {statValue.toLocaleString()}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Текущие показатели</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Эти показатели не зависят от периода</p>
            <div className="space-y-3">
              {AVAILABLE_METRICS.filter(m => !m.isPeriodBased).map(metric => {
                const isEnabled = settings.enabledMetrics.includes(metric.key);
                const statValue = calculatedStats[metric.key];
                return (
                  <div key={metric.key} className={`p-4 rounded-xl border-2 transition-all ${isEnabled ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={isEnabled} onChange={() => toggleMetric(metric.key)} className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 dark:text-white">{metric.label}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</div>
                        {isEnabled && statValue !== undefined && <div className="text-sm mt-1 text-orange-600 dark:text-orange-400 font-bold">Значение: {statValue.toLocaleString()}</div>}
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
