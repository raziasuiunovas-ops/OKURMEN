'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

interface EmployeeProfileData {
  id: string;
  position: string;
  department: string | null;
  hireDate: Date | null;
  bio: string | null;
  specialization: string | null;
  user: {
    fullName: string;
    email: string;
    phone: string | null;
    telegramId: string | null;
    createdAt: Date;
  };
  stats: {
    coursesCount?: number;
    studentsCount?: number;
    groupsCount?: number;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    bio: '',
    specialization: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.employee.getProfile();
      
      if (response.data.success) {
        const profileData = response.data.data;
        setProfile(profileData);
        setFormData({
          department: profileData.department || '',
          bio: profileData.bio || '',
          specialization: profileData.specialization || '',
        });
      }
    } catch (err: any) {
      console.error('Load profile error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await apiClient.employee.updateProfile(formData);
      
      if (response.data.success) {
        setProfile(response.data.data);
        setEditing(false);
      }
    } catch (err: any) {
      console.error('Update profile error:', err);
      alert(err.response?.data?.message || 'Ошибка обновления профиля');
    }
  };

  const getPositionLabel = (position: string): string => {
    const labels: Record<string, string> = {
      MENTOR: 'Ментор',
      TEACHER: 'Преподаватель',
      MANAGER: 'Менеджер',
      SALES: 'Менеджер по продажам',
      MARKETING: 'Маркетолог',
    };
    return labels[position] || position;
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Профиль</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error || 'Профиль не найден'}
          action={<Button onClick={loadProfile}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Профиль</h1>
          <p className="text-muted-foreground mt-1">
            Ваша личная информация и статистика
          </p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Редактировать
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-3xl">
                {profile.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{profile.user.fullName}</h2>
                  <Badge variant="default" className="mb-2">
                    {getPositionLabel(profile.position)}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                    {profile.user.email && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {profile.user.email}
                      </span>
                    )}
                    {profile.user.phone && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {profile.user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {profile.hireDate && (
                <div className="text-sm text-muted-foreground mt-2">
                  В компании с {formatDate(profile.hireDate)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {profile.stats && Object.values(profile.stats).some(v => v && v > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.stats.coursesCount !== undefined && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">Курсов</p>
                <p className="text-3xl font-bold text-foreground mt-2">{profile.stats.coursesCount}</p>
              </CardContent>
            </Card>
          )}
          {profile.stats.studentsCount !== undefined && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">Студентов</p>
                <p className="text-3xl font-bold text-foreground mt-2">{profile.stats.studentsCount}</p>
              </CardContent>
            </Card>
          )}
          {profile.stats.groupsCount !== undefined && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground">Групп</p>
                <p className="text-3xl font-bold text-foreground mt-2">{profile.stats.groupsCount}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Дополнительная информация</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Отдел
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Введите отдел"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Специализация
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Введите специализацию"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  О себе
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Расскажите о себе"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  Сохранить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      department: profile.department || '',
                      bio: profile.bio || '',
                      specialization: profile.specialization || '',
                    });
                  }}
                >
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Отдел</p>
                <p className="text-foreground">{profile.department || 'Не указан'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Специализация</p>
                <p className="text-foreground">{profile.specialization || 'Не указана'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">О себе</p>
                <p className="text-foreground whitespace-pre-wrap">{profile.bio || 'Не указано'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
