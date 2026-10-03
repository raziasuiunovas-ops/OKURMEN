'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { getApiUrl } from '@/config/api';
import { useLanguage } from '@/contexts/LanguageContext';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[Auth] Запрос 2FA для админ-панели...');
      
      // Для админ-панели ВСЕГДА используем 2FA
      const url = getApiUrl('api/auth/request-2fa');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('auth.loginError'));
      }

      console.log('[Auth] 2FA код запрошен, переход к вводу кода');
      // Переходим к шагу ввода 2FA кода
      setStep('2fa');
    } catch (err: any) {
      console.error('[Auth] Ошибка запроса 2FA:', err);
      setError(err.message || t('auth.generalError'));
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[2FA] Отправка запроса verify-2fa...');
      const response = await fetch(getApiUrl('api/auth/verify-2fa'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
        credentials: 'include',
      });

      const result = await response.json();
      console.log('[2FA] Ответ получен:', result);

      if (!response.ok) {
        console.error('[2FA] Ошибка ответа:', result.error);
        throw new Error(result.error || t('auth.wrongCode'));
      }

      // Сохраняем токен в localStorage
      if (result.success && result.data?.token) {
        console.log('[2FA] Сохранение токена в localStorage...');
        localStorage.setItem('auth-token', result.data.token);
        console.log('[2FA] Токен сохранён, длина:', result.data.token.length);
        
        // Проверяем что токен действительно сохранился
        const savedToken = localStorage.getItem('auth-token');
        console.log('[2FA] Проверка: токен в localStorage:', !!savedToken);
      } else {
        console.error('[2FA] Токен не получен, result:', result);
        throw new Error(t('auth.tokenNotReceived'));
      }

      // Успешная авторизация
      console.log('[2FA] Переход на /admin...');
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      console.error('[2FA] Ошибка:', err);
      setError(err.message || t('auth.generalError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 px-4 sm:px-6 py-8 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Логотип */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 mb-3 sm:mb-4 shadow-2xl shadow-orange-500/30">
            <img 
              src="/logo.svg" 
              alt="ОКУРМЭН" 
              className="w-12 h-12 sm:w-14 sm:h-14 brightness-0 invert"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
            ОКУРМЭН
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            {t('auth.adminPanel')}
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-700/50">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all text-sm sm:text-base min-h-[44px]"
                    placeholder={t('auth.emailPlaceholder')}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-3.5 border border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all text-sm sm:text-base min-h-[44px]"
                    placeholder={t('auth.passwordPlaceholder')}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black rounded-xl sm:rounded-2xl hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:scale-105 text-sm sm:text-base min-h-[48px]"
              >
                {loading ? t('auth.sendingCode') : t('auth.getCode')}
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-5 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 mb-3 sm:mb-4 shadow-lg">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
                  {t('auth.twoFactor')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 px-2">
                  {t('auth.codeSent')} <span className="font-bold break-all">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {t('auth.sixDigitCode')}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(value);
                  }}
                  className="w-full px-4 py-3 sm:py-4 border border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-center text-2xl sm:text-3xl font-black tracking-widest transition-all min-h-[56px]"
                  placeholder={t('auth.codePlaceholder')}
                  maxLength={6}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full py-3.5 sm:py-4 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black rounded-xl sm:rounded-2xl hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:scale-105 text-sm sm:text-base min-h-[48px]"
                >
                  {loading ? t('auth.checking') : t('auth.verify')}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setCode('');
                    setError('');
                  }}
                  className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm sm:text-base min-h-[44px]"
                >
                  {t('common.back')}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-4 sm:mt-6 text-center px-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t('auth.protected')}
          </p>
        </div>
      </div>
    </div>
  );
}
