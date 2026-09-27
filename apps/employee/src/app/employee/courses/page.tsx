'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Course } from '@/types';

interface CourseWithStats {
  id: string;
  isPublished: boolean;
  price: number | null;
  currency: string | null;
  coverImage: string | null;
  format: string | null;
  duration: number | null;
  translations: Array<{ title: string; description?: string; language: string }>;
  _count: {
    lessons: number;
    enrollments: number;
  };
  stats: {
    publishedLessons: number;
    draftLessons: number;
    activeStudents: number;
    completedStudents: number;
  };
}

interface CoursesData {
  courses: CourseWithStats[];
  summary: {
    totalCourses: number;
    totalLessons: number;
    totalStudents: number;
    publishedCourses: number;
  };
}

export default function CoursesPage() {
  const [data, setData] = useState<CoursesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.employee.getMyCourses();
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error('Load courses error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки курсов');
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
        <h1 className="text-3xl font-bold">Мои курсы</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadCourses}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!data || data.courses.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Мои курсы</h1>
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          title="Нет курсов"
          description="Вам пока не назначены курсы для преподавания"
        />
      </div>
    );
  }

  // Filter courses
  const filteredCourses = data.courses.filter((course) => {
    if (filter === 'published') return course.isPublished;
    if (filter === 'draft') return !course.isPublished;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Мои курсы</h1>
          <p className="text-muted-foreground mt-1">
            Управление курсами и уроками
          </p>
        </div>
        <Link href="/employee/lessons">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Все уроки
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Всего курсов</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.summary.totalCourses}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.summary.publishedCourses} опубликовано
              </p>
            </div>
          </CardContent>
        </Card>

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
              <p className="text-sm text-muted-foreground">Студентов</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.summary.totalStudents}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Link href="/employee/schedule">
                <Button variant="outline" className="w-full">
                  Расписание
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

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
                Все ({data.courses.length})
              </Button>
              <Button
                variant={filter === 'published' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('published')}
              >
                Опубликованные ({data.courses.filter(c => c.isPublished).length})
              </Button>
              <Button
                variant={filter === 'draft' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('draft')}
              >
                Черновики ({data.courses.filter(c => !c.isPublished).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Link key={course.id} href={`/employee/courses/${course.id}`}>
            <Card hover className="h-full">
              {/* Course Image */}
              {course.coverImage && (
                <div className="w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={course.coverImage}
                    alt={course.translations[0]?.title || 'Course'}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}

              <CardContent className="pt-6">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-2 flex-1">
                    {course.translations[0]?.title || 'Без названия'}
                  </h3>
                  <Badge variant={course.isPublished ? 'success' : 'secondary'}>
                    {course.isPublished ? 'Опубликован' : 'Черновик'}
                  </Badge>
                </div>

                {/* Description */}
                {course.translations[0]?.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {course.translations[0].description}
                  </p>
                )}

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Уроков:</span>
                    <span className="font-medium text-foreground">
                      {course._count.lessons} 
                      <span className="text-muted-foreground text-xs ml-1">
                        ({course.stats.publishedLessons} опубл.)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Студентов:</span>
                    <span className="font-medium text-foreground">
                      {course._count.enrollments}
                      {course.stats.activeStudents > 0 && (
                        <span className="text-success text-xs ml-1">
                          ({course.stats.activeStudents} активных)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {course.format && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {course.format}
                      </span>
                    )}
                    {course.price && (
                      <span className="font-medium text-foreground">
                        {course.price} {course.currency || 'KGS'}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {filteredCourses.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title="Нет курсов"
              description={`Нет курсов по выбранному фильтру: ${
                filter === 'published' ? 'Опубликованные' : 
                filter === 'draft' ? 'Черновики' : 
                'Все'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
