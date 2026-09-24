'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    coursesCount: 0,
    employeesCount: 0,
    applicationsCount: 0,
    paymentsCount: 0,
    totalRevenue: 0,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, employeesRes, applicationsRes, paymentsRes] = await Promise.all([
          api.get('/courses?includeInactive=true'),
          api.get('/employees?includeInactive=true'),
          api.get('/applications'),
          api.get('/payments'),
        ]);

        const payments = paymentsRes.data.data || [];
        const paidPayments = payments.filter((p: any) => p.status === 'PAID');
        const totalRevenue = paidPayments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

        setStats({
          coursesCount: coursesRes.data.data?.length || 0,
          employeesCount: employeesRes.data.data?.length || 0,
          applicationsCount: applicationsRes.data.data?.length || 0,
          paymentsCount: paidPayments.length,
          totalRevenue,
        });

        const applications = applicationsRes.data.data || [];
        setRecentApplications(applications.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Курсы</p>
              <p className="text-2xl font-bold text-gray-900">{stats.coursesCount}</p>
            </div>
            <span className="text-3xl">📚</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Сотрудники</p>
              <p className="text-2xl font-bold text-gray-900">{stats.employeesCount}</p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Заявки</p>
              <p className="text-2xl font-bold text-gray-900">{stats.applicationsCount}</p>
            </div>
            <span className="text-3xl">📝</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Оплачено</p>
              <p className="text-2xl font-bold text-gray-900">{stats.paymentsCount}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.totalRevenue.toLocaleString()} KGS</p>
            </div>
            <span className="text-3xl">💳</span>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Последние заявки</h2>
        </div>
        <div className="p-6">
          {recentApplications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Заявок пока нет</p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="font-medium text-gray-900">{application.fullName}</p>
                    <p className="text-sm text-gray-600">{application.phone}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {application.course?.translations?.[0]?.title || 'Курс'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        application.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {application.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(application.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
