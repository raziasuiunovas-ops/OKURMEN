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
    students: 0,
    alumni: 0,
    courses: 0,
    employmentRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        
        // Fetch courses count
        const coursesResponse = await fetch(`${apiUrl}/api/courses?language=${locale.toUpperCase()}`);
        let coursesCount = 0;
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          coursesCount = coursesData.success && coursesData.data ? coursesData.data.length : 0;
        }

        // Fetch students count (from enrolled students in courses)
        let studentsCount = 0;
        if (coursesResponse.ok) {
          const coursesResponse2 = await fetch(`${apiUrl}/api/courses?language=${locale.toUpperCase()}`);
          const coursesData = await coursesResponse2.json();
          if (coursesData.success && coursesData.data) {
            studentsCount = coursesData.data.reduce((acc: number, course: any) => 
              acc + (course.enrolledStudents || 0), 0
            );
          }
        }

        // Fetch alumni count
        const alumniResponse = await fetch(`${apiUrl}/api/alumni`);
        let alumniCount = 0;
        if (alumniResponse.ok) {
          const alumniData = await alumniResponse.json();
          alumniCount = alumniData.success && alumniData.data ? alumniData.data.length : 0;
        }

        setStats({
          students: studentsCount,
          alumni: alumniCount,
          courses: coursesCount,
          employmentRate: 0, // Нет API для этих данных, показываем 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // При ошибке показываем 0
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
      number: loading ? '...' : formatNumber(stats.students),
      label: t('students'),
    },
    { 
      icon: GraduationCap, 
      number: loading ? '...' : formatNumber(stats.alumni),
      label: t('alumni'),
    },
    { 
      icon: BookOpen, 
      number: loading ? '...' : formatNumber(stats.courses),
      label: t('courses'),
    },
    { 
      icon: Award, 
      number: loading ? '...' : stats.employmentRate > 0 ? `${stats.employmentRate}%` : '0',
      label: t('employed'),
    },
  ];

  return (
    <section className="relative py-16 bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600 overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center text-white group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center gap-4">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:scale-125 transition-transform duration-300`}></div>
                    <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:bg-white/20 transition-all duration-300 border border-white/20 group-hover:border-white/40 group-hover:scale-110">
                      <Icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  {/* Number */}
                  <div className="text-4xl md:text-5xl font-display font-extrabold group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm md:text-base font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </section>
  );
}
