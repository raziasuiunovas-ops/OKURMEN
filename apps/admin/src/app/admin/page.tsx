'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  FileText,
  CreditCard,
  TrendingUp,
  Eye,
  DollarSign,
  Award,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
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
      // Загружаем данные для дашборда
      const [coursesRes, applicationsRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:3002/api/courses', { credentials: 'include' }),
        fetch('http://localhost:3002/api/applications', { credentials: 'include' }),
        fetch('http://localhost:3002/api/payments', { credentials: 'include' }),
      ]);

      const courses = await coursesRes.json();
      const applications = await applicationsRes.json();
      const payments = await paymentsRes.json();

      setStats({
        totalCourses: courses.data?.length || 0,
        totalStudents: applications.data?.length || 0,
        totalRevenue: payments.data?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
        pendingApplications: applications.data?.filter((a: any) => a.status === 'PENDING').length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Данные для графиков (примеры)
  const viewsData = [
    { month: 'Янв', views: 4200 },
    { month: 'Фев', views: 3800 },
    { month: 'Мар', views: 5100 },
    { month: 'Апр', views: 4600 },
    { month: 'Май', views: 6200 },
    { month: 'Июн', views: 7500 },
  ];

  const revenueData = [
    { month: 'Янв', revenue: 125000 },
    { month: 'Фев', revenue: 142000 },
    { month: 'Мар', revenue: 168000 },
    { month: 'Апр', revenue: 156000 },
    { month: 'Май', revenue: 189000 },
    { month: 'Июн', revenue: 215000 },
  ];

  const coursesData = [
    { name: 'Frontend', students: 45, color: '#FF6B35' },
    { name: 'Backend', students: 38, color: '#F7931E' },
    { name: 'Mobile', students: 28, color: '#FDB827' },
    { name: 'DevOps', students: 22, color: '#C69C6D' },
  ];

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
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
        <p className="text-orange-100">
          Добро пожаловать в систему управления Окурмэн
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {card.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Eye className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Просмотры курсов
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#F97316"
                strokeWidth={3}
                dot={{ fill: '#F97316', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <DollarSign className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Доход по месяцам
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Courses Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Award className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Распределение студентов по курсам
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={coursesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${entry.students}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="students"
              >
                {coursesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Быстрые действия
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/courses'}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Добавить курс</span>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/employees'}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Добавить сотрудника</span>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/applications'}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Просмотреть заявки</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
