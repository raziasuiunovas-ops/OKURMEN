'use client';

import { useRouter } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
}

export function BackButton({ fallbackPath = '/', className = '' }: BackButtonProps) {
  const router = useRouter();
  const t = useTranslations('common');

  const handleBack = () => {
    // Проверяем есть ли история навигации
    if (typeof window !== 'undefined' && window.history.length > 1) {
      // Если есть история - используем браузерный back
      window.history.back();
    } else {
      // Если истории нет (прямой переход) - идём на fallbackPath
      router.push(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{t('back')}</span>
    </button>
  );
}
