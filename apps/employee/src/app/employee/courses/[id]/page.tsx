'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatDuration } from '@/lib/utils';
import Link from 'next/link';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/employee/courses/${courseId}`);
      
      if (response.data.success) {
        setCourse(response.data.data);
      }
    } catch (err: any) {
      console.error('Load course error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки курса');
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
          action={<Button onClick={loadCourse}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const translation = course.translations[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Назад к курсам
      </Button>

      {/* Course Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* Course Image */}
            {course.coverImage && (
              <div className="flex-shrink-0 w-48 h-32 rounded-lg bg-muted overflow-hidden">
                <img
                  src={course.coverImage}
                  alt={translation?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Course Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {translation?.title || 'Без названия'}
                  </h1>
                  {translation?.description && (
                    <p className="text-muted-foreground">{translation.description}</p>
                  )}
                </div>
                <Badge variant={course.isPublished ? 'success' : 'secondary'}>
                  {course.isPublished ? 'Опубликован' : 'Черновик'}
                </Badge>
              </div>

              {/* Course Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {course.format && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {course.format}
                  </span>
                )}
                {course.duration && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDuration(course.duration)}
                  </span>
                )}
                {course.price && (
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.price} {course.currency || 'KGS'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Всего уроков</p>
            <p className="text-3xl font-bold text-foreground">{course.stats.totalLessons}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Опубликовано</p>
            <p className="text-3xl font-bold text-success">{course.stats.publishedLessons}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Черновиков</p>
            <p className="text-3xl font-bold text-warning">{course.stats.draftLessons}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Студентов</p>
            <p className="text-3xl font-bold text-foreground">{course.stats.totalStudents}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {course.stats.activeStudents} активных
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lessons */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Уроки курса ({course.lessons.length})</CardTitle>
            <Link href="/employee/lessons">
              <Button variant="outline" size="sm">
                Все уроки
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {course.lessons.length === 0 ? (
            <EmptyState
              title="Нет уроков"
              description="В этом курсе пока нет уроков"
            />
          ) : (
            <div className="space-y-3">
              {course.lessons.map((lesson: any, index: number) => (
                <div
                  key={lesson.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all"
                >
                  {/* Order Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">{lesson.order || index + 1}</span>
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          {lesson.translations[0]?.title || 'Без названия'}
                        </h4>
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
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {lesson.type && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          {lesson.type}
                        </span>
                      )}
                      {lesson.duration && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDuration(lesson.duration)}
                        </span>
                      )}
                      {lesson.videoUrl && (
                        <span className="flex items-center gap-1 text-primary">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Видео
                        </span>
                      )}
                      {lesson.createdAt && (
                        <span>Создан {formatDate(lesson.createdAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students Enrolled */}
      {course.enrolledGroups && course.enrolledGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Группы на курсе ({course.enrolledGroups.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {course.enrolledGroups.map((group: any) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-foreground">{group.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {group._count.students} студентов
                      </p>
                    </div>
                  </div>
                  <Badge variant={group.isActive ? 'success' : 'secondary'}>
                    {group.isActive ? 'Активна' : 'Неактивна'}
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
