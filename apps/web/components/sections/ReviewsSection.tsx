'use client';

import { Star, Quote, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import ReviewModal from '@/components/ReviewModal';
import AuthModal from '@/components/AuthModal';

interface Review {
  id: string; rating: number; status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  createdAt: string; authorName: string; text: string; lang?: string; isDemo?: boolean;
  user: { id: string; fullName: string } | null;
  course: { id: string; slug: string; translations: { languageCode: string; title: string }[] } | null;
}
type CardVariant = 'default' | 'filled' | 'outlined';

const GR = [
  { a:'from-orange-500', b:'to-amber-400',   light:'bg-orange-50 dark:bg-orange-950/30',   border:'border-orange-200 dark:border-orange-800'   },
  { a:'from-blue-500',   b:'to-cyan-400',    light:'bg-blue-50 dark:bg-blue-950/30',       border:'border-blue-200 dark:border-blue-800'       },
  { a:'from-violet-500', b:'to-purple-400',  light:'bg-violet-50 dark:bg-violet-950/30',   border:'border-violet-200 dark:border-violet-800'   },
  { a:'from-emerald-500',b:'to-teal-400',    light:'bg-emerald-50 dark:bg-emerald-950/30', border:'border-emerald-200 dark:border-emerald-800' },
  { a:'from-rose-500',   b:'to-pink-400',    light:'bg-rose-50 dark:bg-rose-950/30',       border:'border-rose-200 dark:border-rose-800'       },
  { a:'from-sky-500',    b:'to-indigo-400',  light:'bg-sky-50 dark:bg-sky-950/30',         border:'border-sky-200 dark:border-sky-800'         },
];
const VARIANTS: CardVariant[] = ['filled','default','outlined','default','outlined','filled','default','outlined','default','filled'];
const PREVIEW = 160;


const MOCK: Review[] = [
  {id:'d1',rating:5,status:'PUBLISHED',createdAt:'2026-09-15T10:00:00Z',authorName:'Айдана Бекова',lang:'ky',isDemo:true,
   text:'ОКУРМЭН \u2014 бул жөн гана курс эмес, бул чыныгы мектеп. Мен IT жөнүндө эч нерсе билбей келдим. Биринчи айда эле программалоонун негиздерин үйрөндүм, экинчи айда болсо өзүм кичинекей проект жаздым. Мугалимдер сабырдуу, баарын деталдуу түшүндүрүшөт. Практика абдан чоң орун ээлейт \u2014 теорияны окуп, дароо жазасың. ОКУРМЭН жөнүндө бардык досторума айттым.',
   user:null,course:null},
  {id:'d2',rating:5,status:'PUBLISHED',createdAt:'2026-09-02T14:30:00Z',authorName:'Бекзат Усупов',lang:'ru',isDemo:true,
   text:'До обучения я почти не разбирался в IT. Здесь мне понравилось, что всё объясняют постепенно и можно сразу применять знания на практике. Уже через два месяца я сделал свой первый рабочий проект.',
   user:null,course:null},
  {id:'d3',rating:5,status:'PUBLISHED',createdAt:'2026-08-20T09:15:00Z',authorName:'Алина Джумалиева',lang:'ru',isDemo:true,
   text:'Очень понравилось обучение. Всё понятно и интересно.',user:null,course:null},
  {id:'d4',rating:5,status:'PUBLISHED',createdAt:'2026-08-10T11:00:00Z',authorName:'Эрмек Токтомаматов',lang:'ky',isDemo:true,
   text:'Мен өмүрүмдө биринчи жолу компьютер программасын өзүм жаздым. Бул сезимди сүрөттөп берүү кыйын. Менторлор жакшы болушту, суроолорго дайыма жооп беришти.',
   user:null,course:null},
  {id:'d5',rating:4,status:'PUBLISHED',createdAt:'2026-07-28T16:45:00Z',authorName:'Kamila Rakhimova',lang:'en',isDemo:true,
   text:'I joined OKURMEN with zero experience and did not know what to expect. The curriculum is well-structured and mentors are genuinely invested in your progress. Hands-on projects made all the difference \u2014 you do not just watch tutorials, you actually build things. One thing I would improve is more advanced topics, but overall it has been a great experience.',
   user:null,course:null},
  {id:'d6',rating:5,status:'PUBLISHED',createdAt:'2026-07-14T08:30:00Z',authorName:'Нурбек Асанов',lang:'ru',isDemo:true,
   text:'Курс дал мне системное понимание разработки. Особенно ценю то, что менторы не просто читают лекции, а разбирают реальные кейсы. После окончания я уже получил первый оффер.',
   user:null,course:null},
  {id:'d7',rating:5,status:'PUBLISHED',createdAt:'2026-06-30T13:00:00Z',authorName:'Гүлнара Мамытова',lang:'ky',isDemo:true,
   text:'Оку процесси абдан жакшы уюштурулган. Ар бир тема практика менен колдоого алынат. Мен дизайн курсун бүттүм жана азыр фриланс иштеп жатам.',
   user:null,course:null},
  {id:'d8',rating:4,status:'PUBLISHED',createdAt:'2026-06-12T10:20:00Z',authorName:'Даниил Ким',lang:'ru',isDemo:true,
   text:'Хороший курс с акцентом на практику. Преподаватели всегда на связи, отвечают быстро. Есть небольшие недочёты в расписании, но в целом доволен. Рекомендую тем, кто хочет войти в IT без лишней воды.',
   user:null,course:null},
  {id:'d9',rating:5,status:'PUBLISHED',createdAt:'2026-05-25T15:10:00Z',authorName:'Зарина Эшматова',lang:'ru',isDemo:true,
   text:'Пришла сюда после университета, чтобы получить реальные навыки. ОКУРМЭН дал именно то, что нужно: практика с первого дня, живые проекты, адекватная обратная связь от менторов. За три месяца прошла путь от новичка до уверенного junior-разработчика. Сейчас прохожу собеседования и чувствую себя намного увереннее, чем после пяти лет в вузе.',
   user:null,course:null},
  {id:'d10',rating:3,status:'PUBLISHED',createdAt:'2026-05-05T09:00:00Z',authorName:'Тимур Абдыкалыков',lang:'ky',isDemo:true,
   text:'Жалпысынан жакшы, бирок кээ бир сабактарда темп өтө тез болуп кетет. Кошумча материалдар болсо жакшы болмок. Практика бөлүгү күчтүү.',
   user:null,course:null},
];


function Stars({ n, sm }: { n: number; sm?: boolean }) {
  const sz = sm ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${sz} ${i<=n?'fill-yellow-400 text-yellow-400':'fill-white/30 text-white/30'}`} />
      ))}
    </div>
  );
}
function StarsLight({ n, sm }: { n: number; sm?: boolean }) {
  const sz = sm ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${sz} ${i<=n?'fill-yellow-400 text-yellow-400':'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`} />
      ))}
    </div>
  );
}
type TFn = ReturnType<typeof useTranslations>;

function ExpandModal({ review, gi, onClose, t }: { review: Review; gi: number; onClose: () => void; t: TFn }) {
  const g = GR[gi % GR.length];
  const name = review.user?.fullName || review.authorName;
  useEffect(() => { document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow=''; }; }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key==='Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation:'okrIn .22s cubic-bezier(.34,1.56,.64,1) both' }}
        onClick={e=>e.stopPropagation()}>
        <div className={`h-1.5 w-full bg-gradient-to-r ${g.a} ${g.b}`} />
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${g.a} ${g.b} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold select-none">{name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">{name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <StarsLight n={review.rating} sm />
              <span className="text-xs text-slate-500">{review.rating}/5</span>
            </div>
          </div>
          <button onClick={onClose} aria-label={t('close') as string}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-5 max-h-[55vh] overflow-y-auto">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">{review.text}</p>
        </div>
        <div className="px-5 pb-4 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            {t('close') as string}
          </button>
        </div>
      </div>
      <style>{`@keyframes okrIn{from{opacity:0;transform:scale(.93) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}


// FILLED — gradient background, white text
function CardFilled({ review, idx, t }: { review: Review; idx: number; t: TFn }) {
  const [open, setOpen] = useState(false);
  const g = GR[idx % GR.length];
  const name = review.user?.fullName || review.authorName;
  const isLong = review.text.length > PREVIEW;
  const preview = isLong ? review.text.slice(0, PREVIEW).trimEnd() + '\u2026' : review.text;

  const SPIN_COLORS = [
    '142,249,252','142,252,204','142,252,157','215,252,142','252,252,142',
    '252,208,142','252,142,142','252,142,239','204,142,252','142,202,252',
  ];

  return (
    <>
      <article className={`group relative flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 bg-gradient-to-br ${g.a} ${g.b}`}
        style={{ aspectRatio: '1 / 1' }}>
        {/* Uiverse 3-D spinner — фон */}
        <div className="rv-spinner-wrap">
          <div className="rv-spinner-inner" style={{ '--quantity': 10 } as React.CSSProperties}>
            {SPIN_COLORS.map((c, i) => (
              <div key={i} className="rv-spin-card" style={{ '--index': i, '--color-card': c } as React.CSSProperties}>
                <div className="rv-spin-img" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-3 right-4 opacity-10 pointer-events-none" aria-hidden="true">
          <Quote className="w-16 h-16 text-white" />
        </div>
        <div className="flex flex-col flex-1 p-5 gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
              <span className="text-white font-bold text-sm select-none">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm text-white truncate">{name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Stars n={review.rating} sm />
                <span className="text-xs text-white/70">{review.rating}/5</span>
              </div>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed text-sm flex-1">{preview}</p>
          {isLong && (
            <button onClick={() => setOpen(true)} className="self-start text-xs font-semibold text-white underline underline-offset-2 hover:text-white/80 transition-colors focus:outline-none">
              {t('read_more') as string}
            </button>
          )}
          <p className="text-xs text-white/50 pt-2 border-t border-white/20">
            {new Date(review.createdAt).toLocaleDateString('ru-RU', { year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
      </article>
      {open && <ExpandModal review={review} gi={idx} onClose={() => setOpen(false)} t={t} />}
    </>
  );
}

// OUTLINED — tinted bg, coloured border, quote-first layout
function CardOutlined({ review, idx, t }: { review: Review; idx: number; t: TFn }) {
  const [open, setOpen] = useState(false);
  const g = GR[idx % GR.length];
  const name = review.user?.fullName || review.authorName;
  const isLong = review.text.length > PREVIEW;
  const preview = isLong ? review.text.slice(0, PREVIEW).trimEnd() + '\u2026' : review.text;

  const SPIN_COLORS = [
    '142,249,252','142,252,204','142,252,157','215,252,142','252,252,142',
    '252,208,142','252,142,142','252,142,239','204,142,252','142,202,252',
  ];

  return (
    <>
      <article className={`group relative flex flex-col rounded-2xl overflow-hidden border-2 ${g.border} ${g.light} hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5`}
        style={{ aspectRatio: '1 / 1' }}>
        {/* Uiverse 3-D spinner — фон */}
        <div className="rv-spinner-wrap">
          <div className="rv-spinner-inner" style={{ '--quantity': 10 } as React.CSSProperties}>
            {SPIN_COLORS.map((c, i) => (
              <div key={i} className="rv-spin-card" style={{ '--index': i, '--color-card': c } as React.CSSProperties}>
                <div className="rv-spin-img" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col flex-1 p-5 gap-3 relative z-10">
          <div className={`self-start text-5xl font-serif leading-none bg-gradient-to-r ${g.a} ${g.b} bg-clip-text text-transparent select-none`} aria-hidden="true">&ldquo;</div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm flex-1 -mt-1">{preview}</p>
          {isLong && (
            <button onClick={() => setOpen(true)} className={`self-start text-xs font-semibold bg-gradient-to-r ${g.a} ${g.b} bg-clip-text text-transparent hover:opacity-75 transition-opacity focus:outline-none`}>
              {t('read_more') as string}
            </button>
          )}
          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g.a} ${g.b} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-xs select-none">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-xs text-slate-900 dark:text-white truncate">{name}</p>
              <StarsLight n={review.rating} sm />
            </div>
            <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString('ru-RU',{month:'short',year:'numeric'})}</span>
          </div>
        </div>
      </article>
      {open && <ExpandModal review={review} gi={idx} onClose={() => setOpen(false)} t={t} />}
    </>
  );
}

// DEFAULT — white bg, top stripe, author top
function CardDefault({ review, idx, t }: { review: Review; idx: number; t: TFn }) {
  const [open, setOpen] = useState(false);
  const g = GR[idx % GR.length];
  const name = review.user?.fullName || review.authorName;
  const isLong = review.text.length > PREVIEW;
  const preview = isLong ? review.text.slice(0, PREVIEW).trimEnd() + '\u2026' : review.text;

  const SPIN_COLORS = [
    '142,249,252','142,252,204','142,252,157','215,252,142','252,252,142',
    '252,208,142','252,142,142','252,142,239','204,142,252','142,202,252',
  ];

  return (
    <>
      <article className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
        style={{ aspectRatio: '1 / 1' }}>
        {/* Uiverse 3-D spinner — фон */}
        <div className="rv-spinner-wrap">
          <div className="rv-spinner-inner" style={{ '--quantity': 10 } as React.CSSProperties}>
            {SPIN_COLORS.map((c, i) => (
              <div key={i} className="rv-spin-card" style={{ '--index': i, '--color-card': c } as React.CSSProperties}>
                <div className="rv-spin-img" />
              </div>
            ))}
          </div>
        </div>

        <div className={`h-1 w-full bg-gradient-to-r ${g.a} ${g.b} flex-shrink-0 relative z-10`} />
        <div className="flex flex-col flex-1 p-5 gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.a} ${g.b} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <span className="text-white font-bold text-sm select-none">{name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">{name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <StarsLight n={review.rating} sm />
                <span className={`text-xs font-semibold ${review.rating===5?'text-yellow-500':review.rating>=4?'text-amber-400':'text-slate-400'}`}>{review.rating}/5</span>
              </div>
            </div>
            <Quote className="w-7 h-7 flex-shrink-0 opacity-[0.06] group-hover:opacity-[0.15] transition-opacity text-slate-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex-1">{preview}</p>
          {isLong && (
            <button onClick={() => setOpen(true)} className={`self-start text-xs font-semibold bg-gradient-to-r ${g.a} ${g.b} bg-clip-text text-transparent hover:opacity-75 transition-opacity focus:outline-none`}>
              {t('read_more') as string}
            </button>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-600 pt-2 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
            {new Date(review.createdAt).toLocaleDateString('ru-RU', { year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
      </article>
      {open && <ExpandModal review={review} gi={idx} onClose={() => setOpen(false)} t={t} />}
    </>
  );
}

function ReviewCard({ review, idx, t }: { review: Review; idx: number; t: TFn }) {
  const v = VARIANTS[idx % VARIANTS.length];
  if (v === 'filled')   return <CardFilled   review={review} idx={idx} t={t} />;
  if (v === 'outlined') return <CardOutlined review={review} idx={idx} t={t} />;
  return                       <CardDefault  review={review} idx={idx} t={t} />;
}


export default function ReviewsSection() {
  const locale = useLocale();
  const t = useTranslations('reviews');
  const { data: session } = useSession();

  const [realReviews, setRealReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pauseRef = useRef(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [animKey, setAnimKey] = useState(0);

  const reviews: Review[] = realReviews.length > 0 ? realReviews : MOCK;
  const isDemo = realReviews.length === 0 && !loading;
  const total = reviews.length;

  const fetchReviews = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const res = await fetch(`${apiUrl}/api/reviews`);
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRealReviews(data.data.filter((r: Review) => r.status === 'PUBLISHED'));
      }
    } catch { /* use demo */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const goTo = useCallback((dir: 'left' | 'right') => {
    setDirection(dir);
    setAnimKey(k => k + 1);
    setCurrentIndex(p => {
      if (dir === 'left')  return p >= total - 1 ? 0 : p + 1;
      return p <= 0 ? total - 1 : p - 1;
    });
  }, [total]);

  const next = useCallback(() => goTo('left'),  [goTo]);
  const prev = useCallback(() => goTo('right'), [goTo]);

  // Autoplay every 3.5 s, pause on hover
  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => { if (!pauseRef.current) next(); }, 3500);
    return () => clearInterval(id);
  }, [total, next]);

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove  = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd   = () => {
    const d = touchStart - touchEnd;
    if (Math.abs(d) > 50) d > 0 ? next() : prev();
    setTouchStart(0); setTouchEnd(0);
  };

  const handleWriteReview = () => !session ? setIsAuthModalOpen(true) : setIsReviewModalOpen(true);

  if (loading) {
    return (
      <section id="reviews" className="py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-48 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-72 mx-auto animate-pulse" />
          </div>
          <div className="max-w-2xl mx-auto h-56 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  // 3-card visible: prev (partial) | center (full) | next (partial)
  // We render 5 slots: [-2, -1, 0, +1, +2] relative to currentIndex
  // Outer container clips to show ~1/2 of side cards
  const getIdx = (offset: number) => ((currentIndex + offset) % total + total) % total;

  return (
    <section id="reviews" className="py-20 bg-slate-50 dark:bg-slate-900/60 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-16 left-8 w-72 h-72 rounded-full bg-orange-300/10 dark:bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-16 right-8 w-96 h-96 rounded-full bg-blue-300/10 dark:bg-blue-500/5 blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-5" />
          <p className="text-lg text-slate-600 dark:text-slate-400">{t('description')}</p>
          {isDemo && (
            <span className="inline-block mt-4 px-3 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800">
              {t('demo_notice')}
            </span>
          )}
        </div>

        {/* 3-card carousel: center full, sides partial */}
        <div
          className="relative"
          onMouseEnter={() => { pauseRef.current = true; }}
          onMouseLeave={() => { pauseRef.current = false; }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Prev arrow */}
          <button onClick={prev} aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
            style={{ left: 0 }}>
            <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next arrow */}
          <button onClick={next} aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200"
            style={{ right: 0 }}>
            <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="overflow-hidden mx-12">
            <div
              key={animKey}
              className="flex gap-4 items-stretch"
              style={{
                /* each card = 66% wide + 16px gap
                   to center the middle card: shift left by one card+gap
                   66% of container + 16px */
                transform: 'translateX(calc(-66% - 16px))',
                animation: `rv3slide${direction === 'left' ? 'L' : 'R'} .38s cubic-bezier(.4,0,.2,1) both`,
              }}
            >
              {[-1, 0, 1].map((offset) => {
                const ri = getIdx(offset);
                const isCenter = offset === 0;
                return (
                  <div
                    key={`${animKey}-${offset}`}
                    className="flex-shrink-0 transition-all duration-300"
                    style={{
                      width: 'calc(66%)',
                      opacity: isCenter ? 1 : 0.52,
                      transform: isCenter ? 'scale(1)' : 'scale(0.96)',
                      transformOrigin: offset < 0 ? 'right center' : 'left center',
                      pointerEvents: isCenter ? 'auto' : 'none',
                    }}
                  >
                    <ReviewCard review={reviews[ri]} idx={ri} t={t as TFn} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 'left' : 'right');
                  setAnimKey(k => k + 1);
                  setCurrentIndex(i);
                }}
                aria-label={`Review ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'}`}
              />
            ))}
          </div>

          {/* Counter */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-2">
            {currentIndex + 1} / {total}
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <button onClick={handleWriteReview}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-orange-500/25 hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
            <Star className="w-5 h-5" />
            <span>{t('write_review')}</span>
          </button>
        </div>
      </div>

      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} onSuccess={fetchReviews} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode="login" />

      <style>{`
        @keyframes rv3slideL {
          from { transform: translateX(0px); }
          to   { transform: translateX(calc(-66% - 16px)); }
        }
        @keyframes rv3slideR {
          from { transform: translateX(calc(-132% - 32px)); }
          to   { transform: translateX(calc(-66% - 16px)); }
        }

        /* ── Uiverse 3-D spinner за карточками ── */
        .rv-spinner-wrap {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .rv-spinner-inner {
          --w: 120px;
          --h: 120px;
          --translateZ: calc((var(--w) + var(--h)) + 0px);
          --rotateX: -15deg;
          --perspective: 1000px;
          position: absolute;
          width: var(--w);
          height: var(--h);
          top: 50%;
          left: 50%;
          margin-top: calc(var(--h) / -2);
          margin-left: calc(var(--w) / -2 - 2.5px);
          transform-style: preserve-3d;
          transform: perspective(var(--perspective));
          animation: rv-rotating 20s linear infinite;
        }
        @keyframes rv-rotating {
          from { transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0); }
          to   { transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(1turn); }
        }
        .rv-spin-card {
          position: absolute;
          border-radius: 14px;
          overflow: hidden;
          inset: 0;
          transform: rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ));
          border: 2px solid rgba(var(--color-card), 0.7);
        }
        .rv-spin-img {
          width: 100%;
          height: 100%;
          background: #0000 radial-gradient(
            circle,
            rgba(var(--color-card), 0.15) 0%,
            rgba(var(--color-card), 0.45) 80%,
            rgba(var(--color-card), 0.75) 100%
          );
        }
      `}</style>
    </section>
  );
}
