'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { GraduationCap, Users as UsersIcon, Star, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ReviewsSection() {
  const t = useTranslations('reviews');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const studentReviews = [1, 2, 3, 4, 5];
  const parentReviews = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % Math.max(studentReviews.length, parentReviews.length));
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isPaused, studentReviews.length, parentReviews.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % Math.max(studentReviews.length, parentReviews.length));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + Math.max(studentReviews.length, parentReviews.length)) % Math.max(studentReviews.length, parentReviews.length));
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 reviews-section-animated">
      <Container>
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
        </div>

        {/* Review Carousel */}
        <div 
          className="reviews-carousel-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button 
            onClick={prevSlide}
            className="carousel-nav carousel-nav-left"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Student Reviews Carousel */}
            <div className="carousel-column">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <GraduationCap className="w-8 h-8 text-orange-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('students')}
                </h3>
              </div>

              <div className="carousel-track">
                {studentReviews.map((index) => (
                  <Card 
                    key={index} 
                    hover 
                    className={`carousel-card ${
                      index === activeSlide ? 'active' : 
                      index === (activeSlide - 1 + studentReviews.length) % studentReviews.length ? 'prev' : 
                      index === (activeSlide + 1) % studentReviews.length ? 'next' : 'hidden'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        S
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-full"></div>
                          <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Отзыв студента {index}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Parent Reviews Carousel */}
            <div className="carousel-column">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <UsersIcon className="w-8 h-8 text-orange-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('parents')}
                </h3>
              </div>

              <div className="carousel-track">
                {parentReviews.map((index) => (
                  <Card 
                    key={index} 
                    hover 
                    className={`carousel-card ${
                      index === activeSlide ? 'active' : 
                      index === (activeSlide - 1 + parentReviews.length) % parentReviews.length ? 'prev' : 
                      index === (activeSlide + 1) % parentReviews.length ? 'next' : 'hidden'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        P
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-full"></div>
                          <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-100 rounded w-4/6"></div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Отзыв родителя {index}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={nextSlide}
            className="carousel-nav carousel-nav-right"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {studentReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`indicator ${index === activeSlide ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Info Message */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
          <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-medium mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Отзывы</span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Отзывы студентов и родителей будут добавлены после сбора и
            согласования с авторами отзывов.
          </p>
          <p className="text-sm text-gray-600">
            Структура предусматривает отображение: имени, фото, текста отзыва,
            рейтинга и возможности добавления видео-отзывов.
          </p>
        </div>

        {/* Overall Rating Display */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { label: 'Качество обучения', rating: '5.0' },
            { label: 'Поддержка менторов', rating: '5.0' },
            { label: 'Результаты', rating: '5.0' },
          ].map((item, index) => (
            <Card key={index} className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {item.rating}
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 font-medium">{item.label}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

