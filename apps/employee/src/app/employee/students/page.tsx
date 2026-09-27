'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, getRelativeTime, getStatusColor, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';
import { StudentProfile } from '@/types';

interface StudentWithProgress extends StudentProfile {
  progress: number;
  completedLessonsCount: number;
  totalLessons: number;
  lastActivityDate: Date | null;
  daysSinceActivity: number | null;
  needsAttention: boolean;
  upcomingBooking: any;
}

interface StudentsData {
  students: StudentWithProgress[];
  stats: {
    total: number;
    active: number;
    needsAttention: number;
    averageProgress: number;
  };
}

export default function StudentsPage() {
  const [data, setData] = useState<StudentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'attention'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'activity'>('name');

  useEffect(() => {
    loadStudents();
  }, [sortBy]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.employee.getMyStudents({ sortBy });
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error('Load students error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки студентов');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Студенты</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadStudents}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!data || data.students.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Студенты</h1>
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          title="Нет студентов"
          description="В вашей группе пока нет студентов"
        />
      </div>
    );
  }

  // Filter students
  const filteredStudents = data.students.filter((student) => {
    if (filter === 'active') return student.status === 'ACTIVE';
    if (filter === 'attention') return student.needsAttention;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Студенты</h1>
          <p className="text-muted-foreground mt-1">
            Управление студентами вашей группы
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter('all')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Всего</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-success/50 transition-colors" onClick={() => setFilter('active')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Активных</p>
              <p className="text-3xl font-bold text-success mt-2">{data.stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-warning/50 transition-colors" onClick={() => setFilter('attention')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Требуют внимания</p>
              <p className="text-3xl font-bold text-warning mt-2">{data.stats.needsAttention}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Средний прогресс</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.stats.averageProgress}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Фильтр:</span>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  Все ({data.stats.total})
                </Button>
                <Button
                  variant={filter === 'active' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('active')}
                >
                  Активные ({data.stats.active})
                </Button>
                <Button
                  variant={filter === 'attention' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('attention')}
                >
                  Нужно внимание ({data.stats.needsAttention})
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
              >
                <option value="name">По имени</option>
                <option value="progress">По прогрессу</option>
                <option value="activity">По активности</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.map((student) => (
          <Link key={student.id} href={`/employee/students/${student.id}`}>
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {student.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{student.user.fullName}</h3>
                          <Badge variant={getStatusColor(student.status)}>
                            {getStatusLabel(student.status)}
                          </Badge>
                          {student.needsAttention && (
                            <Badge variant="warning">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Нужно внимание
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {student.user.email && <span>{student.user.email}</span>}
                          {student.user.phone && <span>{student.user.phone}</span>}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{student.progress}%</div>
                        <div className="text-xs text-muted-foreground">
                          {student.completedLessonsCount}/{student.totalLessons} уроков
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          student.progress >= 70 ? 'bg-success' : 
                          student.progress >= 40 ? 'bg-warning' : 
                          'bg-destructive'
                        }`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>

                    {/* Bottom Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        {student.lastActivityDate && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Активность: {getRelativeTime(student.lastActivityDate)}
                          </span>
                        )}
                        {student.daysSinceActivity !== null && student.daysSinceActivity > 0 && (
                          <span className={student.daysSinceActivity > 7 ? 'text-warning' : ''}>
                            ({student.daysSinceActivity} дн. назад)
                          </span>
                        )}
                      </div>

                      {student.upcomingBooking && (
                        <Badge variant="secondary">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Встреча: {formatDate(student.upcomingBooking.date)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {filteredStudents.length === 0 && (
          <EmptyState
            title="Нет студентов"
            description={`Нет студентов по выбранному фильтру: ${
              filter === 'active' ? 'Активные' : 
              filter === 'attention' ? 'Требуют внимания' : 
              'Все'
            }`}
          />
        )}
      </div>
    </div>
  );
}
