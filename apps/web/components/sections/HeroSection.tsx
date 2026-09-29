'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, Play, Sparkles, TrendingUp, Award } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function HeroSection() {
  const t = useTranslations('hero');

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-28 pb-24 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
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

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - Улучшенная типографика */}
          <div className="space-y-8 lg:space-y-10">
            {/* Badge с иконкой */}
            <RevealOnScroll delay={0}>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-soft-lg border border-orange-200/50 dark:border-slate-700/50">
                <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {t('badge')}
                </span>
              </div>
            </RevealOnScroll>

            {/* Main Heading - Улучшенная иерархия */}
            <RevealOnScroll delay={100}>
              <div className="space-y-4">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] text-balance">
                  <span className="block text-slate-900 dark:text-white mb-2">
                    {t('main_title_1')}
                  </span>
                  <span className="block text-slate-900 dark:text-white mb-3">
                    <span className="inline-block bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                      {t('main_title_2')}
                    </span>
                    <span className="text-slate-900 dark:text-white"> {t('main_title_with')} {t('main_title_3')}</span>
                  </span>
                </h1>
              </div>
            </RevealOnScroll>

            {/* Description - Улучшенная читаемость */}
            <RevealOnScroll delay={200}>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {t('description_full')}{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{t('description_hybrid')}</span> жана{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{t('description_mentor')}</span> {t('description_support')}
              </p>
            </RevealOnScroll>

            {/* CTA Buttons - Улучшенный стиль */}
            <RevealOnScroll delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => scrollToSection('#courses')}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {t('cta_primary')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => scrollToSection('#about')}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-200"
                >
                  <Play className="w-5 h-5" />
                  {t('cta_secondary')}
                </button>
              </div>
            </RevealOnScroll>

            {/* Мини статистика с иконками */}
            <RevealOnScroll delay={400}>
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t('format_label')}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t('format_value')}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t('result_label')}</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t('result_value')}</div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Side - Улучшенные визуальные элементы */}
          <RevealOnScroll delay={200}>
            <div className="relative lg:pl-8">
              {/* Main Visual */}
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Основная карточка */}
                <div className="relative h-full bg-gradient-to-br from-orange-100 via-white to-blue-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-3xl overflow-hidden shadow-premium-lg border-2 border-orange-200/50 dark:border-slate-600/50">
                  {/* Декоративная сетка */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                      backgroundSize: '32px 32px'
                    }}></div>
                  </div>
                  
                  {/* Центральная иконка */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                      <div className="relative p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-premium">
                        <svg className="w-32 h-32 text-transparent" viewBox="0 0 24 24" fill="none" stroke="url(#hero-gradient)" strokeWidth="1.5">
                          <defs>
                            <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f97316" />
                              <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                          </defs>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Плавающие элементы с улучшенной анимацией */}
                  <div className="absolute top-8 left-8 p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-premium border border-orange-200/50 dark:border-slate-700 animate-float" style={{ animationDelay: '0s' }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{t('students_value')}</div>
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('students_count')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-8 right-8 p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-premium border border-blue-200/50 dark:border-slate-700 animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{t('success_value')}</div>
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('success_label')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
