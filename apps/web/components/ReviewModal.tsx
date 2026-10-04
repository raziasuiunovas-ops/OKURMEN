'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { Star, X, MessageSquarePlus, ChevronDown } from 'lucide-react';

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
  const [success, setSuccess] = useState(false);

  // Load user name from session
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchCourses();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen]);

  const fetchCourses = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/courses`);
      const data = await response.json();
      if (data.success && data.data) setCourses(data.data);
    } catch { /* ignore */ }
  };

  const handleClose = () => {
    if (isLoading) return;
    setError('');
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError(t('form_required')); return; }
    if (!text.trim()) { setError(t('form_required')); return; }
    if (text.trim().length < 50) { setError('Минимальная длина отзыва — 50 символов.'); return; }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: name.trim(),
          reviewType: 'STUDENT',
          text: text.trim(),
          rating,
          courseId: courseId || undefined,
          userId: session?.user?.id || undefined,
          status: 'PENDING',
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || data.message || t('form_error'));

      setSuccess(true);
      setName(''); setCourseId(''); setRating(5); setText('');
      if (onSuccess) onSuccess();
      // Auto-close after 2s
      setTimeout(() => { setSuccess(false); onClose(); }, 2000);
    } catch (err: any) {
      setError(err.message || t('form_error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('form_title')}
    >
      {/* Full-screen backdrop — blocks all interaction with page */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: 'rvwIn .24s cubic-bezier(.34,1.4,.64,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top gradient stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />

        {/* ── Success state ── */}
        {success ? (
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-display font-bold text-lg text-slate-900 dark:text-white text-center">
              {t('form_success')}
            </p>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} noValidate>
            {/* Header */}
            <div className="flex items-start gap-3 px-6 pt-5 pb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <MessageSquarePlus className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white leading-tight">
                  {t('form_title')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('description')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={t('form_cancel')}
                className="flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="rv-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('form_name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" id="rv-name" value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('form_name')}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Course — custom styled select */}
              <div>
                <label htmlFor="rv-course" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('form_course')}
                </label>
                <div className="relative">
                  <select
                    id="rv-course" value={courseId}
                    onChange={e => setCourseId(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none cursor-pointer"
                  >
                    <option value="">{t('form_select_course')}</option>
                    {courses.map(course => {
                      const tr = course.translations.find(t => t.language === locale.toUpperCase()) || course.translations[0];
                      return <option key={course.id} value={course.id}>{tr?.title || course.slug}</option>;
                    })}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('form_rating')} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star} type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`${star} stars`}
                    >
                      <Star className={`w-8 h-8 transition-colors ${star <= (hoveredRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {hoveredRating || rating}/5
                  </span>
                </div>
              </div>

              {/* Text */}
              <div>
                <label htmlFor="rv-text" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('form_text')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rv-text" value={text}
                  onChange={e => setText(e.target.value)}
                  rows={4}
                  placeholder={t('form_text')}
                  required minLength={50} maxLength={500}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs font-medium ${text.length < 50 ? 'text-orange-500' : 'text-slate-400'}`}>
                    {text.length < 50 ? `ещё ${50 - text.length} симв.` : ''}
                  </span>
                  <span className="text-xs text-slate-400">{text.length}/500</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-3.5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button" onClick={handleClose}
                  className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  {t('form_cancel')}
                </button>
                <button
                  type="submit" disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-orange-500/30 hover:shadow-lg transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>...</span>
                    </span>
                  ) : t('form_submit')}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <style>{`@keyframes rvwIn{from{opacity:0;transform:scale(.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}
