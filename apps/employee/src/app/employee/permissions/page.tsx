'use client';

import React, { useEffect, useState } from 'react';
import {
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  AlertCircle,
  BookOpen,
  BarChart3,
  Calendar,
  Loader2,
  Info,
} from 'lucide-react';

interface Permission {
  id: string;
  permissionType: string;
  grantedBy: string;
  grantedAt: string;
  expiresAt: string | null;
  isActive: boolean;
  admin: {
    fullName: string;
  };
}

interface PermissionRequest {
  id: string;
  permissionType: string;
  reason: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  reviewer: {
    fullName: string;
  } | null;
}

const PERMISSION_INFO = {
  MANAGE_STUDENT_COURSES: {
    name: 'Управление курсами студентов',
    description: 'Открывать и закрывать доступ студентов к курсам',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
  },
  VIEW_STUDENT_PROGRESS: {
    name: 'Просмотр прогресса студентов',
    description: 'Отслеживать успехи и прогресс учеников',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
  },
  MANAGE_BOOKINGS: {
    name: 'Управление бронированиями',
    description: 'Подтверждать и отменять бронирования занятий',
    icon: Calendar,
    color: 'from-purple-500 to-pink-500',
  },
};

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [requests, setRequests] = useState<PermissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const [permissionsRes, requestsRes] = await Promise.all([
        fetch('http://localhost:3002/api/mentor/permissions', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:3002/api/mentor/permissions/requests', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const permissionsData = await permissionsRes.json();
      const requestsData = await requestsRes.json();

      if (permissionsData.success) setPermissions(permissionsData.data);
      if (requestsData.success) setRequests(requestsData.data);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    if (!requestingPermission || !reason.trim()) {
      alert('Укажите причину запроса');
      return;
    }

    setSubmitting(true);
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      const response = await fetch('http://localhost:3002/api/mentor/permissions/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          permissionType: requestingPermission,
          reason: reason.trim(),
        }),
      });

      const result = await response.json();
      if (result.success) {
        setShowRequestModal(false);
        setRequestingPermission(null);
        setReason('');
        fetchData();
      } else {
        alert(result.error || 'Ошибка при отправке запроса');
      }
    } catch (error) {
      console.error('Failed to request permission:', error);
      alert('Ошибка при отправке запроса');
    } finally {
      setSubmitting(false);
    }
  };

  const hasPermission = (type: string) => 
    permissions.some(p => p.permissionType === type && p.isActive);

  const hasPendingRequest = (type: string) =>
    requests.some(r => r.permissionType === type && r.status === 'PENDING');

  const availablePermissions = Object.entries(PERMISSION_INFO).filter(
    ([type]) => !hasPermission(type) && !hasPendingRequest(type)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-600" />
          Разрешения и доступы
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Управление вашими разрешениями на выполнение действий в системе
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Как получить разрешение</p>
            <p>
              Запросите нужное разрешение, указав причину. Администратор рассмотрит ваш запрос и 
              примет решение. После одобрения вы сможете выполнять соответствующие действия.
            </p>
          </div>
        </div>
      </div>

      {/* Active Permissions */}
      {permissions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Активные разрешения ({permissions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissions.map((permission) => {
              const info = PERMISSION_INFO[permission.permissionType as keyof typeof PERMISSION_INFO];
              const Icon = info?.icon || Shield;

              return (
                <div
                  key={permission.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-green-200 dark:border-green-800"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {info?.name || permission.permissionType}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {info?.description || 'Специальное разрешение'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Выдано: {new Date(permission.grantedAt).toLocaleDateString('ru-RU')}</span>
                        <span>•</span>
                        <span>Админ: {permission.admin.fullName}</span>
                      </div>
                      {permission.expiresAt && (
                        <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                          Истекает: {new Date(permission.expiresAt).toLocaleDateString('ru-RU')}
                        </div>
                      )}
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Requests */}
      {requests.filter(r => r.status === 'PENDING').length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-yellow-500" />
            Ожидают одобрения ({requests.filter(r => r.status === 'PENDING').length})
          </h2>
          <div className="space-y-3">
            {requests.filter(r => r.status === 'PENDING').map((request) => {
              const info = PERMISSION_INFO[request.permissionType as keyof typeof PERMISSION_INFO];
              const Icon = info?.icon || Shield;

              return (
                <div
                  key={request.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${info?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {info?.name || request.permissionType}
                        </h3>
                        <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full">
                          На рассмотрении
                        </span>
                      </div>
                      {request.reason && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-medium">Причина:</span> {request.reason}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Запрошено: {new Date(request.requestedAt).toLocaleDateString('ru-RU')} в{' '}
                        {new Date(request.requestedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rejected Requests */}
      {requests.filter(r => r.status === 'REJECTED').length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <XCircle className="w-6 h-6 text-red-500" />
            Отклонённые запросы
          </h2>
          <div className="space-y-3">
            {requests.filter(r => r.status === 'REJECTED').map((request) => {
              const info = PERMISSION_INFO[request.permissionType as keyof typeof PERMISSION_INFO];
              const Icon = info?.icon || Shield;

              return (
                <div
                  key={request.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-red-200 dark:border-red-800 opacity-75"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${info?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center flex-shrink-0 opacity-50`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {info?.name || request.permissionType}
                        </h3>
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                          Отклонено
                        </span>
                      </div>
                      {request.rejectionReason && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-2">
                          <p className="text-sm text-red-800 dark:text-red-200">
                            <span className="font-medium">Причина отказа:</span> {request.rejectionReason}
                          </p>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Отклонено: {request.reviewedAt && new Date(request.reviewedAt).toLocaleDateString('ru-RU')}
                        {request.reviewer && ` • ${request.reviewer.fullName}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Request New Permission */}
      {availablePermissions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-primary-600" />
            Доступные для запроса
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePermissions.map(([type, info]) => {
              const Icon = info.icon;
              
              return (
                <div
                  key={type}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all cursor-pointer group"
                  onClick={() => {
                    setRequestingPermission(type);
                    setShowRequestModal(true);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">
                        {info.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {info.description}
                      </p>
                      <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        Запросить разрешение
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && requestingPermission && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowRequestModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Запрос разрешения
            </h3>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Разрешение:</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {PERMISSION_INFO[requestingPermission as keyof typeof PERMISSION_INFO]?.name}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Причина запроса *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Опишите, зачем вам нужно это разрешение..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestingPermission(null);
                  setReason('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleRequestPermission}
                disabled={submitting || !reason.trim()}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  'Отправить запрос'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
