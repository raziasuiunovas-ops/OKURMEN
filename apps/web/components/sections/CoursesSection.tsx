'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, ArrowRight, Star, Code, Brain, Sparkles, GraduationCap, Film, Wrench, Globe, Zap, TrendingUp, type LucideIcon } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

// Маппинг иконок по названиям (синхронизирован с Admin)
const iconMap: Record<string, LucideIcon> = {
  'Code': Code,
  'Brain': Brain,
  'GraduationCap': GraduationCap,
  'Film': Film,
  'Wrench': Wrench,
  'Globe': Globe,
  'Zap': Zap,
  'Sparkles': Sparkles,
  'BookOpen': BookOpen,
  'Users': Users,
  'Star': Star,
  'TrendingUp': TrendingUp,
};

interface CourseTranslation {
  id: string;
  languageCode: string;
  title: string;
  description: string;
  level: string;
}

interface Course {
  id: string;
  slug: string;
  price: number;
  icon: string | null;
  coverImage: string | null;
  coverGradient: { from: string; to: string } | null;
  colorTheme: string | null; // NEW: Solid hex color
  isActive: boolean;
  rating: number;
  totalReviews: number;
  enrolledStudents: number;
  totalHours: number;
  translations: CourseTranslation[];
  _count: {
    lessons: number;
  };
}

export default function CoursesSection() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('courses');
  const levelT = useTranslations('levels');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  
  // IT Персонаж states - карточкалардын ҮСТҮНДӨ
  const [characterPosition, setCharacterPosition] = useState({ x: 25, y: 15 }); // y:15 = карточкалардын үстү
  const [characterState, setCharacterState] = useState<'idle' | 'running' | 'jumping' | 'celebrating'>('idle');
  const [previousActiveIndex, setPreviousActiveIndex] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/api/courses`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Particle generation жана mouse tracking
  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-scroll - дайым иштесин (5 секунд сайын)
  useEffect(() => {
    if (courses.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        setPreviousActiveIndex(prev);
        return (prev + 1) % courses.length;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [courses.length]);

  // IT Персонаж логикасы - карточкалардын ҮСТҮНДӨ жүгүрөт
  useEffect(() => {
    // Персонаж жылгандан кийин activeIndex өзгөргөндө reaction
    if (activeIndex !== previousActiveIndex) {
      // Карточка ачылганда персонаж ошол жакка секирет (ҮСТҮНӨ)
      setCharacterState('jumping');
      
      // Жаңы позицияны эсептейбиз (active карточканын үстүнө)
      const cardProgress = activeIndex / Math.max(1, courses.length - 1);
      const newX = 20 + (cardProgress * 60); // 20% - 80% диапазон (карточкалардын үстү)
      
      setCharacterPosition({ x: newX, y: 15 }); // y: 15 - карточкалардын үстүндө
      
      // Кыска убакыттан кийин celebrating (карточканын үстүндө)
      setTimeout(() => setCharacterState('celebrating'), 600);
      setTimeout(() => setCharacterState('running'), 1200);
      setTimeout(() => setCharacterState('idle'), 2500);
    }
  }, [activeIndex, previousActiveIndex, courses.length]);

  // Персонажтын idle movement'и - карточкалардын үстүндө жылуу
  useEffect(() => {
    if (characterState !== 'idle') return;
    
    const idleMovement = setInterval(() => {
      setCharacterPosition(prev => ({
        x: Math.max(15, Math.min(85, prev.x + (Math.random() - 0.5) * 8)), // Карточкалар диапазонунда
        y: 15 + Math.sin(Date.now() / 1500) * 3 // Карточкалардын үстүндө плавдуу жылуу
      }));
    }, 3000);

    return () => clearInterval(idleMovement);
  }, [characterState]);

  // Helper для выбора правильного перевода с fallback
  const getTranslation = (course: Course) => {
    const langCode = locale.toUpperCase();
    
    // Ищем перевод для текущего языка
    let translation = course.translations.find(t => t.languageCode === langCode);
    
    // Fallback на русский
    if (!translation) {
      translation = course.translations.find(t => t.languageCode === 'RU');
    }
    
    // Fallback на первый доступный
    if (!translation) {
      translation = course.translations[0];
    }
    
    return translation || {
      title: 'Course',
      description: '',
      level: 'BEGINNER',
    };
  };

  const getLevelLabel = (level: string) => {
    return levelT(level) || level;
  };

  const getDefaultGradient = (index: number) => {
    const gradients = [
      { from: '#3b82f6', to: '#06b6d4' }, // blue to cyan
      { from: '#10b981', to: '#059669' }, // green to emerald
      { from: '#ec4899', to: '#f43f5e' }, // pink to rose
      { from: '#a855f7', to: '#6366f1' }, // purple to indigo
      { from: '#f97316', to: '#f59e0b' }, // orange to amber
      { from: '#14b8a6', to: '#06b6d4' }, // teal to cyan
      { from: '#ef4444', to: '#f97316' }, // red to orange
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-900">
        <div className="container px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 sm:mb-4">
              {t('title')}
            </h2>
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full sm:w-[350px] bg-slate-100 dark:bg-slate-800 rounded-2xl h-[300px] sm:h-[480px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-900">
        <div className="container px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 sm:mb-4">
              {t('title')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8">
              {t('empty_title')}
            </p>
            <div className="p-8 sm:p-12 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                {t('empty_message')}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-900 overflow-hidden relative">
      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="container px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16 animate-fade-in">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 sm:mb-4">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            {t('description')}
          </p>
        </div>

        {/* Expanding Cards Container */}
        <div className="expanding-cards-container mx-auto px-2 sm:px-4 lg:px-5 relative" style={{ maxWidth: '1200px' }}>
          {/* IT Персонаж - декоративдик слой ҮСТҮНДӨ */}
          <div 
            className="absolute z-50 pointer-events-none transition-all duration-700 ease-out"
            style={{
              left: `${characterPosition.x}%`,
              top: `${20 + (characterPosition.y - 85) * 0.3}%`, // Карточкалардын үстүндө
              transform: 'translateX(-50%)'
            }}
          >
            <div className={`tech-orb orb-${characterState}`}>
              {/* Негизги орб дене */}
              <div className="orb-body">
                {/* Тышкы glow ring */}
                <div className="orb-ring"></div>
                
                {/* Орто shell */}
                <div className="orb-shell">
                  {/* Ички жарык ядро */}
                  <div className="orb-core">
                    {/* Код символы - айланып турат */}
                    <div className="core-symbol rotating">&lt;/&gt;</div>
                    
                    {/* Энергия particles */}
                    <div className="energy-particles">
                      <div className="particle p1"></div>
                      <div className="particle p2"></div>
                      <div className="particle p3"></div>
                    </div>
                  </div>
                </div>
                
                {/* Жүгүрүү trail эффекти */}
                <div className="movement-trail"></div>
              </div>
              
              {/* Celebration эффекттери - активдүү карточкага секиргенде */}
              {characterState === 'celebrating' && (
                <div className="celebration-burst">
                  <div className="burst-ring ring-1"></div>
                  <div className="burst-ring ring-2"></div>
                  <div className="burst-ring ring-3"></div>
                  <div className="code-fragments">
                    <div className="fragment f1">{ }</div>
                    <div className="fragment f2">( )</div>
                    <div className="fragment f3">[ ]</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="expanding-cards">
            {courses.map((course, index) => {
              const translation = getTranslation(course);
              const IconComponent = course.icon && iconMap[course.icon] ? iconMap[course.icon] : BookOpen;
              const isActive = activeIndex === index;
              
              // Use coverImage if available, otherwise use solid color
              const hasCoverImage = course.coverImage && course.coverImage.trim() !== '';
              const solidColor = course.colorTheme || '#FF6B35'; // Default orange
              
              // Background: image if available, otherwise solid color
              const backgroundStyle = hasCoverImage 
                ? `url(${course.coverImage})`
                : solidColor;

              return (
                <div
                  key={course.id}
                  className={`expanding-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  style={{
                    ['--cardBackground' as any]: backgroundStyle,
                  }}
                  data-magnetic="true"
                >
                  {/* Shadow overlay */}
                  <div className="card-shadow"></div>

                  {/* Card label/content */}
                  <div className="card-label">
                    {/* Icon */}
                    <div className="card-icon">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="card-info">
                      <div className="card-main">{translation.title}</div>
                      <div className="card-sub">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course._count.lessons}
                          </span>
                          {course.totalHours > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.totalHours}ч
                            </span>
                          )}
                          {course.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {course.rating.toFixed(1)}
                            </span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Learn Price Button - visible when active */}
                    {isActive && (
                      <>
                        <a
                          href="#application-form"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const element = document.getElementById('application-form');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          className="card-price-btn"
                        >
                          {t('learn_price')}
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/courses/${course.slug}`);
                          }}
                          className="card-detail-btn"
                        >
                          {t('details')}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Level badge */}
                  <div className="card-level-badge">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      translation.level === 'BEGINNER' 
                        ? 'bg-green-500 text-white'
                        : translation.level === 'INTERMEDIATE'
                        ? 'bg-blue-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}>
                      {getLevelLabel(translation.level)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-8 sm:mt-10 lg:mt-12 animate-fade-in">
          <button 
            onClick={() => router.push('/courses')}
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
          >
            {t('view_all')}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        /* Futuristic Tech Orb Персонаж */
        .tech-orb {
          width: 50px;
          height: 50px;
          position: relative;
          filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.4));
        }

        @media (max-width: 768px) {
          .tech-orb {
            width: 35px;
            height: 35px;
          }
        }

        /* Негизги орб дене */
        .orb-body {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 50%;
        }

        /* Тышкы glow ring */
        .orb-ring {
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
          background-size: 300% 300%;
          animation: ring-rotate 3s ease-in-out infinite;
          opacity: 0.6;
        }

        /* Орто shell */
        .orb-shell {
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.9) 0%, 
            rgba(139, 92, 246, 0.8) 50%, 
            rgba(236, 72, 153, 0.9) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }

        /* Ички жарык ядро */
        .orb-core {
          position: absolute;
          inset: 6px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, 
            rgba(255, 255, 255, 0.8) 0%,
            rgba(59, 130, 246, 0.6) 40%,
            rgba(139, 92, 246, 0.4) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: core-pulse 2s ease-in-out infinite;
        }

        /* Айланып турган код символы */
        .core-symbol {
          font-size: 12px;
          font-weight: 900;
          font-family: 'Courier New', monospace;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 
            0 0 5px rgba(59, 130, 246, 0.8),
            0 0 10px rgba(139, 92, 246, 0.6);
        }

        .rotating {
          animation: symbol-spin 4s linear infinite;
        }

        /* Энергия particles */
        .energy-particles {
          position: absolute;
          inset: 0;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          box-shadow: 0 0 3px rgba(59, 130, 246, 0.8);
        }

        .p1 {
          top: 20%;
          left: 70%;
          animation: particle-orbit-1 3s ease-in-out infinite;
        }

        .p2 {
          top: 60%;
          left: 20%;
          animation: particle-orbit-2 4s ease-in-out infinite;
        }

        .p3 {
          top: 40%;
          left: 50%;
          animation: particle-orbit-3 2.5s ease-in-out infinite;
        }

        /* Movement trail эффекти */
        .movement-trail {
          position: absolute;
          top: 50%;
          left: -20px;
          width: 15px;
          height: 2px;
          background: linear-gradient(to right, 
            transparent 0%,
            rgba(59, 130, 246, 0.6) 50%,
            rgba(139, 92, 246, 0.4) 100%);
          border-radius: 2px;
          opacity: 0;
          transform: translateY(-50%);
        }

        /* Орб states */
        .orb-idle {
          animation: idle-float 2.5s ease-in-out infinite;
        }

        .orb-running .movement-trail {
          opacity: 1;
          animation: trail-flow 0.8s ease-in-out infinite;
        }

        .orb-running .orb-ring {
          animation: ring-rotate 1.5s ease-in-out infinite, ring-intensity 0.8s ease-in-out infinite;
        }

        .orb-jumping {
          animation: orb-jump 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .orb-jumping .orb-core {
          animation: core-pulse 2s ease-in-out infinite, jump-glow 0.8s ease-out;
        }

        .orb-celebrating .orb-shell {
          animation: celebrate-shimmer 0.8s ease-in-out;
        }

        /* Celebration burst эффекттери */
        .celebration-burst {
          position: absolute;
          inset: -15px;
          pointer-events: none;
        }

        .burst-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(59, 130, 246, 0.4);
          animation: burst-expand 1s ease-out forwards;
        }

        .ring-1 {
          inset: 0;
          animation-delay: 0s;
        }

        .ring-2 {
          inset: 5px;
          animation-delay: 0.2s;
          border-color: rgba(139, 92, 246, 0.4);
        }

        .ring-3 {
          inset: 10px;
          animation-delay: 0.4s;
          border-color: rgba(236, 72, 153, 0.4);
        }

        /* Code fragments */
        .code-fragments {
          position: absolute;
          inset: 0;
        }

        .fragment {
          position: absolute;
          font-size: 10px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 0 5px rgba(59, 130, 246, 0.8);
          animation: fragment-burst 1s ease-out forwards;
        }

        .f1 {
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 0s;
        }

        .f2 {
          top: 50%;
          right: -10px;
          animation-delay: 0.2s;
        }

        .f3 {
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 0.4s;
        }

        /* АНИМАЦИЯЛАР */

        @keyframes ring-rotate {
          0% { background-position: 0% 50%; transform: rotate(0deg); }
          50% { background-position: 100% 50%; transform: rotate(180deg); }
          100% { background-position: 0% 50%; transform: rotate(360deg); }
        }

        @keyframes ring-intensity {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }

        @keyframes core-pulse {
          0%, 100% { 
            transform: scale(1);
            background: radial-gradient(circle at 30% 30%, 
              rgba(255, 255, 255, 0.8) 0%,
              rgba(59, 130, 246, 0.6) 40%,
              rgba(139, 92, 246, 0.4) 100%);
          }
          50% { 
            transform: scale(1.1);
            background: radial-gradient(circle at 30% 30%, 
              rgba(255, 255, 255, 0.9) 0%,
              rgba(59, 130, 246, 0.8) 40%,
              rgba(139, 92, 246, 0.6) 100%);
          }
        }

        @keyframes symbol-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes particle-orbit-1 {
          0%, 100% { transform: rotate(0deg) translateX(8px) rotate(0deg); }
          50% { transform: rotate(180deg) translateX(8px) rotate(-180deg); }
        }

        @keyframes particle-orbit-2 {
          0%, 100% { transform: rotate(120deg) translateX(6px) rotate(-120deg); }
          50% { transform: rotate(300deg) translateX(6px) rotate(-300deg); }
        }

        @keyframes particle-orbit-3 {
          0%, 100% { transform: rotate(240deg) translateX(7px) rotate(-240deg); }
          50% { transform: rotate(60deg) translateX(7px) rotate(-60deg); }
        }

        @keyframes idle-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }

        @keyframes trail-flow {
          0% { 
            width: 15px; 
            background: linear-gradient(to right, transparent 0%, rgba(59, 130, 246, 0.6) 50%, rgba(139, 92, 246, 0.4) 100%);
          }
          50% { 
            width: 25px; 
            background: linear-gradient(to right, transparent 0%, rgba(59, 130, 246, 0.8) 30%, rgba(139, 92, 246, 0.6) 100%);
          }
          100% { 
            width: 15px; 
            background: linear-gradient(to right, transparent 0%, rgba(59, 130, 246, 0.6) 50%, rgba(139, 92, 246, 0.4) 100%);
          }
        }

        @keyframes orb-jump {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-25px) scale(1.15); }
          60% { transform: translateY(-15px) scale(1.08); }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes jump-glow {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.4); }
          100% { filter: brightness(1); }
        }

        @keyframes celebrate-shimmer {
          0%, 100% { 
            background: linear-gradient(135deg, 
              rgba(59, 130, 246, 0.9) 0%, 
              rgba(139, 92, 246, 0.8) 50%, 
              rgba(236, 72, 153, 0.9) 100%);
          }
          50% { 
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.9) 0%, 
              rgba(59, 130, 246, 0.8) 25%,
              rgba(139, 92, 246, 0.8) 50%,
              rgba(236, 72, 153, 0.8) 75%,
              rgba(255, 255, 255, 0.9) 100%);
          }
        }

        @keyframes burst-expand {
          0% { 
            transform: scale(0);
            opacity: 1;
          }
          100% { 
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes fragment-burst {
          0% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(0.5) translateY(-20px);
            opacity: 0;
          }
        }

        /* Particle анимация */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.8), transparent);
          border-radius: 50%;
          animation: float-particle 8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -30px) scale(1.5);
            opacity: 0.6;
          }
          50% {
            transform: translate(-10px, -60px) scale(1);
            opacity: 0.8;
          }
          75% {
            transform: translate(30px, -40px) scale(1.2);
            opacity: 0.5;
          }
        }

        .particle:nth-child(2n) {
          background: radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent);
          animation-duration: 10s;
        }

        .particle:nth-child(3n) {
          background: radial-gradient(circle, rgba(236, 72, 153, 0.8), transparent);
          animation-duration: 12s;
        }

        .particle:nth-child(4n) {
          width: 6px;
          height: 6px;
        }

        .expanding-cards-container {
          padding: 10px 0;
          overflow: visible;
        }

        @media (min-width: 640px) {
          .expanding-cards-container {
            padding: 20px 0;
          }
        }

        .expanding-cards {
          display: flex;
          gap: 12px;
          align-items: stretch;
          overflow: visible;
          min-height: 400px;
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .expanding-cards {
            gap: 15px;
            min-height: 500px;
          }
        }

        .expanding-card {
          position: relative;
          overflow: hidden;
          min-width: 70px;
          background: var(--cardBackground);
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-radius: 20px;
          flex-grow: 1;
          flex-shrink: 1;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0,0,0,0.15);
          animation: card-ambient-glow 4s ease-in-out infinite;
          will-change: transform, box-shadow, flex-grow;
        }

        /* Ambient glow анимация - тийбесе дагы иштейт */
        @keyframes card-ambient-glow {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1), 
                        0 4px 20px rgba(0,0,0,0.15),
                        0 0 30px rgba(59, 130, 246, 0);
          }
          50% {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.15), 
                        0 4px 20px rgba(0,0,0,0.15),
                        0 0 40px rgba(59, 130, 246, 0.15);
          }
        }

        @media (min-width: 640px) {
          .expanding-card {
            min-width: 80px;
            border-radius: 30px;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0,0,0,0.15);
          }
        }

        .expanding-card:hover {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2), 
                      0 8px 30px rgba(0,0,0,0.25),
                      0 0 50px rgba(59, 130, 246, 0.3);
          transform: translateY(-4px);
          animation: card-active-pulse 2s ease-in-out infinite;
        }

        /* Active pulse - hover'до күчөйт */
        @keyframes card-active-pulse {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2), 
                        0 8px 30px rgba(0,0,0,0.25),
                        0 0 50px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3), 
                        0 12px 40px rgba(0,0,0,0.3),
                        0 0 70px rgba(139, 92, 246, 0.5);
          }
        }

        @media (min-width: 640px) {
          .expanding-card:hover {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2), 0 8px 30px rgba(0,0,0,0.25);
          }
        }

        .expanding-card.active {
          flex-grow: 10000;
          min-width: 600px;
          max-width: 800px;
          border-radius: 40px;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25), 
                      0 10px 40px rgba(0,0,0,0.3),
                      0 0 80px rgba(139, 92, 246, 0.4);
          animation: card-active-glow 3s ease-in-out infinite;
          transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Милый код персонаж - КАРТОЧКАНЫН СЫРТЫНДА, татаалыраак */
        .expanding-card.active::after {
          content: '</>';
          position: absolute;
          top: -40px;
          left: 50px;
          font-size: 32px;
          font-weight: 900;
          font-family: 'Courier New', monospace;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          z-index: 200;
          animation: code-parkour 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8)) 
                  drop-shadow(0 0 30px rgba(139, 92, 246, 0.6));
          pointer-events: none;
        }

        /* Татаал паркур анимация - карточканын үстүндө */
        @keyframes code-parkour {
          0% {
            left: 50px;
            top: -40px;
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8));
          }
          10% {
            top: -60px;
            transform: rotate(-15deg) scale(1.3);
          }
          20% {
            left: 25%;
            top: -50px;
            transform: rotate(20deg) scale(1.1);
            filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.9));
          }
          30% {
            top: -80px;
            transform: rotate(-25deg) scale(1.4);
          }
          40% {
            left: 50%;
            top: -45px;
            transform: rotate(15deg) scale(1) translateX(-50%);
            filter: drop-shadow(0 0 25px rgba(236, 72, 153, 0.9));
          }
          50% {
            top: -90px;
            transform: rotate(-30deg) scale(1.5) translateX(-50%);
          }
          60% {
            left: 75%;
            top: -50px;
            transform: rotate(25deg) scale(1.2);
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
          }
          70% {
            top: -70px;
            transform: rotate(-20deg) scale(1.3);
          }
          80% {
            left: calc(100% - 80px);
            top: -45px;
            transform: rotate(35deg) scale(1.6);
            filter: drop-shadow(0 0 30px rgba(139, 92, 246, 1));
          }
          90% {
            top: -65px;
            transform: rotate(-10deg) scale(1.2);
          }
          100% {
            left: 50px;
            top: -40px;
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8));
          }
        }

        /* Active card - өзгөчө glow */
        @keyframes card-active-glow {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25), 
                        0 10px 40px rgba(0,0,0,0.3),
                        0 0 80px rgba(139, 92, 246, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.35), 
                        0 15px 50px rgba(0,0,0,0.35),
                        0 0 100px rgba(236, 72, 153, 0.5);
            transform: scale(1.005);
          }
        }

        @media (min-width: 640px) {
          .expanding-card.active {
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25), 0 10px 40px rgba(0,0,0,0.3);
          }
        }

        .expanding-card:not(.active) {
          max-width: 120px;
        }

        .card-shadow {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 220px;
          background: linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.3) 50%, transparent);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-radius: 0 0 30px 30px;
          animation: shadow-breathe 5s ease-in-out infinite;
          will-change: background, height;
        }

        /* Shadow breathing эффект */
        @keyframes shadow-breathe {
          0%, 100% {
            background: linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.3) 50%, transparent);
          }
          50% {
            background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4) 50%, transparent);
          }
        }

        .expanding-card.active .card-shadow {
          border-radius: 0 0 40px 40px;
        }

        .expanding-card:not(.active) .card-shadow {
          bottom: 0;
          height: 180px;
          background: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2) 40%, transparent);
        }

        .card-label {
          display: flex;
          flex-direction: column;
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          gap: 10px;
          will-change: opacity, transform;
        }

        @media (min-width: 640px) {
          .card-label {
            bottom: 20px;
            left: 20px;
            right: 20px;
            gap: 15px;
          }
        }

        .expanding-card:not(.active) .card-label {
          bottom: 10px;
          left: 10px;
          right: 10px;
        }

        @media (min-width: 640px) {
          .expanding-card:not(.active) .card-label {
            bottom: 15px;
            left: 15px;
            right: 15px;
          }
        }

        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          color: white;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          animation: icon-float 3s ease-in-out infinite;
        }

        /* Icon float анимация */
        @keyframes icon-float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(5deg);
          }
        }

        @media (min-width: 640px) {
          .card-icon {
            width: 48px;
            height: 48px;
            min-width: 48px;
          }
        }

        .card-icon:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.15) rotate(5deg) translateY(-5px);
          border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15),
                      0 0 30px rgba(59, 130, 246, 0.4);
          animation: icon-glow 1.5s ease-in-out infinite;
        }

        /* Icon glow - hover'до */
        @keyframes icon-glow {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15),
                        0 0 30px rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 6px 20px rgba(255, 255, 255, 0.25),
                        0 0 40px rgba(139, 92, 246, 0.6);
          }
        }

        .card-icon:active {
          transform: scale(1.05);
        }

        .expanding-card:not(.active) .card-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          background-color: rgba(255, 255, 255, 0.06);
        }

        @media (min-width: 640px) {
          .expanding-card:not(.active) .card-icon {
            width: 38px;
            height: 38px;
            min-width: 38px;
          }
        }

        .card-info {
          display: flex;
          flex-direction: column;
          color: white;
          gap: 8px;
        }

        .card-main {
          font-weight: 800;
          font-size: 1.25rem;
          line-height: 1.2;
          transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0;
          transform: translateX(30px);
          will-change: opacity, transform;
        }

        @media (min-width: 640px) {
          .card-main {
            font-size: 1.5rem;
          }
        }

        .expanding-card.active .card-main {
          opacity: 1;
          transform: translateX(0);
          transition-delay: 0.2s;
        }

        .card-sub {
          transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s;
          opacity: 0;
          transform: translateX(30px);
          will-change: opacity, transform;
        }

        .expanding-card.active .card-sub {
          opacity: 1;
          transform: translateX(0);
        }

        .card-price-btn {
          margin-top: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          animation: fadeInUpBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.4s;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          white-space: nowrap;
          width: fit-content;
          will-change: transform, opacity;
        }

        @keyframes fadeInUpBounce {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .card-price-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .card-price-btn:active {
          transform: translateY(-1px) scale(0.98);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-detail-btn {
          margin-top: 8px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          animation: fadeInUpBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.6s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          width: 100%;
          will-change: transform, opacity;
        }

        .card-detail-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .card-detail-btn:active {
          transform: translateY(-2px) scale(0.98);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-level-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0;
          cursor: default;
          transform: translateY(-10px) scale(0.8);
          will-change: opacity, transform;
        }

        @media (min-width: 640px) {
          .card-level-badge {
            top: 20px;
            left: 20px;
          }
        }

        .card-level-badge span {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .card-level-badge span:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }

        .expanding-card.active .card-level-badge {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition-delay: 0.3s;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .expanding-cards {
            min-height: 400px;
          }

          .expanding-card.active {
            min-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .expanding-cards {
            flex-direction: column;
            gap: 12px;
            min-height: auto;
          }

          .expanding-card {
            min-width: 100% !important;
            max-width: 100% !important;
            min-height: 100px;
            border-radius: 16px !important;
          }

          .expanding-card.active {
            min-height: 320px;
          }

          .expanding-card:not(.active) .card-main,
          .expanding-card:not(.active) .card-sub {
            opacity: 1;
            transform: translateX(0);
          }

          .expanding-card:not(.active) .card-main {
            font-size: 1rem;
          }

          .expanding-card:not(.active) .card-sub {
            font-size: 0.8rem;
          }

          .card-label {
            flex-direction: row;
            align-items: center;
            gap: 10px;
          }

          .expanding-card.active .card-label {
            flex-direction: column;
            align-items: flex-start;
          }

          .card-level-badge {
            opacity: 1;
            top: 12px;
            left: 12px;
          }
        }

        @keyframes fadeInAnimation {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInAnimation 0.6s ease-out;
        }

        /* Dark mode adjustments */
        :global(.dark) .card-icon {
          background-color: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(255, 255, 255, 0.15);
        }

        :global(.dark) .card-icon:hover {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.35);
        }

        :global(.dark) .card-price-btn {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }

        :global(.dark) .card-price-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          border-color: rgba(255, 255, 255, 0.4);
        }

        :global(.dark) .card-detail-btn {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }

        :global(.dark) .card-detail-btn:hover {
          background: rgba(255, 255, 255, 0.95);
          color: #1e293b;
          border-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </section>
  );
}
