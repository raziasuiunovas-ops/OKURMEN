'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  progressData: Array<{ date: string; progress: number; students: number }>;
  activityData: Array<{ date: string; lessons: number; quizzes: number }>;
  performanceData: Array<{ range: string; count: number }>;
  summary: {
    totalStudents: number;
    averageProgress: number;
    completedLessons: number;
    passedQuizzes: number;
  };
}

type AnalyticsType = 'progress' | 'activity' | 'performance';
type Period = '7d' | '30d' | '90d';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState<AnalyticsType>('progress');
  const [period, setPeriod] = useState<Period>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [activeType, period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.employee.getAnalytics({ type: activeType, period });
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error('Load analytics error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки аналитики');
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
        <h1 className="text-3xl font-bold">Аналитика</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadAnalytics}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const hasData = 
    (activeType === 'progress' && data.progressData.length > 0) ||
    (activeType === 'activity' && data.activityData.length > 0) ||
    (activeType === 'performance' && data.performanceData.length > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Аналитика</h1>
          <p className="text-muted-foreground mt-1">
            Отслеживайте прогресс и активность студентов
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Всего студентов</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.summary.totalStudents}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Средний прогресс</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.summary.averageProgress}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Завершено уроков</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.summary.completedLessons}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Пройдено тестов</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {data.summary.passedQuizzes}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Тип:</span>
              <div className="flex gap-2">
                <Button
                  variant={activeType === 'progress' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveType('progress')}
                >
                  Прогресс
                </Button>
                <Button
                  variant={activeType === 'activity' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveType('activity')}
                >
                  Активность
                </Button>
                <Button
                  variant={activeType === 'performance' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveType('performance')}
                >
                  Успеваемость
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Период:</span>
              <div className="flex gap-2">
                <Button
                  variant={period === '7d' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod('7d')}
                >
                  7 дней
                </Button>
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      {!hasData ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Нет данных"
              description="За выбранный период нет данных для отображения"
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress Chart */}
          {activeType === 'progress' && data.progressData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Динамика прогресса</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.progressData}>
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
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Средний прогресс (%)"
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      name="Активных студентов"
                      dot={{ fill: 'hsl(var(--success))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Activity Chart */}
          {activeType === 'activity' && data.activityData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Активность студентов</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.activityData}>
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
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="lessons"
                      fill="hsl(var(--primary))"
                      name="Завершено уроков"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="quizzes"
                      fill="hsl(var(--success))"
                      name="Пройдено тестов"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Performance Chart */}
          {activeType === 'performance' && data.performanceData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Распределение успеваемости</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.performanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category"
                      dataKey="range" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      name="Количество студентов"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.performanceData.map((item, index) => {
                    const percentage = data.summary.totalStudents > 0 
                      ? ((item.count / data.summary.totalStudents) * 100).toFixed(1)
                      : '0';
                    
                    return (
                      <div key={index} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">{item.range}</span>
                          <span className="text-2xl font-bold text-foreground">{item.count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{percentage}% от всех студентов</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Рекомендации</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.summary.averageProgress < 50 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <svg className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-foreground">Низкий средний прогресс</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Средний прогресс группы ниже 50%. Рекомендуется провести дополнительные консультации со студентами.
                  </p>
                </div>
              </div>
            )}

            {data.summary.totalStudents > 0 && data.summary.completedLessons === 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-foreground">Нет завершённых уроков</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Студенты не завершили ни одного урока. Проверьте, понятны ли им задания и материалы курса.
                  </p>
                </div>
              </div>
            )}

            {data.summary.averageProgress >= 70 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-foreground">Отличный прогресс!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Средний прогресс группы выше 70%. Продолжайте в том же духе!
                  </p>
                </div>
              </div>
            )}

            {!data.summary.averageProgress && data.summary.totalStudents === 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted border border-border">
                <svg className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-foreground">Нет данных для анализа</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Когда студенты начнут проходить уроки, здесь появится детальная аналитика их прогресса.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
