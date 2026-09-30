'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Check, X, Clock, Mail, Phone, FileText } from 'lucide-react';

// Disable SSR for this page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  course: { title: string } | null;
  status: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/applications', {
        credentials: 'include',
      });
      const data = await response.json();
      setApplications(data.data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3002/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchApplications();
      } else {
        console.error('Failed to update application status:', response.status);
        alert('Ошибка при обновлении статуса заявки');
      }
    } catch (error) {
      console.error('Failed to update application:', error);
      alert('Ошибка при обновлении статуса заявки');
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      (app.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.phone || '').includes(searchQuery);
    
    const matchesFilter = filterStatus === 'ALL' || app.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50';
      case 'CONTACTED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'CONTACTED':
        return <Eye className="w-4 h-4" />;
      case 'CONFIRMED':
        return <Check className="w-4 h-4" />;
      case 'REJECTED':
        return <X className="w-4 h-4" />;
      case 'CANCELLED':
        return <X className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Заявки на курсы
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Управление заявками студентов
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, email или телефону"
            className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-all shadow-sm"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-5 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-all shadow-sm font-medium"
        >
          <option value="ALL">Все статусы</option>
          <option value="PENDING">В ожидании</option>
          <option value="CONTACTED">Связались</option>
          <option value="CONFIRMED">Подтверждены</option>
          <option value="REJECTED">Отклонены</option>
          <option value="CANCELLED">Отменены</option>
        </select>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50">
          <p className="text-slate-500 dark:text-slate-400 text-lg">Заявки не найдены</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Application Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {app.name || 'Без имени'}
                    </h3>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-bold ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span>{app.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{app.email || 'Нет email'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{app.phone || 'Нет телефона'}</span>
                    </div>
                  </div>

                  {app.course && (
                    <div className="text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Курс:</span>{' '}
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {app.course?.title || 'Курс не указан'}
                      </span>
                    </div>
                  )}

                  {app.message && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {app.message}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {new Date(app.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>

                {/* Actions */}
                {app.status === 'PENDING' && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateStatus(app.id, 'CONFIRMED')}
                      className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl transition-all flex items-center space-x-2 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Check className="w-4 h-4" />
                      <span>Подтвердить</span>
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, 'REJECTED')}
                      className="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all flex items-center space-x-2 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <X className="w-4 h-4" />
                      <span>Отклонить</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
