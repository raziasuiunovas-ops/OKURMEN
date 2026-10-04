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
      value: `${stats.totalRevenue.toLocaleString()} ${t('dashboard.som')}`,
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
      <div className="flex items-center justify-center py-8 min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-blue-500 rounded-xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{t('dashboard.title')}</h1>
          <p className="text-orange-50 text-xs sm:text-sm md:text-base">
            Добро пожаловать в систему управления ОКУРМЭН
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200 overflow-hidden min-w-0"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className={`p-2 sm:p-2.5 rounded-lg ${card.bgColor} shadow-sm flex-shrink-0`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.textColor}`} />
                  </div>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-0.5 truncate">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3">
          Быстрые действия
        </h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          <button 
            onClick={() => window.location.href = '/admin/courses'}
            className="group px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 font-medium text-xs sm:text-sm min-h-[44px]"
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Добавить курс</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/employees'}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2 font-medium text-xs sm:text-sm min-h-[44px]"
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Добавить сотрудника</span>
          </button>
          <button 
            onClick={() => window.location.href = '/admin/applications'}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2 font-medium text-xs sm:text-sm min-h-[44px] xs:col-span-2 lg:col-span-1"
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Просмотреть заявки</span>
          </button>
        </div>
      </div>
    </div>
  );
}
