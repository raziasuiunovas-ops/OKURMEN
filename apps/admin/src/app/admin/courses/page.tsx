'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Code,
  Brain,
  GraduationCap,
  Film,
  Wrench,
  Globe,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ImageUploader from '@/components/ImageUploader';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface Course {
  id: string;
  slug: string;
  price: number;
  duration: string;
  totalHours?: number;
  format: string;
  coverImage?: string;
  coverGradient?: string;
  colorTheme?: string; // NEW: Solid hex color
  icon?: string;
  rating?: number;
  totalReviews?: number;
  enrolledStudents?: number;
  isActive: boolean;
  translations: Array<{
    title: string;
    description?: string;
    level: string;
  }>;
  _count?: {
    enrollments: number;
  };
}

// Единый градиент для всех курсов (в стиле бренда OKURMEN)
const DEFAULT_GRADIENT = {
  id: 1,
  name: 'OKURMEN Orange',
  from: '#FF6B35',
  to: '#F7931E',
  preview: 'from-orange-500 to-orange-600'
};

// Lucide-иконки для курсов
const COURSE_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: 'Code', icon: Code },
  { name: 'Brain', icon: Brain },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Film', icon: Film },
  { name: 'Wrench', icon: Wrench },
  { name: 'Globe', icon: Globe },
  { name: 'Zap', icon: Zap },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Users', icon: Users },
  { name: 'Star', icon: Star },
  { name: 'TrendingUp', icon: TrendingUp },
];

// Маппинг строковых имён на компоненты иконок
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Brain,
  GraduationCap,
  Film,
  Wrench,
  Globe,
  Zap,
  Sparkles,
  BookOpen,
  Users,
  Star,
  TrendingUp,
};

export default function CoursesPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${apiUrl}/api/courses?includeInactive=true`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    (course.translations[0]?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.translations[0]?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm(t('courses.confirmDelete'))) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${apiUrl}/api/courses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
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
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              Управление курсами
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Всего: {courses.length} курсов • Активных: {courses.filter(c => c.isActive).length}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center px-4 sm:px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all space-x-2 font-medium min-h-[48px] flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm sm:text-base">Создать курс</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск курсов..."
          className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-all text-sm sm:text-base min-h-[48px]"
        />
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Курсы не найдены</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Создайте первый курс, чтобы начать работу
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => setEditingCourse(course)}
              onDelete={() => handleDelete(course.id)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingCourse) && (
        <CourseModal
          course={editingCourse}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCourse(null);
          }}
          onSuccess={() => {
            fetchCourses();
            setShowCreateModal(false);
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
}

// Course Card Component with Gradient & Icon
function CourseCard({
  course,
  onEdit,
  onDelete,
}: {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useLanguage();
  const translation = course.translations[0];
  const rating = Number(course.rating) || 0;
  const students = course.enrolledStudents || 0;
  const reviews = course.totalReviews || 0;
  const hours = course.totalHours || 0;

  // Получаем компонент иконки из маппинга
  const IconComponent = course.icon ? ICON_MAP[course.icon] || BookOpen : BookOpen;

  // Используем colorTheme если есть, иначе дефолтный градиент
  const backgroundColor = course.colorTheme || '#FF6B35'; // Orange по умолчанию
  
  const backgroundStyle = {
    backgroundColor: backgroundColor,
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700">
      {/* Cover - Solid Color (NO gradient, NO image) */}
      <div
        className="h-40 sm:h-48 relative overflow-hidden flex items-center justify-center"
        style={backgroundStyle}
      >
        {/* Icon */}
        <IconComponent className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-2xl" strokeWidth={1.5} />

        {/* Status Badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span
            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
              course.isActive
                ? 'bg-green-500/90 text-white'
                : 'bg-gray-500/90 text-white'
            }`}
          >
            {course.isActive ? t('common.active') : t('common.inactive')}
          </span>
        </div>

        {/* Trending Badge (if high rating) */}
        {rating >= 4.5 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className="px-2 sm:px-3 py-1 bg-orange-500/90 text-white rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className="hidden xs:inline">{t('courses.popular')}</span>
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-500 transition-colors">
          {translation?.title || 'Без названия'}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {translation?.description || t('courses.noDescription')}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm gap-2">
          {/* Rating */}
          <div className="flex items-center gap-1 min-w-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                  star <= Math.round(rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="ml-1 text-gray-600 dark:text-gray-400 font-medium truncate">
              {rating.toFixed(1)}
            </span>
            {reviews > 0 && (
              <span className="text-gray-400 dark:text-gray-500 text-xs hidden sm:inline">
                ({reviews})
              </span>
            )}
          </div>

          {/* Students */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 flex-shrink-0">
            <Users className="w-4 h-4" />
            <span className="font-medium">{students}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 min-w-0">
            <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {hours > 0 ? `${hours} ч` : 'Нет уроков'}
              </div>
              <div className="text-xs truncate">Длительность</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 min-w-0">
            <BookOpen className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {course.duration || 'Не указан'}
              </div>
              <div className="text-xs truncate">Период</div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-orange-500 truncate">
              {course.price.toLocaleString()}
            </span>
            <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{t('courses.som')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onEdit}
            className="flex-1 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium min-h-[44px] text-sm sm:text-base"
          >
            <Edit className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Изменить</span>
          </button>
          <button
            onClick={onDelete}
            className="px-3 sm:px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Course Modal Component
function CourseModal({
  course,
  onClose,
  onSuccess,
}: {
  course: Course | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useLanguage();
  const [coverType, setCoverType] = useState<'gradient' | 'image'>(
    course?.coverImage ? 'image' : 'gradient'
  );
  
  const [formData, setFormData] = useState({
    slug: course?.slug || '',
    price: course?.price || 0,
    duration: course?.duration || '',
    format: course?.format || 'HYBRID',
    coverImage: course?.coverImage || '',
    coverGradient: JSON.stringify(DEFAULT_GRADIENT),
    colorTheme: course?.colorTheme || '#FF6B35', // NEW: Solid color (default orange)
    icon: course?.icon || 'Code',
    isActive: course?.isActive ?? true,
    translations: [
      {
        languageCode: 'RU',
        title: course?.translations[0]?.title || '',
        description: course?.translations[0]?.description || '',
        level: course?.translations[0]?.level || 'BEGINNER',
      },
    ],
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const token = localStorage.getItem('auth-token');
      const url = course
        ? `${apiUrl}/api/courses/${course.id}`
        : `${apiUrl}/api/courses`;

      // Формируем payload правильно для POST/PATCH
      const payload: any = {
        price: Number(formData.price),
        duration: (formData.duration && formData.duration.trim()) || undefined,
        format: formData.format,
        coverImage: coverType === 'image' && formData.coverImage && formData.coverImage.trim() ? formData.coverImage : undefined,
        coverGradient: coverType === 'gradient' ? JSON.stringify(DEFAULT_GRADIENT) : undefined,
        colorTheme: (formData.colorTheme && formData.colorTheme.trim()) || undefined, // NEW: Send color
        icon: (formData.icon && formData.icon.trim()) || undefined,
        isActive: formData.isActive,
        translations: formData.translations.map(t => ({
          languageCode: t.languageCode,
          title: t.title,
          description: (t.description && t.description.trim()) || undefined,
          level: t.level,
        })),
      };

      // Для POST (создание) добавляем slug
      if (!course) {
        payload.slug = formData.slug;
      }

      console.log('=== COURSE SAVE DEBUG ===');
      console.log('Method:', course ? 'PATCH' : 'POST');
      console.log('URL:', url);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
        method: course ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        console.log('✅ Save successful');
        onSuccess();
      } else {
        const text = await response.text();
        console.error('❌ Save failed. Response body:', text);
        
        try {
          const error = JSON.parse(text);
          alert(`Ошибка: ${JSON.stringify(error.fieldErrors || error.error || error.message || 'Не удалось сохранить курс', null, 2)}`);
        } catch {
          alert(`Ошибка: ${response.status} ${response.statusText}\n${text.substring(0, 200)}`);
        }
      }
    } catch (error) {
      console.error('Failed to save course:', error);
      alert('Ошибка при сохранении курса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full my-4 sm:my-8">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {course ? 'Редактировать курс' : 'Создать новый курс'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(100vh-120px)] sm:max-h-[70vh] overflow-y-auto">
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 min-w-0">
                <p className="font-medium mb-1">Автоматические расчеты</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li className="break-words">Рейтинг — из отзывов</li>
                  <li className="break-words">Студенты — из активных записей</li>
                  <li className="break-words">Часы — из уроков</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Название курса *
              </label>
              <input
                type="text"
                value={formData.translations[0].title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: [{ ...formData.translations[0], title: e.target.value }],
                  })
                }
                className="w-full px-3 sm:px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm sm:text-base min-h-[48px]"
                required
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Описание
              </label>
              <textarea
                value={formData.translations[0].description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: [{ ...formData.translations[0], description: e.target.value }],
                  })
                }
                rows={3}
                className="w-full px-3 sm:px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm sm:text-base resize-y"
              />
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="frontend-development"
                className="w-full px-3 sm:px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm sm:text-base min-h-[48px]"
                required
              />
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('courses.priceRequired')}
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 sm:px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm sm:text-base min-h-[48px]"
                required
              />
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Длительность
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="6 месяцев"
                className="w-full px-3 sm:px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm sm:text-base min-h-[48px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Часы рассчитываются из уроков
              </p>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Формат
              </label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-3 sm:px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm sm:text-base min-h-[48px]"
              >
                <option value="ONLINE">Онлайн</option>
                <option value="OFFLINE">Оффлайн</option>
                <option value="HYBRID">Гибрид</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Уровень
              </label>
              <select
                value={formData.translations[0].level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: [{ ...formData.translations[0], level: e.target.value }],
                  })
                }
                className="w-full px-3 sm:px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm sm:text-base min-h-[48px]"
              >
                <option value="BEGINNER">Начальный</option>
                <option value="INTERMEDIATE">Средний</option>
                <option value="ADVANCED">Продвинутый</option>
              </select>
            </div>
          </div>

          {/* Cover Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Обложка курса
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
              <button
                type="button"
                onClick={() => setCoverType('gradient')}
                className={`flex-1 px-3 sm:px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 min-h-[48px] ${
                  coverType === 'gradient'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Palette className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Градиент + Иконка</span>
              </button>
              <button
                type="button"
                onClick={() => setCoverType('image')}
                className={`flex-1 px-3 sm:px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 min-h-[48px] ${
                  coverType === 'image'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <ImageIcon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Загрузить фото</span>
              </button>
            </div>

            {/* Solid Color Picker */}
            {coverType === 'gradient' && (
              <div className="space-y-4">
                {/* Color Theme Selector */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Цвет курса (однотонный фон):
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.colorTheme}
                      onChange={(e) => setFormData({ ...formData, colorTheme: e.target.value })}
                      className="w-16 h-16 rounded-xl cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.colorTheme}
                        onChange={(e) => setFormData({ ...formData, colorTheme: e.target.value })}
                        placeholder="#FF6B35"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white text-sm font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">Введите hex-код или выберите цвет</p>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Предпросмотр:</p>
                    <div 
                      className="h-20 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: formData.colorTheme }}
                    >
                      {formData.icon && ICON_MAP[formData.icon] && 
                        React.createElement(ICON_MAP[formData.icon], {
                          className: 'w-12 h-12 text-white drop-shadow-2xl',
                          strokeWidth: 1.5
                        })
                      }
                    </div>
                  </div>

                  {/* Preset Colors */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Готовые цвета:</p>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                      {[
                        { name: 'Оранжевый', color: '#FF6B35' },
                        { name: 'Синий', color: '#1E40AF' },
                        { name: 'Фиолетовый', color: '#7C3AED' },
                        { name: 'Зелёный', color: '#059669' },
                        { name: 'Бордовый', color: '#BE123C' },
                        { name: 'Тёмно-синий', color: '#1E3A8A' },
                        { name: 'Изумрудный', color: '#047857' },
                        { name: 'Индиго', color: '#4F46E5' },
                        { name: 'Розовый', color: '#DB2777' },
                        { name: 'Жёлтый', color: '#CA8A04' },
                        { name: 'Бирюзовый', color: '#0891B2' },
                        { name: 'Красный', color: '#DC2626' },
                      ].map((preset) => (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => setFormData({ ...formData, colorTheme: preset.color })}
                          className={`h-10 rounded-lg transition-all hover:scale-110 ${
                            formData.colorTheme === preset.color
                              ? 'ring-2 ring-offset-2 ring-orange-500 dark:ring-offset-gray-800'
                              : ''
                          }`}
                          style={{ backgroundColor: preset.color }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Icon Selector */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Выберите иконку:</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {COURSE_ICONS.map((iconItem) => {
                      const IconComponent = iconItem.icon;
                      return (
                        <button
                          key={iconItem.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: iconItem.name })}
                          className={`h-14 sm:h-16 rounded-xl transition-all hover:scale-110 flex items-center justify-center ${
                            formData.icon === iconItem.name
                              ? 'bg-orange-100 dark:bg-orange-900/30 ring-2 ring-orange-500'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Image Upload */}
            {coverType === 'image' && (
              <div>
                <ImageUploader
                  currentImage={formData.coverImage}
                  onImageSelect={(base64) => setFormData({ ...formData, coverImage: base64 })}
                  label="Загрузить изображение курса"
                  aspectRatio="16:9"
                  maxSizeMB={5}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('common.activeOnSite')}
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-medium text-sm sm:text-base min-h-[48px]"
            >
              {loading ? 'Сохранение...' : course ? 'Сохранить изменения' : 'Создать курс'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium text-sm sm:text-base min-h-[48px]"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
