'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';

interface EnrollmentWithDetails {
  id: string;
  status: string;
  enrolledAt: Date;
  completedAt: Date | null;
  student: {
    id: string;
    user: {
      fullName: string;
      email: string;
      phone: string | null;
    };
    status: string;
  };
  group: {
    id: string;
    name: string;
    isActive: boolean;
    course: {
      translations: Array<{ title: string }>;
    } | null;
  };
}

interface ApplicationWithDetails {
  id: string;
  status: string;
  submittedAt: Date;
  reviewedAt: Date | null;
  user: {
    fullName: string;
    email: string;
    phone: string | null;
  };
  course: {
    id: string;
    translations: Array<{ title: string }>;
  };
}

interface EnrollmentsData {
  enrollments: EnrollmentWithDetails[];
  applications: ApplicationWithDetails[];
  stats: {
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
  };
}

export default function EnrollmentsPage() {
  const [data, setData] = useState<EnrollmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'enrollments' | 'applications'>('applications');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/employee/enrollments');
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error('Load enrollments error:', err);
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
        <h1 className="text-3xl font-bold">Зачисления</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadEnrollments}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Filter data
  const filteredEnrollments = data.enrollments.filter((e) => {
    if (filter === 'active') return e.status === 'ACTIVE';
    if (filter === 'completed') return e.status === 'COMPLETED';
    return true;
  });

  const filteredApplications = data.applications.filter((a) => {
    if (filter === 'pending') return a.status === 'PENDING';
    if (filter === 'approved') return a.status === 'APPROVED';
    if (filter === 'rejected') return a.status === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Зачисления</h1>
          <p className="text-muted-foreground mt-1">
            Управление заявками и зачислениями студентов
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Зачислений</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.stats.totalEnrollments}</p>
              <p className="text-xs text-success mt-1">
                {data.stats.activeEnrollments} активных
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Заявок</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.stats.totalApplications}</p>
              <p className="text-xs text-warning mt-1">
                {data.stats.pendingApplications} на рассмотрении
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Одобрено</p>
              <p className="text-3xl font-bold text-success mt-2">{data.stats.approvedApplications}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Отклонено</p>
              <p className="text-3xl font-bold text-destructive mt-2">{data.stats.rejectedApplications}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'applications' ? 'primary' : 'outline'}
              onClick={() => {
                setActiveTab('applications');
                setFilter('all');
              }}
            >
              Заявки ({data.applications.length})
              {data.stats.pendingApplications > 0 && (
                <Badge variant="warning" className="ml-2">
                  {data.stats.pendingApplications}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'enrollments' ? 'primary' : 'outline'}
              onClick={() => {
                setActiveTab('enrollments');
                setFilter('all');
              }}
            >
              Зачисления ({data.enrollments.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Фильтр:</span>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Все
              </Button>
              {activeTab === 'applications' ? (
                <>
                  <Button
                    variant={filter === 'pending' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('pending')}
                  >
                    На рассмотрении ({data.stats.pendingApplications})
                  </Button>
                  <Button
                    variant={filter === 'approved' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('approved')}
                  >
                    Одобрено ({data.stats.approvedApplications})
                  </Button>
                  <Button
                    variant={filter === 'rejected' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('rejected')}
                  >
                    Отклонено ({data.stats.rejectedApplications})
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={filter === 'active' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('active')}
                  >
                    Активные ({data.stats.activeEnrollments})
                  </Button>
                  <Button
                    variant={filter === 'completed' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('completed')}
                  >
                    Завершённые ({data.stats.completedEnrollments})
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === 'applications' ? (
        <div className="space-y-3">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  title="Нет заявок"
                  description="Нет заявок по выбранному фильтру"
                />
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} hover>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {application.user.fullName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {application.course.translations[0]?.title}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                            <span>{application.user.email}</span>
                            {application.user.phone && <span>{application.user.phone}</span>}
                          </div>
                        </div>
                        <Badge variant={getStatusColor(application.status)}>
                          {getStatusLabel(application.status)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Подана: {formatDate(application.submittedAt)}
                        </span>
                        {application.reviewedAt && (
                          <span className="text-muted-foreground">
                            Рассмотрена: {formatDate(application.reviewedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEnrollments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  title="Нет зачислений"
                  description="Нет зачислений по выбранному фильтру"
                />
              </CardContent>
            </Card>
          ) : (
            filteredEnrollments.map((enrollment) => (
              <Card key={enrollment.id} hover>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {enrollment.student.user.fullName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Группа: {enrollment.group.name}
                          </p>
                          {enrollment.group.course && (
                            <p className="text-sm text-muted-foreground">
                              Курс: {enrollment.group.course.translations[0]?.title}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                            <span>{enrollment.student.user.email}</span>
                            {enrollment.student.user.phone && <span>{enrollment.student.user.phone}</span>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={getStatusColor(enrollment.status)}>
                            {getStatusLabel(enrollment.status)}
                          </Badge>
                          <Badge variant={getStatusColor(enrollment.student.status)}>
                            {getStatusLabel(enrollment.student.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Зачислен: {formatDate(enrollment.enrolledAt)}
                        </span>
                        {enrollment.completedAt && (
                          <span className="text-success">
                            Завершён: {formatDate(enrollment.completedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
