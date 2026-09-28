'use client';

import { useState, useEffect } from 'react';
import { Send, User, Phone, Mail, BookOpen, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

interface Course {
  id: string;
  translation: {
    title: string;
  };
}

export default function ApplicationFormSection() {
  const locale = useLocale();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    courseId: '',
    comment: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/api/courses?language=${locale.toUpperCase()}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setCourses(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [locale]);

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      phone: '',
      email: '',
    };

    let isValid = true;

    // Валидация имени и фамилии (обязательно)
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Имя и фамилия обязательны';
      isValid = false;
    } else if (formData.fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Укажите имя и фамилию';
      isValid = false;
    }

    // Валидация телефона (обязательно)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
      isValid = false;
    } else if (!/^\+?[0-9\s\-()]{9,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Некорректный формат телефона';
      isValid = false;
    }

    // Валидация email (необязательно, но если указан - должен быть корректным)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Некорректный формат email';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          courseId: formData.courseId || undefined,
          comment: formData.comment.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          courseId: '',
          comment: '',
        });
        setErrors({
          fullName: '',
          phone: '',
          email: '',
        });
      } else {
        setError(data.message || 'Произошла ошибка при отправке заявки');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Произошла ошибка при отправке заявки. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="application" className="py-20 bg-slate-50 dark:bg-slate-800/50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Оставьте заявку
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Заполните форму, и мы свяжемся с вами для консультации
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-premium-lg border border-slate-200 dark:border-slate-700 p-8 md:p-12">
            {success ? (
              <div className="text-center py-12">
                <div className="inline-flex p-6 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                  <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Заявка отправлена!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Спасибо за интерес к нашим курсам. Мы свяжемся с вами в ближайшее время.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Имя и Фамилия <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                        errors.fullName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                      } rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400`}
                      placeholder="Иван Иванов"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Телефон <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                        errors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                      } rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400`}
                      placeholder="+996 XXX XXX XXX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email <span className="text-slate-400 text-xs">(необязательно)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border ${
                        errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                      } rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Course Selection */}
                <div>
                  <label htmlFor="courseId" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Интересующий курс <span className="text-slate-400 text-xs">(необязательно)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <BookOpen className="w-5 h-5 text-slate-400" />
                    </div>
                    <select
                      id="courseId"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="">Выберите курс</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.translation?.title || 'Без названия'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Комментарий <span className="text-slate-400 text-xs">(необязательно)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-4 pointer-events-none">
                      <MessageSquare className="w-5 h-5 text-slate-400" />
                    </div>
                    <textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400 resize-none"
                      placeholder="Расскажите о ваших целях и вопросах..."
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Отправить заявку
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
