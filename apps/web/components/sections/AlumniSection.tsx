'use client';

import { useState, useEffect, useRef } from 'react';
import { User, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface Project { title: string; url: string; }
interface Alumni {
  id: string; name: string; company: string | null; position: string | null;
  story: string | null; photoUrl: string | null; projects?: Project[]; isFeatured: boolean;
}

export default function AlumniSection() {
  const t = useTranslations('stats');
  const alumniT = useTranslations('alumni');
  const locale = useLocale();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const GAP = 24;

  const alumniGradients = [
    { gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', glow: 'rgba(139,92,246,0.4)' },
    { gradient: 'from-cyan-500 via-blue-500 to-indigo-500',      glow: 'rgba(59,130,246,0.4)'  },
    { gradient: 'from-emerald-500 via-green-500 to-teal-500',    glow: 'rgba(16,185,129,0.4)'  },
    { gradient: 'from-rose-500 via-pink-500 to-red-500',         glow: 'rgba(244,63,94,0.4)'   },
    { gradient: 'from-amber-500 via-orange-500 to-yellow-500',   glow: 'rgba(249,115,22,0.4)'  },
    { gradient: 'from-sky-500 via-cyan-500 to-blue-500',         glow: 'rgba(14,165,233,0.4)'  },
  ];

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if      (w >= 1280) setItemsPerView(4);
      else if (w >= 1024) setItemsPerView(3);
      else if (w >= 640)  setItemsPerView(2);
      else                setItemsPerView(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Measure first card pixel width after render
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const card = trackRef.current.querySelector<HTMLElement>('[data-alumni-card]');
      if (card) setCardWidth(card.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [alumni, itemsPerView]);

  useEffect(() => { setCurrentIndex(0); }, [itemsPerView]);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const res = await fetch(`${apiUrl}/api/alumni?featured=true`);
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (data.success && data.data) setAlumni(data.data);
      } catch { setAlumni([]); }
      finally { setLoading(false); }
    };
    fetchAlumni();
  }, []);

  useEffect(() => {
    if (alumni.length <= itemsPerView || isHovering) {
      if (autoplayRef.current) { clearInterval(autoplayRef.current); autoplayRef.current = null; }
      return;
    }
    autoplayRef.current = setInterval(() => {
      setCurrentIndex(p => { const max = Math.max(0, alumni.length - itemsPerView); return p + 1 > max ? 0 : p + 1; });
    }, 3500);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [alumni.length, itemsPerView, isHovering]);

  const goToNext = () => setCurrentIndex(p => { const max = Math.max(0, alumni.length - itemsPerView); return p + 1 > max ? 0 : p + 1; });
  const goToPrev = () => setCurrentIndex(p => { const max = Math.max(0, alumni.length - itemsPerView); return p - 1 < 0 ? max : p - 1; });

  // Pixel-accurate: each step = cardWidth + gap
  const translateX = cardWidth > 0 ? currentIndex * (cardWidth + GAP) : 0;

  if (loading) {
    return (
      <section id="alumni" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-12 w-64 mx-auto bg-gradient-to-r from-purple-200 to-cyan-200 dark:from-purple-900 dark:to-cyan-900 rounded-xl animate-pulse mb-4" />
            <div className="w-24 h-1.5 mx-auto bg-purple-200 dark:bg-purple-900 rounded-full mb-6 animate-pulse" />
            <div className="h-6 w-96 mx-auto bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (alumni.length === 0) {
    return (
      <section id="alumni" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">{t('alumni')}</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full mb-8" />
            <div className="p-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50">
              <User className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">{t('alumni_empty')}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="alumni" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4">
            {t('alumni')}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 mx-auto rounded-full mb-6 shadow-lg shadow-blue-500/50" />
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('alumni_description')}</p>
        </div>

        {/* Carousel wrapper */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Prev button */}
          {alumni.length > itemsPerView && (
            <>
              <button onClick={goToPrev} aria-label="Previous"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-30 group">
                <div className="relative p-4 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 group-hover:from-purple-500/10 to-blue-500/0 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300" />
                  <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300 relative z-10" />
                </div>
              </button>
              <button onClick={goToNext} aria-label="Next"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-30 group">
                <div className="relative p-4 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 group-hover:from-blue-500/10 to-cyan-500/0 group-hover:to-cyan-500/10 rounded-2xl transition-all duration-300" />
                  <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300 relative z-10" />
                </div>
              </button>
            </>
          )}

          {/* Track — overflow hidden, no px so cards go edge-to-edge */}
          <div className="overflow-hidden py-6">
            <div
              ref={trackRef}
              className="flex transition-transform duration-700 ease-out"
              style={{ gap: `${GAP}px`, transform: `translateX(-${translateX}px)` }}
            >
              {alumni.map((alum, index) => {
                const cs = alumniGradients[index % alumniGradients.length];
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
                const photoUrl = alum.photoUrl
                  ? (alum.photoUrl.startsWith('data:') ? alum.photoUrl : `${apiUrl}${alum.photoUrl}`)
                  : null;
                const projects = alum.projects && Array.isArray(alum.projects) ? alum.projects : [];
                const waveDelay = (index % itemsPerView) * 0.1;
                return (
                  <div
                    key={alum.id}
                    data-alumni-card
                    className="group relative flex-shrink-0 animate-wave-float"
                    style={{
                      width: `calc((100% - ${(itemsPerView - 1) * GAP}px) / ${itemsPerView})`,
                      animationDelay: `${waveDelay}s`,
                    }}
                  >
                    {/* Glow */}
                    <div
                      className="absolute -inset-1 opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-all duration-500 -z-10"
                      style={{ background: `radial-gradient(circle, ${cs.glow}, transparent 70%)` }}
                    />
                    {/* Card */}
                    <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 hover:border-transparent group-hover:-translate-y-3 group-hover:scale-[1.02] flex flex-col h-full">
                      {/* Photo */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        {photoUrl ? (
                          <img src={photoUrl} alt={alum.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" draggable="false" />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${cs.gradient} flex items-center justify-center`}>
                            <div className="p-8 bg-white/90 dark:bg-slate-900/90 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                              <User className="w-16 h-16 text-slate-700 dark:text-slate-300" />
                            </div>
                          </div>
                        )}
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${cs.gradient} opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500`} />
                      </div>
                      {/* Info */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex-1 space-y-3">
                          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white leading-tight">{alum.name}</h3>
                          {alum.position && (
                            <div className="inline-flex">
                              <span className={`px-3 py-1.5 bg-gradient-to-r ${cs.gradient} text-white text-xs font-bold rounded-full shadow-md`}>
                                {alum.position}
                              </span>
                            </div>
                          )}
                          {alum.story && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{alum.story}</p>
                          )}
                        </div>
                        {projects.length > 0 && (
                          <div className="pt-4 space-y-2">
                            {projects.map((project, idx) => (
                              <a key={idx} href={project.url} target="_blank" rel="noopener noreferrer"
                                className={`group/btn flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r ${cs.gradient} text-white text-sm font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden`}
                                onClick={e => e.stopPropagation()}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                <ExternalLink className="w-4 h-4 relative z-10" />
                                <span className="truncate relative z-10">
                                  {locale === 'ky' ? 'Проектти көрүү' : locale === 'ru' ? 'Посмотреть проект' : 'View project'}
                                </span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          {alumni.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(alumni.length / itemsPerView) }).map((_, idx) => (
                <button key={idx} onClick={() => setCurrentIndex(idx)} aria-label={`Slide ${idx + 1}`} className="group">
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentIndex
                      ? 'w-12 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50'
                      : 'w-6 bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-600'
                  }`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes float-slow {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(30px,-30px) scale(1.1); }
        }
        @keyframes float-delayed {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-30px,30px) scale(1.1); }
        }
        .animate-wave-float  { animation: wave-float   4s ease-in-out infinite; }
        .animate-float-slow  { animation: float-slow  20s ease-in-out infinite; }
        .animate-float-delayed{ animation: float-delayed 25s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
