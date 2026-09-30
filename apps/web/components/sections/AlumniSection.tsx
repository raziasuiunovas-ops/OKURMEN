'use client';

import { useState, useEffect } from 'react';
import { User, Building2, Briefcase, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Alumni {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  story: string | null;
  photoUrl: string | null;
  isFeatured: boolean;
}

export default function AlumniSection() {
  const t = useTranslations('stats');
  const commonT = useTranslations('common');
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-orange-500 to-amber-500',
    'from-teal-500 to-cyan-500',
  ];

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/api/alumni?featured=true`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch alumni');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setAlumni(data.data);
        }
      } catch (error) {
        console.error('Error fetching alumni:', error);
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= alumni.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? alumni.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <section id="alumni" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('alumni')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (alumni.length === 0) {
    return (
      <section id="alumni" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('alumni')}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-8"></div>
            <div className="p-12 bg-white dark:bg-slate-800 rounded-2xl">
              <Award className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                {t('alumni_empty')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="alumni" className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('alumni')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('alumni_description')}
          </p>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {alumni.map((alum, index) => {
            const gradient = gradients[index % gradients.length];
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
            // Base64 болсо туура колдон, file path болсо API URL кош
            const photoUrl = alum.photoUrl 
              ? (alum.photoUrl.startsWith('data:') ? alum.photoUrl : `${apiUrl}${alum.photoUrl}`)
              : null;

            return (
              <div
                key={alum.id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-premium-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-transparent hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Avatar */}
                <div className={`relative h-64 bg-gradient-to-br ${gradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={alum.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-6 bg-white/90 dark:bg-slate-900/90 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                        <User className="w-16 h-16 text-slate-700 dark:text-slate-300" />
                      </div>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {alum.isFeatured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {alum.name}
                  </h3>
                  
                  {alum.company && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{alum.company}</span>
                    </div>
                  )}
                  
                  {alum.position && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Briefcase className="w-4 h-4 text-orange-500" />
                      <span>{alum.position}</span>
                    </div>
                  )}
                  
                  {alum.story && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {alum.story}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
