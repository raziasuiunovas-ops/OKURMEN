'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, getStatusColor, getStatusLabel, calculateProgress } from '@/lib/utils';
import Link from 'next/link';
import { Group, StudentProfile } from '@/types';

interface GroupWithStats extends Group {
  course: {
    id: string;
    slug: string;
    coverImage: string | null;
    format: string | null;
    translations: Array<{ title: string; description?: string }>;
    _count?: { lessons: number };
  } | null;
  students: (StudentProfile & {
    progress: number;
    completedLessonsCount: number;
  })[];
  stats: {
    totalStudents: number;
    activeStudents: number;
    averageProgress: number;
    totalLessons: number;
  };
}

export default function GroupPage() {
  const [group, setGroup] = useState<GroupWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGroup();
  }, []);

  const loadGroup = async () => {
    try {
      setLoading(true);
      const response = await apiClient.employee.getMyGroup();
      
      if (response.data.success) {
        setGroup(response.data.data);
      }
    } catch (err: any) {
      console.error('Load group error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки группы');
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
        <h1 className="text-3xl font-bold">Моя группа</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadGroup}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Моя группа</h1>
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          title="У вас пока нет группы"
          description="Свяжитесь с администратором для назначения группы"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{group.name}</h1>
          {group.description && (
            <p className="text-muted-foreground mt-1">{group.description}</p>
          )}
        </div>
        <Badge variant={group.isActive ? 'success' : 'secondary'}>
          {group.isActive ? 'Активна' : 'Неактивна'}
        </Badge>
      </div>

      {/* Course Info */}
      {group.course && (
        <Card>
          <CardHeader>
            <CardTitle>Курс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              {group.course.coverImage && (
                <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-muted overflow-hidden">
                  <img
                    src={group.course.coverImage}
                    alt={group.course.translations[0]?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground">
                  {group.course.translations[0]?.title || 'Без названия'}
                </h3>
                {group.course.translations[0]?.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {group.course.translations[0].description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  {group.course.format && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {group.course.format}
                    </span>
                  )}
                  {group.course._count && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {group.course._count.lessons} уроков
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Студентов</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {group.stats.totalStudents}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {group.stats.activeStudents} активных
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Средний прогресс</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {group.stats.averageProgress}%
              </p>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${group.stats.averageProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Всего уроков</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {group.stats.totalLessons}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Link href="/employee/students">
                <Button variant="outline" className="w-full">
                  Все студенты
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Студенты группы ({group.students.length})</CardTitle>
            <Link href="/employee/students">
              <Button variant="ghost" size="sm">
                Подробнее
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {group.students.length === 0 ? (
            <EmptyState
              title="Нет студентов"
              description="В этой группе пока нет студентов"
            />
          ) : (
            <div className="space-y-3">
              {group.students.slice(0, 5).map((student) => (
                <Link key={student.id} href={`/employee/students/${student.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {student.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{student.user.fullName}</p>
                        <p className="text-sm text-muted-foreground">{student.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {student.progress}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.completedLessonsCount}/{group.stats.totalLessons} уроков
                        </p>
                      </div>
                      
                      <Badge variant={getStatusColor(student.status)}>
                        {getStatusLabel(student.status)}
                      </Badge>
                      
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
              
              {group.students.length > 5 && (
                <Link href="/employee/students">
                  <Button variant="outline" className="w-full">
                    Показать всех ({group.students.length})
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Dates */}
      {(group.startDate || group.endDate) && (
        <Card>
          <CardHeader>
            <CardTitle>Даты обучения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {group.startDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Начало</p>
                  <p className="font-medium text-foreground">
                    {formatDate(group.startDate)}
                  </p>
                </div>
              )}
              {group.endDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Окончание</p>
                  <p className="font-medium text-foreground">
                    {formatDate(group.endDate)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
