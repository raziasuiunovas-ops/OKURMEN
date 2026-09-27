'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatDuration } from '@/lib/utils';
import Link from 'next/link';

interface LessonWithCourse {
  id: string;
  translations: Array<{ title: string; description?: string; language: string }>;
  type: string;
  duration: number | null;
  order: number;
  isPublished: boolean;
  videoUrl: string | null;
  createdAt: Date;
  course: {
    id: string;
    translations: Array<{ title: string }>;
  };
  stats: {
    completedCount: number;
    averageProgress: number;
  };
}

interface LessonsData {
  lessons: LessonWithCourse[];
  summary: {
    totalLessons: number;
    publishedLessons: number;
    draftLessons: number;
    totalCompletions: number;
  };
}

export default function LessonsPage() {
  const [data, setData] = useState<LessonsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/employee/lessons');
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error('Load lessons error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки уроков');
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
        <h1 className="text-3xl font-bold">Все уроки</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadLessons}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!data || data.lessons.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Все уроки</h1>
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          }
          title="Нет уроков"
          description="У вас пока нет уроков в курсах"
        />
      </div>
    );
  }

  // Filter and search lessons
  const filteredLessons = data.lessons.filter((lesson) => {
    // Filter by status
    if (filter === 'published' && !lesson.isPublished) return false;
    if (filter === 'draft' && lesson.isPublished) return false;

    // Search by title
    if (searchQuery) {
      const title = lesson.translations[0]?.title?.toLowerCase() || '';
      const courseTitle = lesson.course.translations[0]?.title?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      return title.includes(query) || courseTitle.includes(query);
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Все уроки</h1>
          <p className="text-muted-foreground mt-1">
            Управление уроками из всех курсов
          </p>
        </div>
        <Link href="/employee/courses">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            К курсам
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Всего уроков</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.summary.totalLessons}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Опубликовано</p>
              <p className="text-3xl font-bold text-success mt-2">{data.summary.publishedLessons}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Черновиков</p>
              <p className="text-3xl font-bold text-warning mt-2">{data.summary.draftLessons}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Завершений</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.summary.totalCompletions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
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
                  Все ({data.summary.totalLessons})
                </Button>
                <Button
                  variant={filter === 'published' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('published')}
                >
                  Опубликованные ({data.summary.publishedLessons})
                </Button>
                <Button
                  variant={filter === 'draft' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('draft')}
                >
                  Черновики ({data.summary.draftLessons})
                </Button>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Поиск по названию урока или курса..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="space-y-3">
        {filteredLessons.map((lesson, index) => (
          <Card key={lesson.id} hover>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Order Number */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">{lesson.order || index + 1}</span>
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {lesson.translations[0]?.title || 'Без названия'}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        Курс: {lesson.course.translations[0]?.title || 'Без названия'}
                      </p>
                      {lesson.translations[0]?.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lesson.translations[0].description}
                        </p>
                      )}
                    </div>
                    <Badge variant={lesson.isPublished ? 'success' : 'secondary'}>
                      {lesson.isPublished ? 'Опубликован' : 'Черновик'}
                    </Badge>
                  </div>

                  {/* Lesson Meta */}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {lesson.type && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          {lesson.type}
                        </span>
                      )}
                      {lesson.duration && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDuration(lesson.duration)}
                        </span>
                      )}
                      {lesson.videoUrl && (
                        <span className="flex items-center gap-1 text-primary">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Видео
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        Завершений: <span className="font-medium text-foreground">{lesson.stats.completedCount}</span>
                      </span>
                      {lesson.stats.averageProgress > 0 && (
                        <span className="text-muted-foreground">
                          Средний прогресс: <span className="font-medium text-foreground">{lesson.stats.averageProgress}%</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredLessons.length === 0 && (
          <EmptyState
            title="Нет уроков"
            description={
              searchQuery 
                ? `Нет уроков по запросу "${searchQuery}"`
                : `Нет уроков по выбранному фильтру`
            }
          />
        )}
      </div>
    </div>
  );
}
