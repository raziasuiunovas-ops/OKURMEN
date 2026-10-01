'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Disable SSR for this page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface Stats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  pendingApplications: number;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Загружаем реальные данные из API
      const [coursesRes, siteStatsRes, applicationsRes] = await Promise.all([
        fetch('http://localhost:3002/api/courses', { credentials: 'include' }),
        fetch('http://localhost:3002/api/site-stats', { credentials: 'include' }),
        fetch('http://localhost:3002/api/applications', { credentials: 'include' }),
      ]);

      // Проверяем response перед парсингом JSON
      if (!coursesRes.ok || !siteStatsRes.ok || !applicationsRes.ok) {
        throw new Error('API request failed');
      }

      const courses = await coursesRes.json();
      const siteStats = await siteStatsRes.json();
      const applications = await applicationsRes.json();

      // Реальные данные из БД
      setStats({
        totalCourses: courses.data?.length || 0,
        totalStudents: siteStats.data?.totalStudents || 0,
        totalRevenue: 0, // Пока нет платежей, доход = 0
        pendingApplications: applications.data?.filter((a: any) => a.status === 'PENDING').length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // При ошибке показываем 0
      setStats({
        totalCourses: 0,
        totalStudents: 0,
        totalRevenue: 0,
        pendingApplications: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Графики временно убраны - будут добавлены с реальными данными позже

  const statCards = [
    {
      title: 'Всего курсов',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Студентов',
      value: stats.totalStudents,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Доход',
      value: `${stats.totalRevenue.toLocaleString()} сом`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Заявки',
      value: stats.pendingApplications,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2">{t('dashboard.title')}</h1>
          <p className="text-orange-50 text-lg">
            Добро пожаловать в систему управления ОКУРМЭН
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${card.bgColor} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  {card.value}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section - будет добавлено позже с реальными данными */}

      {/* Quick Actions */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Быстрые действия
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/admin/courses'}
            className="group px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 font-bold"
          >
            <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Добавить курс</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/employees'}
            className="px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 font-bold"
          >
            <Users className="w-5 h-5" />
            <span>Добавить сотрудника</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/applications'}
            className="px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 font-bold"
          >
            <FileText className="w-5 h-5" />
            <span>Просмотреть заявки</span>
          </button>
        </div>
      </div>
    </div>
  );
}
