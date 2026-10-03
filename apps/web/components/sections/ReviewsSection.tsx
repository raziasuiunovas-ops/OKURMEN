'use client';

import { Star, User, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import ReviewModal from '@/components/ReviewModal';
import AuthModal from '@/components/AuthModal';

interface Review {
  id: string;
  rating: number;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  createdAt: string;
  authorName: string;
  text: string;
  user: {
    id: string;
    fullName: string;
  } | null;
  course: {
    id: string;
    slug: string;
    translations: {
      languageCode: string;
      title: string;
    }[];
  } | null;
}

export default function ReviewsSection() {
  const locale = useLocale();
  const t = useTranslations('reviews');
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-pink-500 to-rose-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-indigo-500',
    'from-orange-500 to-amber-500',
    'from-teal-500 to-cyan-500',
  ];

  // Update itemsPerView on mount and resize
  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width >= 1024) {
          setItemsPerView(3);
        } else if (width >= 640) {
          setItemsPerView(2);
        } else {
          setItemsPerView(1);
        }
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const fetchReviews = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/reviews`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Фильтруем только опубликованные отзывы (API уже возвращает только PUBLISHED)
        const publishedReviews = data.data.filter((review: Review) => review.status === 'PUBLISHED');
        setReviews(publishedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleWriteReview = () => {
    // Проверяем авторизацию
    if (!session) {
      setIsAuthModalOpen(true);
    } else {
      setIsReviewModalOpen(true);
    }
  };

  const handleReviewSuccess = () => {
    // Перезагрузить отзывы после успешной отправки
    fetchReviews();
  };

  // Carousel controls
  const maxIndex = Math.max(0, Math.ceil(reviews.length / itemsPerView) - 1);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (loading) {
    return (
      <section id="reviews" className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section id="reviews" className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {t('student_reviews')}
            </p>
            <div className="p-12 bg-white dark:bg-slate-900 rounded-2xl">
              <Quote className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
                {t('no_reviews_yet')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                {t('be_first_to_share')}
              </p>
              
              {/* Кнопка "Написать отзыв" */}
              <button
                onClick={handleWriteReview}
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <span>{t('write_review')}</span>
                <Star className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Модалки */}
        <ReviewModal 
          isOpen={isReviewModalOpen} 
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={handleReviewSuccess}
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          initialMode="login"
        />
      </section>
    );
  }

  return (
    <section id="reviews" className="py-20 bg-slate-50 dark:bg-slate-800/50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('description')}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {reviews.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-3 bg-white dark:bg-slate-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-110"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-3 bg-white dark:bg-slate-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:scale-110"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: Math.ceil(reviews.length / itemsPerView) }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2"
                >
                  {reviews
                    .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                    .map((review, index) => {
                      const gradient = gradients[index % gradients.length];
                      const studentName = review.user?.fullName || review.authorName || t('anonymous');
                      
                      // Найти перевод курса для текущей локали
                      const courseTranslation = review.course?.translations?.find(
                        (tr) => tr.languageCode === locale.toUpperCase()
                      ) || review.course?.translations?.[0];
                      const courseTitle = courseTranslation?.title || '';

                      return (
                        <div
                          key={review.id}
                          className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-soft hover:shadow-premium-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800 hover:-translate-y-2 min-h-[320px] flex flex-col"
                        >
                          {/* Quote Icon Background */}
                          <div className={`absolute top-6 right-6 p-3 bg-gradient-to-br ${gradient} rounded-xl opacity-10`}>
                            <Quote className="w-8 h-8" />
                          </div>

                          <div className="space-y-5 flex-1 flex flex-col">
                            {/* Avatar and Info */}
                            <div className="flex items-start gap-4">
                              <div className={`flex-shrink-0 p-3 bg-gradient-to-br ${gradient} rounded-full`}>
                                <User className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white truncate">
                                  {studentName}
                                </h4>
                                {courseTitle && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                                    {courseTitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-5 h-5 ${
                                    i < review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-slate-300 dark:text-slate-600'
                                  }`} 
                                />
                              ))}
                            </div>

                            {/* Review Text */}
                            <div className="flex-1">
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-6">
                                {review.text}
                              </p>
                            </div>

                            {/* Date */}
                            <div className="text-xs text-slate-500 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
                              {new Date(review.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'ky' ? 'ky-KG' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>

                          {/* Decorative corner on hover */}
                          <div className="absolute bottom-4 right-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className={`absolute bottom-0 right-0 w-6 h-0.5 bg-gradient-to-l ${gradient}`}></div>
                            <div className={`absolute bottom-0 right-0 w-0.5 h-6 bg-gradient-to-t ${gradient}`}></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {reviews.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'w-8 bg-orange-600'
                      : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Кнопка "Написать отзыв" */}
          <div className="flex justify-center mt-12">
            <button
              onClick={handleWriteReview}
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <span>{t('write_review')}</span>
              <Star className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Модалки */}
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={handleReviewSuccess}
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </section>
  );
}
