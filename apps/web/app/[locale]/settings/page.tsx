'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/i18n/routing';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('back')}
          </button>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {t('description')}
          </p>
        </div>

        {/* Profile Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {t('profile.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('profile.name')}
              </label>
              <input
                type="text"
                value={session.user?.name || ''}
                disabled
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('profile.email')}
              </label>
              <input
                type="email"
                value={session.user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {t('theme.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {t('theme.description')}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-slate-200 dark:border-slate-600 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {t('theme.light')}
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-slate-200 dark:border-slate-600 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <div className="text-left">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {t('theme.dark')}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {t('notifications.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {t('notifications.description')}
          </p>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">
                  {t('notifications.email')}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {t('notifications.email_desc')}
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">
                  {t('notifications.updates')}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {t('notifications.updates_desc')}
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
