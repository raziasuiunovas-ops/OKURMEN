'use client';

import { useState, useEffect } from 'react';
import { Send, User, Phone, Mail, BookOpen, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface Course {
  id: string;
  translation: {
    title: string;
  };
}

export default function ApplicationFormSection() {
  const locale = useLocale();
  const t = useTranslations('application');
  const courseT = useTranslations('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+996 ',
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

    // Валидация имени (обязательно, фамилия не обязательна)
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('fullName_required');
      isValid = false;
    }

    // Валидация телефона (обязательно)
    if (!formData.phone.trim() || formData.phone.trim() === '+996') {
      newErrors.phone = t('phone_required');
      isValid = false;
    } else if (!/^\+996\s?\d{9}$/.test(formData.phone.trim().replace(/\s/g, ''))) {
      newErrors.phone = t('phone_error');
      isValid = false;
    }

    // Валидация email (необязательно, но если указан - должен быть корректным)
    const emailValue = formData.email.trim();
    if (emailValue) {
      const fullEmail = emailValue.includes('@') ? emailValue : `${emailValue}@gmail.com`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fullEmail)) {
        newErrors.email = t('email_error');
        isValid = false;
      }
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
      
      // Подготавливаем email
      const emailValue = formData.email.trim();
      const finalEmail = emailValue && !emailValue.includes('@') 
        ? `${emailValue}@gmail.com` 
        : emailValue;
      
      const response = await fetch(`${apiUrl}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: finalEmail || undefined,
          courseId: formData.courseId || undefined,
          comment: formData.comment.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({
          fullName: '',
          phone: '+996 ',
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
        setError(t('error'));
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Специальная обработка телефона
    if (name === 'phone') {
      // Если пользователь пытается удалить +996
      if (!value.startsWith('+996')) {
        setFormData(prev => ({ ...prev, phone: '+996 ' }));
        return;
      }
      // Ограничиваем длину
      if (value.length <= 16) { // +996 + 9 цифр + пробелы
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
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
              {t('title')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t('description')}
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
                  {t('success_title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  {t('success_message')}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors"
                >
                  {t('send_another')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t('fullName')} <span className="text-red-500">*</span>
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
                      placeholder={t('fullName_placeholder')}
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
                    {t('phone')} <span className="text-red-500">*</span>
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
                      placeholder={t('phone_placeholder')}
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
                    Email <span className="text-slate-400 text-xs">({t('optional')})</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-28 py-3 bg-slate-50 dark:bg-slate-800 border ${
                        errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                      } rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400`}
                      placeholder=""
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-slate-500 dark:text-slate-400">@gmail.com</span>
                    </div>
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
                    {t('course')} <span className="text-slate-400 text-xs">({t('optional')})</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <BookOpen className="w-5 h-5 text-slate-400" />
                    </div>
                    <select
                      id="courseId"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      className="w-full pl-12 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-slate-900 dark:text-white appearance-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                      }}
                    >
                      <option value="">{t('course_select')}</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.translation?.title || courseT('course_untitled')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label htmlFor="comment" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {t('comment')} <span className="text-slate-400 text-xs">({t('optional')})</span>
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
                      placeholder={t('comment_placeholder')}
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
                      {t('submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('submit')}
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  {t('consent')}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
