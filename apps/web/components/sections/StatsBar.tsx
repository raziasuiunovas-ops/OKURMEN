'use client';

import { useState, useEffect } from 'react';
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
  const [stats, setStats] = useState<Stats>({
    students: 670, // Статик маалымат - бир айда студенттер саны
    alumni: 3000,   // Статик маалымат
    courses: 0,
    employmentRate: 1000, // Статик маалымат (трудоустройство)
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        
        // Fetch courses count - ТОЛЬКО курстар автоматтык
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
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [locale]);

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    if (num >= 1000) return `${Math.floor(num / 1000)}${num % 1000 > 0 ? '.' + Math.floor((num % 1000) / 100) : ''}k+`;
    return `${num}+`;
  };

  const statsData = [
    { 
      icon: Users, 
      number: loading ? '...' : `${stats.students}+`,
      label: t('students'),
    },
    { 
      icon: GraduationCap, 
      number: loading ? '...' : `${stats.alumni}+`,
      label: t('alumni'),
    },
    { 
      icon: BookOpen, 
      number: loading ? '...' : formatNumber(stats.courses),
      label: t('courses'),
    },
    { 
      icon: Award, 
      number: loading ? '...' : `${stats.employmentRate}+`,
      label: t('employed'),
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-blue-500/5 dark:from-orange-500/10 dark:via-transparent dark:to-blue-500/10"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center group cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4 transform transition-all duration-500 group-hover:scale-105">
                  {/* Icon with glow effect */}
                  <div className="relative">
                    {/* Glow background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-blue-500 opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 blur-2xl transition-all duration-500 scale-0 group-hover:scale-150 rounded-full"></div>
                    
                    {/* Icon container */}
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:rotate-6 border border-gray-200/50 dark:border-slate-600/50 group-hover:border-orange-500/30 dark:group-hover:border-orange-400/30">
                      <Icon className="w-8 h-8 text-gray-600 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-all duration-500 group-hover:scale-110" />
                    </div>

                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/0 group-hover:border-orange-500/50 dark:group-hover:border-orange-400/50 scale-100 group-hover:scale-110 transition-all duration-500"></div>
                  </div>
                  
                  {/* Number with gradient on hover */}
                  <div className="relative">
                    <div className="text-5xl md:text-6xl font-display font-extrabold bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-blue-600 dark:group-hover:from-orange-400 dark:group-hover:to-blue-400 transition-all duration-500 group-hover:scale-110">
                      {stat.number}
                    </div>
                    
                    {/* Animated underline */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-full h-1 bg-gradient-to-r from-orange-500 to-blue-500 transition-all duration-500 rounded-full"></div>
                  </div>
                  
                  {/* Label with slide up animation */}
                  <div className="relative overflow-hidden h-6">
                    <div className="text-sm font-sans text-gray-600 dark:text-gray-400 uppercase tracking-wider font-semibold group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-all duration-500 transform group-hover:-translate-y-0.5">
                      {stat.label}
                    </div>
                  </div>

                  {/* Bottom accent dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-blue-500 transition-all duration-500 group-hover:scale-150"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent"></div>
    </section>
  );
}
