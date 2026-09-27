'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OperationsData {
  overview: {
    totalStudents: number;
    activeStudents: number;
    totalGroups: number;
    activeGroups: number;
    totalCourses: number;
    publishedCourses: number;
    todayBookings: number;
    pendingApplications: number;
  };
  recentEnrollments: Array<{
    id: string;
    status: string;
    enrolledAt: Date;
    student: {
      user: { fullName: string };
    };
    group: {
      name: string;
    };
  }>;
  recentApplications: Array<{
    id: string;
    status: string;
    submittedAt: Date;
    user: {
      fullName: string;
      email: string;
    };
    course: {
      translations: Array<{ title: string }>;
    };
  }>;
  groupsActivity: Array<{
    groupName: string;
    activeStudents: number;
    totalStudents: number;
    averageProgress: number;
  }>;
  enrollmentTrend: Array<{
    date: string;
    enrollments: number;
    applications: number;
  }>;
}

export default function OperationsPage() {
  const [data, setData] = useState<OperationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/employee/operations');
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error('Load operations error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки данных');
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
        <h1 className="text-3xl font-bold">Операции</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadOperations}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Операции</h1>
          <p className="text-muted-foreground mt-1">
            Операционный обзор и аналитика
          </p>
        </div>
        <Link href="/employee/reports">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Отчёты
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Студенты</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.overview.totalStudents}</p>
              <p className="text-xs text-success mt-1">
                {data.overview.activeStudents} активных
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Группы</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.overview.totalGroups}</p>
              <p className="text-xs text-success mt-1">
                {data.overview.activeGroups} активных
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Курсы</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.overview.totalCourses}</p>
              <p className="text-xs text-success mt-1">
                {data.overview.publishedCourses} опубликовано
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Сегодня</p>
              <p className="text-3xl font-bold text-primary mt-2">{data.overview.todayBookings}</p>
              <p className="text-xs text-muted-foreground mt-1">
                встреч
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Applications Alert */}
      {data.overview.pendingApplications > 0 && (
        <Card className="border-warning">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {data.overview.pendingApplications} заявок ожидают рассмотрения
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Проверьте новые заявки на обучение
                </p>
              </div>
              <Link href="/employee/enrollments">
                <Button variant="outline" size="sm">
                  Просмотреть
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        {data.enrollmentTrend && data.enrollmentTrend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Динамика записей (30 дней)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    name="Зачисления"
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Заявки"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Groups Activity */}
        {data.groupsActivity && data.groupsActivity.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Активность групп</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.groupsActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="groupName" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="activeStudents"
                    fill="hsl(var(--success))"
                    name="Активные студенты"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="totalStudents"
                    fill="hsl(var(--muted))"
                    name="Всего студентов"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Последние зачисления</CardTitle>
              <Link href="/employee/enrollments">
                <Button variant="ghost" size="sm">
                  Все
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.recentEnrollments.length === 0 ? (
              <EmptyState
                title="Нет зачислений"
                description="Нет недавних зачислений"
              />
            ) : (
              <div className="space-y-3">
                {data.recentEnrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {enrollment.student.user.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Группа: {enrollment.group.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(enrollment.enrolledAt)}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(enrollment.status)}>
                      {getStatusLabel(enrollment.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Последние заявки</CardTitle>
              <Link href="/employee/enrollments">
                <Button variant="ghost" size="sm">
                  Все
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {data.recentApplications.length === 0 ? (
              <EmptyState
                title="Нет заявок"
                description="Нет недавних заявок"
              />
            ) : (
              <div className="space-y-3">
                {data.recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {application.user.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {application.course.translations[0]?.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(application.submittedAt)}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(application.status)}>
                      {getStatusLabel(application.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
