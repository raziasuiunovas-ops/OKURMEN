'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

interface ReportsData {
  summary: {
    totalRevenue: number;
    totalEnrollments: number;
    averageCompletionRate: number;
    studentRetentionRate: number;
  };
  coursePerformance: Array<{
    courseTitle: string;
    enrollments: number;
    completions: number;
    revenue: number;
    averageRating: number;
  }>;
  groupPerformance: Array<{
    groupName: string;
    totalStudents: number;
    activeStudents: number;
    averageProgress: number;
    completionRate: number;
  }>;
  teacherPerformance: Array<{
    teacherName: string;
    coursesCount: number;
    studentsCount: number;
    averageRating: number;
  }>;
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<'30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/employee/reports?period=${period}`);
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error('Load reports error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки отчётов');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Экспорт отчётов в разработке');
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Отчёты</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadReports}>Попробовать снова</Button>}
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
          <h1 className="text-3xl font-bold text-foreground">Отчёты</h1>
          <p className="text-muted-foreground mt-1">
            Аналитические отчёты и показатели
          </p>
        </div>
        <Button onClick={handleExport}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Экспорт
        </Button>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Период:</span>
            <div className="flex gap-2">
              <Button
                variant={period === '30d' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPeriod('30d')}
              >
                30 дней
              </Button>
              <Button
                variant={period === '90d' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPeriod('90d')}
              >
                90 дней
              </Button>
              <Button
                variant={period === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPeriod('all')}
              >
                Всё время
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Выручка</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.summary.totalRevenue.toLocaleString()} KGS
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Зачислений</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.summary.totalEnrollments}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Завершаемость</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.summary.averageCompletionRate}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Удержание</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.summary.studentRetentionRate}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Эффективность курсов</CardTitle>
        </CardHeader>
        <CardContent>
          {data.coursePerformance.length === 0 ? (
            <EmptyState
              title="Нет данных"
              description="Нет данных по курсам за выбранный период"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Курс</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Зачислений</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Завершений</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Выручка</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Рейтинг</th>
                  </tr>
                </thead>
                <tbody>
                  {data.coursePerformance.map((course, index) => (
                    <tr key={index} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-4 font-medium text-foreground">{course.courseTitle}</td>
                      <td className="py-3 px-4 text-center text-foreground">{course.enrollments}</td>
                      <td className="py-3 px-4 text-center text-foreground">{course.completions}</td>
                      <td className="py-3 px-4 text-center text-foreground">
                        {course.revenue.toLocaleString()} KGS
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {course.averageRating.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Эффективность групп</CardTitle>
        </CardHeader>
        <CardContent>
          {data.groupPerformance.length === 0 ? (
            <EmptyState
              title="Нет данных"
              description="Нет данных по группам"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Группа</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Всего</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Активных</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Прогресс</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Завершаемость</th>
                  </tr>
                </thead>
                <tbody>
                  {data.groupPerformance.map((group, index) => (
                    <tr key={index} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-4 font-medium text-foreground">{group.groupName}</td>
                      <td className="py-3 px-4 text-center text-foreground">{group.totalStudents}</td>
                      <td className="py-3 px-4 text-center text-success">{group.activeStudents}</td>
                      <td className="py-3 px-4 text-center text-foreground">{group.averageProgress}%</td>
                      <td className="py-3 px-4 text-center text-foreground">{group.completionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teacher Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Эффективность преподавателей</CardTitle>
        </CardHeader>
        <CardContent>
          {data.teacherPerformance.length === 0 ? (
            <EmptyState
              title="Нет данных"
              description="Нет данных по преподавателям"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Преподаватель</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Курсов</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Студентов</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Рейтинг</th>
                  </tr>
                </thead>
                <tbody>
                  {data.teacherPerformance.map((teacher, index) => (
                    <tr key={index} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-4 font-medium text-foreground">{teacher.teacherName}</td>
                      <td className="py-3 px-4 text-center text-foreground">{teacher.coursesCount}</td>
                      <td className="py-3 px-4 text-center text-foreground">{teacher.studentsCount}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {teacher.averageRating.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
