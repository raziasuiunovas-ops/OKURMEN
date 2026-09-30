'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  User,
  Users,
  Code,
  TrendingUp,
  UserCheck,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ImageUploader from '@/components/ImageUploader';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface Employee {
  id: string;
  position: string;
  bio: string | null;
  education: string | null;
  experience: string | null;
  photoUrl: string | null;
  sortOrder: number;
  user: {
    id: string;
    fullName: string | null;
    email: string;
    phone: string | null;
  };
}

// Toast notification types
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// Категории отделов с цветами
const DEPARTMENTS = [
  { key: 'ALL', label: 'Все сотрудники', color: 'gray', icon: Users },
  { key: 'FOUNDER', label: 'Руководство', color: 'orange', icon: UserCheck },
  { key: 'MENTOR', label: 'Менторинг', color: 'green', icon: Code },
  { key: 'MANAGER', label: 'Продажи и Управление', color: 'purple', icon: TrendingUp },
  { key: 'DEVELOPER', label: 'ОКУРМЭН Студия', color: 'pink', icon: Code },
];

export default function EmployeesPage() {
  const { t } = useLanguage();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const showToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchEmployees = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/employees`, {
        credentials: 'include',
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const data = await response.json();
      const employeesList = data.data || [];
      
      // Удаляем дубликаты по email
      const uniqueEmployees = employeesList.reduce((acc: Employee[], current: Employee) => {
        const exists = acc.find((emp) => emp.user.email === current.user.email);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      setEmployees(uniqueEmployees.sort((a: Employee, b: Employee) => a.sortOrder - b.sortOrder));
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      showToast('error', '❌ Ошибка загрузки сотрудников');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      (employee.user?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.position || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'ALL' || employee.position === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const handleDelete = async (id: string, fullName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить сотрудника "${fullName}"?`)) return;

    try {
      const token = localStorage.getItem('auth-token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      
      const response = await fetch(`${apiUrl}/api/employees/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      if (response.ok) {
        setEmployees(employees.filter((e) => e.id !== id));
        showToast('success', `✅ Сотрудник "${fullName}" успешно удалён`);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete employee:', error);
      showToast('error', '❌ Ошибка при удалении сотрудника');
    }
  };

  const getColorClass = (position: string) => {
    if (position === 'FOUNDER') return 'from-orange-500 to-orange-600';
    if (position === 'MENTOR') return 'from-green-500 to-green-600';
    if (position === 'MANAGER') return 'from-purple-500 to-purple-600';
    if (position === 'DEVELOPER') return 'from-pink-500 to-pink-600';
    return 'from-gray-500 to-gray-600';
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      FOUNDER: 'Основатель',
      MENTOR: 'Ментор',
      MANAGER: 'Менеджер/Управление',
      DEVELOPER: 'ОКУРМЭН Студия',
    };
    return labels[position] || position;
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
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-in slide-in-from-right duration-300 ${
              toast.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : toast.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="font-medium text-sm">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Сотрудники ОКУРМЭН
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Всего: {employees.length} сотрудников
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 transform duration-200 select-none active:scale-95"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <Plus className="w-5 h-5" />
          <span>Добавить сотрудника</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, должности, email..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-all focus:shadow-lg"
          />
        </div>

        {/* Department Filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white appearance-none transition-all focus:shadow-lg"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.key} value={dept.key}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Department Tabs */}
      <div className="flex flex-wrap gap-2">
        {DEPARTMENTS.map((dept) => {
          const Icon = dept.icon;
          const isActive = selectedDepartment === dept.key;
          const deptCount = dept.key === 'ALL' 
            ? employees.length 
            : employees.filter(e => e.position === dept.key).length;
          
          return (
            <button
              key={dept.key}
              onClick={() => setSelectedDepartment(dept.key)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md select-none ${
                isActive
                  ? `bg-${dept.color}-100 dark:bg-${dept.color}-900/30 text-${dept.color}-700 dark:text-${dept.color}-300 border-2 border-${dept.color}-500 shadow-sm`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-95`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Icon className="w-4 h-4" />
              <span>{dept.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                isActive ? 'bg-white/50 dark:bg-black/20' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {deptCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Employees Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            {searchQuery || selectedDepartment !== 'ALL' 
              ? 'Сотрудники не найдены по заданным критериям' 
              : 'Сотрудники отсутствуют'}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            {searchQuery && `Поиск: "${searchQuery}"`}
            {selectedDepartment !== 'ALL' && ` | Отдел: ${DEPARTMENTS.find(d => d.key === selectedDepartment)?.label}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Employee Header - ТОЛЬКО ФОТО */}
              <div className={`p-6 bg-gradient-to-br ${getColorClass(employee.position)} relative overflow-hidden`}>
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute top-2 right-2 z-10">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold rounded-full shadow-sm">
                    {getPositionLabel(employee.position)}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center relative z-10" style={{ minHeight: '160px' }}>
                  {employee.photoUrl ? (
                    <div className="relative w-32 h-32 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={employee.photoUrl}
                        alt={employee.user?.fullName || 'Сотрудник'}
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
                        style={{ objectPosition: 'center' }}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white flex items-center justify-center text-white text-center px-3 font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <span className="text-sm leading-tight">
                        {employee.user?.fullName || 'Без имени'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Employee Info - ФИО ЗДЕСЬ */}
              <div className="p-6 space-y-3">
                {/* ФИО - первым элементом */}
                <div className="text-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                    {employee.user?.fullName || 'Без имени'}
                  </h3>
                </div>
                {employee.experience && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl p-3 group-hover:shadow-sm transition-shadow duration-200">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Опыт в ОКУРМЭН
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {employee.experience}
                    </p>
                  </div>
                )}

                {employee.user?.email && !employee.user.email.includes('@okurmen.kg') && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-200">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{employee.user.email}</span>
                  </div>
                )}

                {employee.user?.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-200">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{employee.user.phone}</span>
                  </div>
                )}

                {employee.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {employee.bio}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4">
                  <button
                    onClick={() => setEditingEmployee(employee)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:bg-gray-200 dark:focus:bg-gray-600 focus:text-gray-900 dark:focus:text-white select-none active:scale-95"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Edit className="w-4 h-4" />
                    <span>Изменить</span>
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id, employee.user?.fullName || 'Сотрудник')}
                    className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 hover:shadow-md transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:bg-red-100 dark:focus:bg-red-900/30 focus:text-red-700 dark:focus:text-red-300 select-none active:scale-95"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingEmployee) && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEmployee(null);
          }}
          onSuccess={(message) => {
            fetchEmployees();
            showToast('success', message);
          }}
        />
      )}
    </div>
  );
}

// Employee Modal Component
function EmployeeModal({
  employee,
  onClose,
  onSuccess,
}: {
  employee: Employee | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) {
  const [formData, setFormData] = useState({
    fullName: employee?.user?.fullName || '',
    position: employee?.position || 'MANAGER',
    email: employee?.user?.email || '',
    phone: employee?.user?.phone || '',
    bio: employee?.bio || '',
    education: employee?.education || '',
    experience: employee?.experience || '',
    photoUrl: employee?.photoUrl || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      
      const url = employee
        ? `${apiUrl}/api/employees/${employee.id}`
        : `${apiUrl}/api/employees`;

      // Очищаем пустые строки - отправляем null или не включаем поле
      const cleanData = {
        fullName: formData.fullName || undefined,
        position: formData.position || undefined,
        email: (formData.email && formData.email.trim()) || undefined,
        phone: (formData.phone && formData.phone.trim()) || undefined,
        bio: (formData.bio && formData.bio.trim()) || undefined,
        education: (formData.education && formData.education.trim()) || undefined,
        experience: (formData.experience && formData.experience.trim()) || undefined,
        photoUrl: (formData.photoUrl && formData.photoUrl.trim()) || undefined,
      };

      // Для PATCH не отправляем email если он disabled
      if (employee && cleanData.email === employee.user?.email) {
        delete cleanData.email;
      }

      const response = await fetch(url, {
        method: employee ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(cleanData),
      });

      // Проверяем есть ли контент перед парсингом
      const text = await response.text();
      
      if (!response.ok) {
        // Пытаемся распарсить JSON error
        try {
          const errorData = JSON.parse(text);
          const errorMessage = errorData.error || errorData.message || response.statusText;
          alert(`❌ Ошибка: ${errorMessage}`);
        } catch {
          // Если не JSON, показываем текст как есть
          alert(`❌ Ошибка сервера: ${response.status} ${response.statusText}`);
        }
        return;
      }
      
      // Успешный ответ
      try {
        const result = JSON.parse(text);
        const successMessage = employee 
          ? `✅ Сотрудник "${formData.fullName}" успешно обновлён!`
          : `✅ Сотрудник "${formData.fullName}" успешно добавлен!`;
        onSuccess(successMessage);
        onClose();
      } catch {
        // Даже если парсинг не удался, но статус OK - считаем успехом
        const successMessage = employee 
          ? `✅ Сотрудник "${formData.fullName}" успешно обновлён!`
          : `✅ Сотрудник "${formData.fullName}" успешно добавлен!`;
        onSuccess(successMessage);
        onClose();
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('❌ Ошибка: ' + (error instanceof Error ? error.message : 'Проверьте подключение'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full my-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {employee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ФИО *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Иванов Иван Иванович"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Должность *
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
                required
              >
                <option value="FOUNDER">Основатель</option>
                <option value="MENTOR">Ментор</option>
                <option value="MANAGER">Менеджер/Управление</option>
                <option value="DEVELOPER">ОКУРМЭН Студия (Разработчик)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@email.com"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
                disabled={!!employee}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Телефон
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+996 XXX XXX XXX"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Опыт в ОКУРМЭН
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="1 год 3 месяца"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Образование
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="Высшее образование"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Биография / Описание
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                placeholder="Краткая информация о сотруднике"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
            </div>

            <div className="col-span-2">
              <ImageUploader
                currentImage={formData.photoUrl}
                onImageSelect={(base64) => setFormData({ ...formData, photoUrl: base64 })}
                aspectRatio="3:4"
                label="Фото сотрудника"
                maxSizeMB={5}
              />
              <p className="text-xs text-gray-500 mt-2">
                Портретное фото 3:4. Изображение будет автоматически обрезано и оптимизировано для карточек сотрудников.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-medium"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
