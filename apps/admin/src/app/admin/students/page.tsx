'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  ChevronRight,
  Edit,
  Trash2,
  Users,
  Calendar,
  BookOpen,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  GraduationCap,
  Key,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const dynamic = 'force-dynamic';

interface Student {
  id: string;
  userId: string;
  groupId: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
  };
  enrollments: Array<{
    id: string;
    courseId: string;
    startDate: string;
    endDate: string | null;
    status: string;
  }>;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  courseId: string | null;
  mentorId: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  course: {
    id: string;
    slug: string;
    translations: Array<{ title: string }>;
  } | null;
  students: Student[];
  _count: {
    students: number;
  };
}

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export default function StudentsPage() {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [addingStudentToGroup, setAddingStudentToGroup] = useState<Group | null>(null);
  const [grantingAccess, setGrantingAccess] = useState<{ type: 'student' | 'group'; target: Student | Group | null }>({ type: 'student', target: null });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    fetchGroups();
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

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:3002/api/groups', {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setGroups(data.data || []);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      showToast('error', '❌ Ошибка загрузки групп');
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleDeleteStudent = async (groupId: string, studentId: string, studentName: string) => {
    if (!confirm(`Удалить "${studentName}" из группы?`)) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(
        `http://localhost:3002/api/groups/${groupId}/students/${studentId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.ok) {
        fetchGroups();
        showToast('success', `✅ "${studentName}" удалён из группы`);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete student:', error);
      showToast('error', '❌ Ошибка удаления студента');
    }
  };

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить группу "${groupName}"?`)) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(
        `http://localhost:3002/api/groups/${groupId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (response.ok) {
        fetchGroups();
        showToast('success', `✅ Группа "${groupName}" успешно удалена`);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }
    } catch (error: any) {
      console.error('Failed to delete group:', error);
      showToast('error', error.message || '❌ Ошибка при удалении группы');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      GRADUATED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      DROPPED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    const labels = {
      ACTIVE: 'Активный',
      INACTIVE: 'Неактивный',
      GRADUATED: 'Выпускник',
      DROPPED: 'Отчислен',
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Не указана';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-[calc(100vw-2rem)] sm:max-w-md">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl shadow-lg backdrop-blur-sm animate-in slide-in-from-right duration-300 ${
              toast.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                : toast.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
            {toast.type === 'info' && <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
            <p className="font-medium text-xs sm:text-sm flex-1 break-words">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="ml-1 sm:ml-2 hover:opacity-70 flex-shrink-0 min-w-[24px] min-h-[24px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{t('students.title')}</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              {t('students.totalInGroups', { 
                total: groups.reduce((sum, g) => sum + g._count.students, 0),
                groups: groups.length 
              })}
            </p>
          </div>
          <button
            onClick={() => setCreatingGroup(true)}
            className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 transform duration-200 min-h-[48px] flex-shrink-0 text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span>{t('students.createGroup')}</span>
          </button>
        </div>
      </div>

      {/* Groups Accordion */}
      <div className="space-y-4">
        {groups.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Группы отсутствуют</p>
          </div>
        ) : (
          groups.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            
            return (
              <div
                key={group.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Group Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <button
                        className={`transform transition-transform duration-300 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      >
                        <ChevronRight className="w-6 h-6 text-orange-500" />
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('students.groupPrefix')} {group.name}
                          </h3>
                          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                            {t('students.studentCount', { count: group._count.students })}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {group.course && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{group.course.translations[0]?.title}</span>
                            </div>
                          )}
                          {group.startDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Начало: {formatDate(group.startDate)}</span>
                            </div>
                          )}
                        </div>

                        {group.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {group.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setGrantingAccess({ type: 'group', target: group })}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-colors"
                        title={t('students.grantAccessTooltip')}
                      >
                        <Key className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setAddingStudentToGroup(group)}
                        className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl transition-colors"
                        title={t('students.addStudentTooltip')}
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingGroup(group)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl transition-colors"
                        title="Редактировать группу"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                        title={t('students.deleteGroupTooltip')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Group Content (Students) */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-750">
                    {group.students.length === 0 ? (
                      <div className="text-center py-8">
                        <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">В группе пока нет учеников</p>
                        <button
                          onClick={() => setAddingStudentToGroup(group)}
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          Добавить первого ученика
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.students.map((student) => (
                          <div
                            key={student.id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {student.user.fullName}
                                </h4>
                                {getStatusBadge(student.status)}
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setGrantingAccess({ type: 'student', target: student })}
                                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                  title="Открыть доступ к курсу"
                                >
                                  <Key className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteStudent(group.id, student.id, student.user.fullName)
                                  }
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                  title="Удалить из группы"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {student.enrollments.length > 0 && (
                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    Начало: {formatDate(student.enrollments[0].startDate)}
                                  </span>
                                </div>
                                {student.enrollments[0].endDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      Окончание: {formatDate(student.enrollments[0].endDate)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Edit Group Modal */}
      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
          onSuccess={(message) => {
            fetchGroups();
            showToast('success', message);
          }}
        />
      )}

      {/* Create Group Modal */}
      {creatingGroup && (
        <EditGroupModal
          group={null}
          onClose={() => setCreatingGroup(false)}
          onSuccess={(message) => {
            fetchGroups();
            showToast('success', message);
          }}
        />
      )}

      {/* Add Student Modal */}
      {addingStudentToGroup && (
        <AddStudentModal
          group={addingStudentToGroup}
          onClose={() => setAddingStudentToGroup(null)}
          onSuccess={(message) => {
            fetchGroups();
            showToast('success', message);
          }}
        />
      )}

      {/* Grant Course Access Modal */}
      {grantingAccess.target && (
        <GrantCourseAccessModal
          type={grantingAccess.type}
          target={grantingAccess.target}
          onClose={() => setGrantingAccess({ type: 'student', target: null })}
          onSuccess={(message) => {
            fetchGroups();
            showToast('success', message);
          }}
        />
      )}
    </div>
  );
}

// Edit/Create Group Modal
function EditGroupModal({ 
  group, 
  onClose, 
  onSuccess 
}: { 
  group: Group | null; 
  onClose: () => void; 
  onSuccess: (message: string) => void;
}) {
  const { t } = useLanguage();
  const isEditing = group && group.id;
  
  const [formData, setFormData] = useState({
    name: group?.name || 'Frontend1',
    description: group?.description || '',
    mentorId: group?.mentorId || '',
    startDate: group?.startDate ? new Date(group.startDate).toISOString().split('T')[0] : '',
    endDate: group?.endDate ? new Date(group.endDate).toISOString().split('T')[0] : '',
    isActive: group?.isActive ?? true,
  });
  const [mentors, setMentors] = useState<Array<{ id: string; fullName: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMentors, setFetchingMentors] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:3002/api/employees?position=MENTOR', {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        const mentorsList = data.data.map((emp: any) => ({
          id: emp.id,
          fullName: emp.user.fullName,
        }));
        setMentors(mentorsList);
      }
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    } finally {
      setFetchingMentors(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const url = isEditing 
        ? `http://localhost:3002/api/groups/${group.id}`
        : 'http://localhost:3002/api/groups';
      
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          mentorId: formData.mentorId || null,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
          isActive: formData.isActive,
        }),
      });

      if (response.ok) {
        const successMessage = isEditing 
          ? `✅ Группа "${formData.name}" обновлена`
          : `✅ Группа "${formData.name}" создана`;
        onSuccess(successMessage);
        onClose();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error || error.message || 'Не удалось сохранить группу'}`);
      }
    } catch (error) {
      console.error('Failed to save group:', error);
      alert('Ошибка при сохранении группы');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? `Редактировать группу ${group.name}` : 'Создать группу'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Название группы *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ментор группы
            </label>
            {fetchingMentors ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <select
                value={formData.mentorId}
                onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">-- Без ментора --</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.fullName}
                  </option>
                ))}
              </select>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Выберите ментора для группы (необязательно)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Опишите группу..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Дата начала
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Дата окончания
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Группа активна
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Сохранение...
                </>
              ) : (
                'Сохранить'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Student Modal
function AddStudentModal({ 
  group, 
  onClose, 
  onSuccess 
}: { 
  group: Group; 
  onClose: () => void; 
  onSuccess: (message: string) => void;
}) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    age: '',
    studyDuration: '',
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`http://localhost:3002/api/groups/${group.id}/students`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          phone: formData.phone || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          studyDuration: formData.studyDuration || undefined,
          status: formData.status,
          courseId: group.courseId || undefined,
          startDate: group.startDate || new Date().toISOString(),
        }),
      });

      if (response.ok) {
        onSuccess(`✅ Ученик "${formData.fullName}" добавлен в группу ${group.name}`);
        onClose();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.message || 'Не удалось добавить ученика'}`);
      }
    } catch (error) {
      console.error('Failed to add student:', error);
      alert('Ошибка при добавлении ученика');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Добавить ученика в группу {group.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ФИО ученика *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Введите полное имя"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Аккаунт (username) *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="username123"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Номер телефона
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="+996 555 123 456 (необязательно)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Возраст *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="16"
                min="5"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Срок обучения *
              </label>
              <input
                type="text"
                value={formData.studyDuration}
                onChange={(e) => setFormData({ ...formData, studyDuration: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="6 месяцев"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Статус
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="ACTIVE">Активный</option>
              <option value="INACTIVE">Неактивный</option>
            </select>
          </div>

          {group.course && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Курс:</strong> {group.course.translations[0]?.title}
              </p>
              {group.startDate && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <strong>Начало:</strong> {new Date(group.startDate).toLocaleDateString('ru-RU')}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Добавление...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Добавить
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Grant Course Access Modal
interface Course {
  id: string;
  slug: string;
  translations: Array<{ title: string; description: string }>;
}

function GrantCourseAccessModal({
  type,
  target,
  onClose,
  onSuccess,
}: {
  type: 'student' | 'group';
  target: Student | Group;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:3002/api/courses', {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setFetchingCourses(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourseId) {
      alert('Выберите курс');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const body =
        type === 'student'
          ? {
              type: 'student',
              studentId: target.id,
              courseId: selectedCourseId,
            }
          : {
              type: 'group',
              groupId: target.id,
              courseId: selectedCourseId,
            };

      const response = await fetch('http://localhost:3002/api/admin/course-access', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data.data.message || '✅ Доступ успешно открыт');
        onClose();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.message || 'Не удалось открыть доступ'}`);
      }
    } catch (error) {
      console.error('Failed to grant access:', error);
      alert('Ошибка при открытии доступа');
    } finally {
      setLoading(false);
    }
  };

  const targetName = 'user' in target ? target.user.fullName : target.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Открыть доступ к курсу
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {type === 'student' ? (
                <>
                  <strong>Студент:</strong> {targetName}
                </>
              ) : (
                <>
                  <strong>Группа:</strong> {targetName} ({(target as Group)._count?.students || 0}{' '}
                  учеников)
                </>
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Выберите курс *
            </label>
            {fetchingCourses ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Выберите курс --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.translations[0]?.title || course.slug}
                  </option>
                ))}
              </select>
            )}
          </div>

          {type === 'group' && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Доступ будет открыт для всех {(target as Group)._count?.students || 0} учеников
                группы
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || fetchingCourses}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Открытие доступа...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Открыть доступ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
