'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';

interface ReviewWithDetails {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  student: {
    user: {
      fullName: string;
      email: string;
    };
  };
  course: {
    translations: Array<{ title: string }>;
  };
}

interface ReviewsData {
  reviews: ReviewWithDetails[];
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      '5': number;
      '4': number;
      '3': number;
      '2': number;
      '1': number;
    };
    recentReviews: number;
  };
}

export default function ReviewsPage() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/employee/reviews');
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error('Load reviews error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки отзывов');
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
        <h1 className="text-3xl font-bold">Отзывы</h1>
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={<Button onClick={loadReviews}>Попробовать снова</Button>}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Filter reviews
  const filteredReviews = data.reviews.filter((review) => {
    if (filter === 'all') return true;
    return review.rating === parseInt(filter);
  });

  const getRatingColor = (rating: number): string => {
    if (rating >= 4) return 'text-success';
    if (rating >= 3) return 'text-warning';
    return 'text-destructive';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-warning fill-current' : 'text-muted'}`}
            fill={star <= rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Отзывы</h1>
          <p className="text-muted-foreground mt-1">
            Отзывы студентов о курсах
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Всего отзывов</p>
              <p className="text-3xl font-bold text-foreground mt-2">{data.stats.totalReviews}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.stats.recentReviews} за последние 30 дней
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Средний рейтинг</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className={`text-3xl font-bold ${getRatingColor(data.stats.averageRating)}`}>
                  {data.stats.averageRating.toFixed(1)}
                </p>
                <svg className="w-8 h-8 text-warning fill-current" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3 text-center">Распределение</p>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = data.stats.ratingDistribution[rating as keyof typeof data.stats.ratingDistribution];
                  const percentage = data.stats.totalReviews > 0
                    ? (count / data.stats.totalReviews) * 100
                    : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-8">{rating}★</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-warning transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
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
                Все ({data.reviews.length})
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = data.stats.ratingDistribution[rating as keyof typeof data.stats.ratingDistribution];
                return (
                  <Button
                    key={rating}
                    variant={filter === rating.toString() ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(rating.toString() as any)}
                  >
                    {rating}★ ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
              title="Нет отзывов"
              description={
                filter === 'all'
                  ? 'Пока нет отзывов'
                  : `Нет отзывов с рейтингом ${filter}★`
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} hover>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {review.student.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {review.student.user.fullName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {review.course.translations[0]?.title}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      {renderStars(review.rating)}
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {review.comment}
                        </p>
                      </div>
                    )}

                    {!review.comment && (
                      <p className="text-sm text-muted-foreground italic">
                        Отзыв без комментария
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
