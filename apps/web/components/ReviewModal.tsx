'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Course {
  id: string;
  slug: string;
  translations: {
    language: string;
    title: string;
  }[];
}

export default function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const { data: session } = useSession();
  const t = useTranslations('reviews');
  const locale = useLocale();
  
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');

  // Загрузка имени пользователя из сессии
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // Загрузка списка курсов
  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/courses`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError(t('form_required'));
      return;
    }

    if (!text.trim()) {
      setError(t('form_required'));
      return;
    }

    // Проверка минимальной длины отзыва - 50 символов
    if (text.trim().length < 50) {
      setError('Минимальная длина отзыва — 50 символов.');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      
      const requestBody = {
        authorName: name.trim(),
        reviewType: 'STUDENT',
        text: text.trim(),
        rating,
        courseId: courseId || undefined,
        userId: session?.user?.id || undefined,
        status: 'PENDING',
      };
      
      console.log('[ReviewModal] Sending review:', requestBody);
      
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[ReviewModal] Response status:', response.status);
      
      const data = await response.json();
      
      console.log('[ReviewModal] Response data:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || t('form_error'));
      }

      // Успех
      setName('');
      setCourseId('');
      setRating(5);
      setText('');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
      
      // Показать уведомление об успехе
      alert(t('form_success'));
    } catch (error: any) {
      console.error('[ReviewModal] Error:', error);
      setError(error.message || t('form_error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[600px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - фиксированный */}
        <div className="flex-shrink-0 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            aria-label={t('form_cancel')}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 pr-10">
            {t('form_title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('description')}
          </p>
        </div>

        {/* Form - прокручиваемый контент */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="space-y-5 p-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('form_name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder={t('form_name')}
              required
            />
          </div>

          {/* Course */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('form_course')}
            </label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            >
              <option value="">{t('form_select_course')}</option>
              {courses.map((course) => {
                const translation = course.translations.find(
                  (tr) => tr.language === locale.toUpperCase()
                ) || course.translations[0];
                
                return (
                  <option key={course.id} value={course.id}>
                    {translation?.title || course.slug}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('form_rating')} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {t('form_text')} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
              placeholder={t('form_text')}
              required
              minLength={50}
              maxLength={500}
            />
            <p className={`text-xs mt-1.5 ${text.length < 50 ? 'text-orange-600 dark:text-orange-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
              {text.length} / 500 {text.length < 50 && `(минимум 50)`}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer - фиксированный */}
        <div className="flex-shrink-0 bg-white dark:bg-slate-900 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              {t('form_cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '...' : t('form_submit')}
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
}
