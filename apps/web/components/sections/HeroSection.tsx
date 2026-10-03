'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Play, Sparkles, TrendingUp, Award } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';
import { useState, useEffect } from 'react';

interface PublicStats {
  hasStats: boolean;
  periodType?: string;
  month?: number | null;
  year?: number | null;
  stats: Array<{
    metric: string;
    value: number;
    order: number;
  }>;
}

const METRIC_LABELS: Record<string, { ru: string; ky: string; en: string; icon?: string }> = {
  'NEW_STUDENTS': { ru: 'Новых студентов', ky: 'Жаңы студенттер', en: 'New Students', icon: '📚' },
  'NEW_APPLICATIONS': { ru: 'Новых заявок', ky: 'Жаңы арыздар', en: 'New Applications', icon: '📝' },
  'COMPLETED_APPLICATIONS': { ru: 'Завершено заявок', ky: 'Аткарылган арыздар', en: 'Completed', icon: '✅' },
  'NEW_PAYMENTS': { ru: 'Новых оплат', ky: 'Жаңы төлөмдөр', en: 'New Payments', icon: '💳' },
  'TOTAL_PAYMENT_AMOUNT': { ru: 'Сумма оплат', ky: 'Төлөмдөрдүн суммасы', en: 'Total Amount', icon: '💰' },
  'NEW_REVIEWS': { ru: 'Новых отзывов', ky: 'Жаңы пикирлер', en: 'New Reviews', icon: '⭐' },
  'NEW_BOOKINGS': { ru: 'Новых бронирований', ky: 'Жаңы брондоолор', en: 'New Bookings', icon: '📅' },
  'TOTAL_STUDENTS': { ru: 'Всего студентов', ky: 'Бардык студенттер', en: 'Total Students', icon: '👥' },
  'ACTIVE_STUDENTS': { ru: 'Активных студентов', ky: 'Активдүү студенттер', en: 'Active Students', icon: '🎓' },
  'TOTAL_COURSES': { ru: 'Всего курсов', ky: 'Бардык курстар', en: 'Total Courses', icon: '📖' },
  'ACTIVE_COURSES': { ru: 'Активных курсов', ky: 'Активдүү курстар', en: 'Active Courses', icon: '🔥' },
  'TOTAL_EMPLOYEES': { ru: 'Всего сотрудников', ky: 'Бардык кызматкерлер', en: 'Total Employees', icon: '👔' },
  'ACTIVE_EMPLOYEES': { ru: 'Активных сотрудников', ky: 'Активдүү кызматкерлер', en: 'Active Employees', icon: '💼' },
  'TOTAL_GROUPS': { ru: 'Всего групп', ky: 'Бардык топтор', en: 'Total Groups', icon: '👨‍👩‍👧‍👦' },
  'TOTAL_LESSONS': { ru: 'Всего уроков', ky: 'Бардык сабактар', en: 'Total Lessons', icon: '📚' },
  'TOTAL_ALUMNI': { ru: 'Выпускников', ky: 'Бүтүрүүчүлөр', en: 'Alumni', icon: '🎓' },
};

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const [publicStats, setPublicStats] = useState<PublicStats | null>(null);
  // waveFrame временно не используется

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/api/statistics/public`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPublicStats(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    }
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}K+`;
    }
    return `${num}+`;
  };

  const getMetricLabel = (metric: string): string => {
    const labels = METRIC_LABELS[metric];
    if (!labels) return metric;
    if (locale === 'ru') return labels.ru;
    if (locale === 'ky') return labels.ky;
    return labels.en;
  };

  // Default values for stats cards
  const studentsValue = t('students_value');
  const successValue = t('success_value');

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Улучшенные декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Главный оранжевый круг */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-orange-200/30 via-orange-300/20 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 animate-pulse" style={{ animationDuration: '4s' }}></div>
        
        {/* Синий круг */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/30 via-blue-300/20 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        
        {/* Дополнительные акценты */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* Left Content - Улучшенная типографика */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Badge с иконкой */}
            <RevealOnScroll delay={0}>
              <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-5 sm:py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-soft-lg border border-orange-200/50 dark:border-slate-700/50">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  {t('badge')}
                </span>
              </div>
            </RevealOnScroll>

            {/* Main Heading - Улучшенная иерархия */}
            <RevealOnScroll delay={100}>
              <div className="space-y-3 sm:space-y-4">
                <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-balance">
                  <span className="block text-slate-900 dark:text-white mb-1 sm:mb-2">
                    {t('main_title_1')}
                  </span>
                  <span className="block text-slate-900 dark:text-white mb-2 sm:mb-3">
                    <span className={locale === 'ky' ? 'inline-block bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift' : 'text-slate-900 dark:text-white'}>
                      {t('main_title_2')}
                    </span>
                    <span className="text-slate-900 dark:text-white"> {t('main_title_with')} </span>
                    <span className={locale === 'ky' ? 'text-slate-900 dark:text-white' : 'inline-block bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift'}>
                      {t('main_title_3')}
                    </span>
                  </span>
                </h1>
              </div>
            </RevealOnScroll>

            {/* Description - Улучшенная читаемость */}
            <RevealOnScroll delay={200}>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {t('description_full')}{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{t('description_hybrid')}</span> {t('description_and')}{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{t('description_mentor')}</span> {t('description_support')}
              </p>
            </RevealOnScroll>

            {/* CTA Buttons - Улучшенный стиль */}
            <RevealOnScroll delay={300}>
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-2">
                <button 
                  onClick={() => scrollToSection('#courses')}
                  className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {t('cta_primary')}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => scrollToSection('#about')}
                  className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-200"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('cta_secondary')}
                </button>
              </div>
            </RevealOnScroll>

            {/* Мини статистика с иконками */}
            <RevealOnScroll delay={400}>
              <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 sm:pt-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t('format_label')}</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{t('format_value')}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t('result_label')}</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{t('result_value')}</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Side - Animated Code Element */}
          <RevealOnScroll delay={200}>
            <div className="relative lg:pl-8">
              {/* Animated Code Browser Window */}
              <div className="relative mb-6 sm:mb-8 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  {/* Code Browser Window */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 dark:border-slate-600 animate-float">
                    {/* Browser Header */}
                    <div className="bg-slate-800 dark:bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-xs text-slate-400 font-mono">OKURMEN.kg</span>
                      </div>
                    </div>
                    
                    {/* Code Content */}
                    <div className="p-6 font-mono text-sm">
                      {/* Line 1 */}
                      <div className="flex gap-3 mb-2">
                        <span className="text-slate-500">1</span>
                        <span className="text-purple-400">const</span>
                        <span className="text-blue-400">student</span>
                        <span className="text-slate-300">=</span>
                        <span className="text-yellow-400">{"{"}</span>
                      </div>
                      
                      {/* Line 2 */}
                      <div className="flex gap-3 mb-2 pl-6">
                        <span className="text-slate-500">2</span>
                        <span className="text-blue-300">name:</span>
                        <span className="text-green-400">"Студент"</span>
                        <span className="text-slate-300">,</span>
                      </div>
                      
                      {/* Line 3 - Animated typing effect */}
                      <div className="flex gap-3 mb-2 pl-6">
                        <span className="text-slate-500">3</span>
                        <span className="text-blue-300">skill:</span>
                        <span className="text-green-400 inline-flex">
                          "IT"
                          <span className="w-2 h-5 bg-orange-500 ml-1 animate-pulse"></span>
                        </span>
                      </div>
                      
                      {/* Line 4 */}
                      <div className="flex gap-3 mb-2 pl-6">
                        <span className="text-slate-500">4</span>
                        <span className="text-blue-300">success:</span>
                        <span className="text-orange-400">true</span>
                        <span className="text-slate-300">,</span>
                      </div>
                      
                      {/* Line 5 */}
                      <div className="flex gap-3 mb-2">
                        <span className="text-slate-500">5</span>
                        <span className="text-yellow-400">{"}"}</span>
                        <span className="text-slate-300">;</span>
                      </div>
                      
                      {/* Line 6 - Empty */}
                      <div className="flex gap-3 mb-2">
                        <span className="text-slate-500">6</span>
                      </div>
                      
                      {/* Line 7 - Glowing line */}
                      <div className="flex gap-3 mb-2 bg-orange-500/10 -mx-6 px-6 py-1 border-l-2 border-orange-500">
                        <span className="text-slate-500">7</span>
                        <span className="text-blue-400">learn</span>
                        <span className="text-slate-300">(</span>
                        <span className="text-orange-400">student</span>
                        <span className="text-slate-300">)</span>
                        <span className="text-slate-300">;</span>
                      </div>
                    </div>
                    
                    {/* Bottom glow effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 animate-gradient-shift"></div>
                  </div>
                  
                  {/* Floating particles around code */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-500/20 rounded-lg backdrop-blur-sm animate-float" style={{ animationDelay: '0.5s' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-blue-500/20 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Statistics Cards from Admin */}
              {publicStats?.hasStats && publicStats.stats.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
                  {publicStats.stats.slice(0, 2).map((stat, index) => (
                    <div
                      key={stat.metric}
                      className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all"
                    >
                      <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex-shrink-0">
                        <span className="text-2xl">{METRIC_LABELS[stat.metric]?.icon || '📊'}</span>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {formatNumber(stat.value)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {getMetricLabel(stat.metric)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
                  {/* Students Card */}
                  <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-orange-200 dark:border-orange-800">
                    <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{studentsValue}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{t('students_count')}</div>
                    </div>
                  </div>

                  {/* Success Card */}
                  <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-blue-200 dark:border-blue-800">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{successValue}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{t('success_label')}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

<style jsx>{`
  @keyframes bilbars-float-gentle {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  .animate-bilbars-float-gentle {
    animation: bilbars-float-gentle 3s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-bilbars-float-gentle {
      animation: none;
    }
  }
`}</style>
