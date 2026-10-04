'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, GraduationCap, BookOpen, Award } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface Stats {
  students: number;
  alumni: number;
  courses: number;
  employmentRate: number;
}

export default function StatsBar() {
  const locale = useLocale();
  const t = useTranslations('stats');
  
  // Initial fallback values - сохраняем текущие значения как безопасные defaults
  const FALLBACK_STATS = {
    students: 670,
    alumni: 3000,
    courses: 0,
    employmentRate: 1000, // Статистика трудоустройства - количество
  };
  
  const [stats, setStats] = useState<Stats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);
  
  // Dashboard dynamics state
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState<Stats>({
    students: 0,
    alumni: 0,
    courses: 0,
    employmentRate: 0,
  });
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-cycling dashboard effect
  useEffect(() => {
    if (!isInView) return;
    
    const cycleStats = () => {
      setActiveStatIndex(prev => (prev + 1) % 4);
    };
    
    // Randomize interval between 2.5-3.5 seconds for dynamic feel
    const startCycle = () => {
      const randomInterval = 2500 + Math.random() * 1000; // 2.5-3.5s
      intervalRef.current = setTimeout(() => {
        cycleStats();
        startCycle(); // Schedule next cycle
      }, randomInterval);
    };
    
    startCycle();
    
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isInView]);
  
  // Intersection Observer for viewport detection
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
          // Start count-up animation
          animateNumbers();
        }
      },
      {
        threshold: 0.3, // Trigger when 30% visible
        rootMargin: '-50px 0px'
      }
    );
    
    observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, [hasAnimated]);
  
  // Count-up animation for numbers
  const animateNumbers = () => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 FPS
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const animate = () => {
      const progress = Math.min(currentStep / steps, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Smooth easing
      
      setAnimatedNumbers({
        students: Math.floor(stats.students * easeOutQuart),
        alumni: Math.floor(stats.alumni * easeOutQuart),
        courses: Math.floor(stats.courses * easeOutQuart),
        employmentRate: Math.floor(stats.employmentRate * easeOutQuart),
      });
      
      if (currentStep < steps) {
        currentStep++;
        setTimeout(animate, stepDuration);
      }
    };
    
    animate();
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        
        // 1. Fetch site stats (students, alumni, employmentRate) from Admin
        try {
          const siteStatsResponse = await fetch(`${apiUrl}/api/site-stats`);
          if (siteStatsResponse.ok) {
            const siteStatsData = await siteStatsResponse.json();
            if (siteStatsData.success && siteStatsData.data) {
              const { totalStudents, employedCount, employmentRate } = siteStatsData.data;
              
              setStats(prev => ({
                ...prev,
                students: totalStudents || prev.students, // Используем API или fallback
                alumni: employedCount || prev.alumni,     // Используем API или fallback
                employmentRate: employmentRate || prev.employmentRate, // Процент
              }));
              
              // Update animated numbers if animation already started
              if (hasAnimated) {
                setAnimatedNumbers(prev => ({
                  ...prev,
                  students: totalStudents || prev.students,
                  alumni: employedCount || prev.alumni,
                  employmentRate: employmentRate || prev.employmentRate,
                }));
              }
            }
          }
        } catch (siteStatsError) {
          console.warn('Site stats API unavailable, using fallback values:', siteStatsError);
          // Fallback values уже установлены в initial state
        }
        
        // 2. Fetch courses count - сохраняем текущую работающую логику
        const coursesResponse = await fetch(`${apiUrl}/api/courses?language=${locale.toUpperCase()}`);
        let coursesCount = 0;
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          coursesCount = coursesData.success && coursesData.data ? coursesData.data.length : 0;
        }

        setStats(prev => ({
          ...prev,
          courses: coursesCount,
        }));
        
        // Update animated numbers if animation already started
        if (hasAnimated) {
          setAnimatedNumbers(prev => ({
            ...prev,
            courses: coursesCount,
          }));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Сохраняем fallback values при ошибке
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [locale, hasAnimated]);

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    if (num >= 1000) return `${Math.floor(num / 1000)}${num % 1000 > 0 ? '.' + Math.floor((num % 1000) / 100) : ''}k+`;
    return `${num}+`;
  };

  // Use animated numbers if animation has started, otherwise use loading state
  const displayNumbers = hasAnimated ? animatedNumbers : stats;

  const statsData = [
    { 
      icon: Users, 
      number: loading ? '...' : `${displayNumbers.students}+`,
      label: t('students'),
      key: 'students',
    },
    { 
      icon: GraduationCap, 
      number: loading ? '...' : `${displayNumbers.alumni}+`,
      label: t('alumni'),
      key: 'alumni',
    },
    { 
      icon: BookOpen, 
      number: loading ? '...' : formatNumber(displayNumbers.courses),
      label: t('courses'),
      key: 'courses',
    },
    { 
      icon: Award, 
      number: loading ? '...' : `${displayNumbers.employmentRate}+`,
      label: t('employed'),
      key: 'employmentRate',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-blue-500/5 dark:from-orange-500/10 dark:via-transparent dark:to-blue-500/10"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Dashboard pulse effect */}
      {isInView && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-blue-500/5 dark:from-orange-500/10 dark:to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
      )}

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const isActive = index === activeStatIndex && isInView;
            
            return (
              <div 
                key={index} 
                className={`text-center group cursor-pointer transform transition-all duration-1000 ${
                  isActive ? 'scale-110 -translate-y-2' : 'scale-100 translate-y-0'
                }`}
              >
                <div className="flex flex-col items-center gap-4 transform transition-all duration-500 group-hover:scale-105">
                  {/* Icon with enhanced glow effect */}
                  <div className="relative">
                    {/* Dashboard active glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-blue-500 opacity-40 dark:opacity-60 blur-2xl transition-all duration-1000 scale-150 rounded-full animate-pulse"></div>
                    )}
                    
                    {/* Regular glow background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-blue-500 opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-2xl transition-all duration-500 scale-0 group-hover:scale-150 rounded-full"></div>
                    
                    {/* Icon container */}
                    <div className={`relative w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm transition-all duration-1000 group-hover:rotate-6 border ${
                      isActive 
                        ? 'bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950 dark:to-blue-950 shadow-2xl border-orange-500/50 dark:border-orange-400/50 shadow-orange-500/25 dark:shadow-orange-400/25' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 group-hover:shadow-xl border-gray-200/50 dark:border-slate-600/50 group-hover:border-orange-500/30 dark:group-hover:border-orange-400/30'
                    }`}>
                      <Icon className={`w-8 h-8 transition-all duration-1000 group-hover:scale-110 ${
                        isActive
                          ? 'text-orange-600 dark:text-orange-400 scale-125'
                          : 'text-gray-600 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400'
                      }`} />
                    </div>

                    {/* Animated ring */}
                    <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-1000 ${
                      isActive
                        ? 'border-orange-500/70 dark:border-orange-400/70 scale-125'
                        : 'border-orange-500/0 group-hover:border-orange-500/50 dark:group-hover:border-orange-400/50 scale-100 group-hover:scale-110'
                    }`}></div>

                    {/* Dashboard active indicator */}
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
                    )}
                  </div>
                  
                  {/* Number with enhanced gradient on active state */}
                  <div className="relative">
                    <div className={`text-5xl md:text-6xl font-display font-extrabold bg-clip-text text-transparent transition-all duration-1000 ${
                      isActive
                        ? 'bg-gradient-to-br from-orange-600 to-blue-600 dark:from-orange-400 dark:to-blue-400 scale-110 drop-shadow-lg'
                        : 'bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-gray-300 group-hover:from-orange-600 group-hover:to-blue-600 dark:group-hover:from-orange-400 dark:group-hover:to-blue-400 group-hover:scale-110'
                    }`}>
                      {stat.number}
                    </div>
                    
                    {/* Animated underline */}
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full transition-all duration-1000 ${
                      isActive ? 'w-full scale-110' : 'w-0 group-hover:w-full'
                    }`}></div>
                  </div>
                  
                  {/* Label with enhanced animation */}
                  <div className="relative overflow-hidden h-6">
                    <div className={`text-sm font-sans uppercase tracking-wider font-semibold transition-all duration-1000 transform ${
                      isActive
                        ? 'text-gray-900 dark:text-gray-100 -translate-y-1 scale-105'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 group-hover:-translate-y-0.5'
                    }`}>
                      {stat.label}
                    </div>
                  </div>

                  {/* Bottom accent dot with dashboard indicator */}
                  <div className={`rounded-full transition-all duration-1000 ${
                    isActive
                      ? 'w-2.5 h-2.5 bg-gradient-to-r from-orange-500 to-blue-500 scale-150 animate-pulse shadow-lg shadow-orange-500/50'
                      : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-blue-500 group-hover:scale-150'
                  }`}></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Dashboard status indicators */}
        {isInView && (
          <div className="flex justify-center mt-8 gap-2">
            {statsData.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === activeStatIndex
                    ? 'bg-gradient-to-r from-orange-500 to-blue-500 scale-125 shadow-lg shadow-orange-500/50'
                    : 'bg-gray-300 dark:bg-gray-600 opacity-50'
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Animated bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent"></div>
    </section>
  );
}
