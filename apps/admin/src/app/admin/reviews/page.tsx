'use client';

import { useEffect, useState } from 'react';
import { Search, Star, Check, X, Eye } from 'lucide-react';

// Disable SSR for this page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface Review {
  id: string;
  rating: number;
  text: string;
  status: string;
  user: {
    name: string;
    email: string;
  } | null;
  course: {
    title: string;
  } | null;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/reviews', {
        credentials: 'include',
      });
      const data = await response.json();
      setReviews(data.data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3002/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      (review.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (review.course?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'ALL' || review.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Отзывы
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Управление отзывами студентов
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, отзыву или курсу"
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-all"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-all"
        >
          <option value="ALL">Все статусы</option>
          <option value="PENDING">На модерации</option>
          <option value="PUBLISHED">Опубликовано</option>
          <option value="REJECTED">Отклонено</option>
        </select>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Отзывы не найдены</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Review Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {review.user?.name || 'Аноним'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.user?.email || 'Нет email'}
                      </p>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  {renderStars(review.rating)}

                  {review.course && (
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Курс:</span>{' '}
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        {review.course?.title || 'Курс не указан'}
                      </span>
                    </div>
                  )}

                  <p className="text-gray-700 dark:text-gray-300">
                    {review.text || 'Нет текста отзыва'}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(review.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>

                {/* Actions */}
                {review.status === 'PENDING' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateStatus(review.id, 'PUBLISHED')}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Опубликовать</span>
                    </button>
                    <button
                      onClick={() => updateStatus(review.id, 'REJECTED')}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Отклонить</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
