'use client';

import { useEffect, useState } from 'react';
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

// Предустановленные градиенты
const GRADIENTS = [
  { id: 1, name: 'Sunset', from: '#FF6B6B', to: '#FFE66D', preview: 'from-red-400 to-yellow-400' },
  { id: 2, name: 'Ocean', from: '#667eea', to: '#764ba2', preview: 'from-indigo-500 to-purple-600' },
  { id: 3, name: 'Forest', from: '#56ab2f', to: '#a8e063', preview: 'from-green-600 to-green-400' },
  { id: 4, name: 'Fire', from: '#f12711', to: '#f5af19', preview: 'from-red-600 to-orange-400' },
  { id: 5, name: 'Sky', from: '#2196F3', to: '#21CBF3', preview: 'from-blue-600 to-cyan-400' },
  { id: 6, name: 'Rose', from: '#eb3349', to: '#f45c43', preview: 'from-rose-600 to-orange-500' },
  { id: 7, name: 'Purple', from: '#8e2de2', to: '#4a00e0', preview: 'from-purple-600 to-indigo-700' },
  { id: 8, name: 'Teal', from: '#00d2ff', to: '#3a7bd5', preview: 'from-cyan-400 to-blue-600' },
];

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
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:3002/api/courses?includeInactive=true', {
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
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`http://localhost:3002/api/courses/${id}`, {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-orange-500" />
            Управление курсами
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Всего: {courses.length} курсов • Активных: {courses.filter(c => c.isActive).length}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Создать курс</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск курсов по названию или описанию..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-all"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const translation = course.translations[0];
  const rating = Number(course.rating) || 0;
  const students = course.enrolledStudents || 0;
  const reviews = course.totalReviews || 0;
  const hours = course.totalHours || 0;

  // Получаем компонент иконки из маппинга
  const IconComponent = course.icon ? ICON_MAP[course.icon] || BookOpen : BookOpen;

  // Парсим градиент или используем дефолтный
  let gradientStyle = {};
  if (course.coverGradient) {
    try {
      const gradient = JSON.parse(course.coverGradient);
      gradientStyle = {
        background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
      };
    } catch (e) {
      gradientStyle = {
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
      };
    }
  } else {
    gradientStyle = {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    };
  }

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700">
      {/* Cover Image or Gradient */}
      <div
        className="h-48 relative overflow-hidden"
        style={course.coverImage ? {} : gradientStyle}
      >
        {course.coverImage ? (
          <img
            src={course.coverImage}
            alt={translation?.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <IconComponent className="w-20 h-20 text-white drop-shadow-2xl" strokeWidth={1.5} />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
              course.isActive
                ? 'bg-green-500/90 text-white'
                : 'bg-gray-500/90 text-white'
            }`}
          >
            {course.isActive ? 'Активен' : 'Неактивен'}
          </span>
        </div>

        {/* Trending Badge (if high rating) */}
        {rating >= 4.5 && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-orange-500/90 text-white rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Популярный
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-500 transition-colors">
          {translation?.title || 'Без названия'}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {translation?.description || 'Нет описания'}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="ml-1 text-gray-600 dark:text-gray-400 font-medium">
              {rating.toFixed(1)}
            </span>
            {reviews > 0 && (
              <span className="text-gray-400 dark:text-gray-500 text-xs">
                ({reviews})
              </span>
            )}
          </div>

          {/* Students */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span className="font-medium">{students}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 text-orange-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {hours > 0 ? `${hours} часов` : 'Нет уроков'}
              </div>
              <div className="text-xs">Длительность</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BookOpen className="w-4 h-4 text-orange-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {course.duration || 'Не указан'}
              </div>
              <div className="text-xs">Период</div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-orange-500">
              {course.price.toLocaleString()}
            </span>
            <span className="text-gray-500 dark:text-gray-400">сом</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Edit className="w-4 h-4" />
            <span>Изменить</span>
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
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
  const [coverType, setCoverType] = useState<'gradient' | 'image'>(
    course?.coverImage ? 'image' : 'gradient'
  );
  
  const [formData, setFormData] = useState({
    slug: course?.slug || '',
    price: course?.price || 0,
    duration: course?.duration || '',
    format: course?.format || 'HYBRID',
    coverImage: course?.coverImage || '',
    coverGradient: course?.coverGradient || JSON.stringify(GRADIENTS[0]),
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
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth-token');
      const url = course
        ? `http://localhost:3002/api/courses/${course.id}`
        : 'http://localhost:3002/api/courses';

      const payload = {
        ...formData,
        coverImage: coverType === 'image' ? formData.coverImage : null,
        coverGradient: coverType === 'gradient' ? JSON.stringify(selectedGradient) : null,
      };

      const response = await fetch(url, {
        method: course ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error || 'Не удалось сохранить курс'}`);
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full my-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {course ? 'Редактировать курс' : 'Создать новый курс'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Автоматические расчеты</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Рейтинг рассчитывается из отзывов курса (CourseReview)</li>
                  <li>Количество студентов — из активных записей (Enrollment)</li>
                  <li>Длительность в часах — из опубликованных уроков (Lesson)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
                required
              />
            </div>

            <div className="col-span-2">
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="frontend-development"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Цена (сом) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Длительность (период обучения)
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="6 месяцев"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Общая длительность в часах рассчитывается автоматически из уроков
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Формат
              </label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
              >
                <option value="ONLINE">Онлайн</option>
                <option value="OFFLINE">Оффлайн</option>
                <option value="HYBRID">Гибрид</option>
              </select>
            </div>

            <div>
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
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
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setCoverType('gradient')}
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  coverType === 'gradient'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Palette className="w-5 h-5" />
                <span className="font-medium">Градиент + Иконка</span>
              </button>
              <button
                type="button"
                onClick={() => setCoverType('image')}
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  coverType === 'image'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="font-medium">Загрузить фото</span>
              </button>
            </div>

            {/* Gradient Picker */}
            {coverType === 'gradient' && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Выберите градиент:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {GRADIENTS.map((gradient) => (
                      <button
                        key={gradient.id}
                        type="button"
                        onClick={() => {
                          setSelectedGradient(gradient);
                          setFormData({
                            ...formData,
                            coverGradient: JSON.stringify(gradient),
                          });
                        }}
                        className={`h-20 rounded-xl transition-all hover:scale-105 ${
                          selectedGradient.id === gradient.id ? 'ring-4 ring-orange-500' : ''
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Выберите иконку:</p>
                  <div className="grid grid-cols-6 gap-2">
                    {COURSE_ICONS.map((iconItem) => {
                      const IconComponent = iconItem.icon;
                      return (
                        <button
                          key={iconItem.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: iconItem.name })}
                          className={`h-16 rounded-xl transition-all hover:scale-110 flex items-center justify-center ${
                            formData.icon === iconItem.name
                              ? 'bg-orange-100 dark:bg-orange-900/30 ring-2 ring-orange-500'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Загрузите изображение (пока недоступно - используйте URL)
                </p>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:text-white"
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
              Курс активен и отображается на сайте
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-medium"
            >
              {loading ? 'Сохранение...' : course ? 'Сохранить изменения' : 'Создать курс'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
