'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatDateTime, getRelativeTime, getStatusColor, getStatusLabel } from '@/lib/utils';

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentId) {
      loadStudent();
    }
  }, [studentId]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/employee/student/${studentId}`);
      
      if (response.data.success) {
        setStudent(response.data.data);
      }
    } catch (err: any) {
      console.error('Load student error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки данных студента');
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
        <Button variant="ghost" onClick={() => router.back()}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад
        </Button>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadStudent}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Назад к списку
      </Button>

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-2xl">
                {student.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">{student.user.fullName}</h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {student.user.email && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {student.user.email}
                      </span>
                    )}
                    {student.user.phone && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {student.user.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(student.status)}>
                    {getStatusLabel(student.status)}
                  </Badge>
                </div>
              </div>

              {/* Group Info */}
              {student.group && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-muted-foreground">Группа:</span>
                    <span className="font-medium text-foreground">{student.group.name}</span>
                    {student.group.course && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {student.group.course.translations[0]?.title}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Прогресс</p>
            <p className="text-3xl font-bold text-foreground">{student.stats.progress}%</p>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${student.stats.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Завершено уроков</p>
            <p className="text-3xl font-bold text-foreground">{student.stats.completedLessons}</p>
            <p className="text-xs text-muted-foreground mt-2">из {student.stats.totalLessons}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Пройдено тестов</p>
            <p className="text-3xl font-bold text-foreground">{student.stats.passedQuizzes}</p>
            <p className="text-xs text-muted-foreground mt-2">
              средний балл: {student.stats.averageQuizScore}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Последняя активность</p>
            <p className="text-lg font-bold text-foreground">
              {student.stats.daysSinceActivity !== null 
                ? `${student.stats.daysSinceActivity} дн.`
                : 'Нет данных'
              }
            </p>
            <p className="text-xs text-muted-foreground mt-2">назад</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Недавняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          {student.recentActivity && student.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {student.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'lesson' ? 'bg-primary/10' : 'bg-success/10'
                  }`}>
                    {activity.type === 'lesson' ? (
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {activity.type === 'lesson' ? activity.lessonTitle : activity.quizTitle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.type === 'lesson' 
                        ? activity.isCompleted ? 'Урок завершён' : 'Урок просмотрен'
                        : `Тест: ${activity.score}% ${activity.isPassed ? '(пройден)' : '(не пройден)'}`
                      }
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {getRelativeTime(activity.date)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Нет активности"
              description="У этого студента пока нет активности"
            />
          )}
        </CardContent>
      </Card>

      {/* Upcoming Bookings */}
      {student.upcomingBookings && student.upcomingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Предстоящие встречи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {student.upcomingBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-foreground">{formatDateTime(booking.date)}</p>
                      <p className="text-sm text-muted-foreground">{booking.duration} минут</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(booking.status)}>
                    {getStatusLabel(booking.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
