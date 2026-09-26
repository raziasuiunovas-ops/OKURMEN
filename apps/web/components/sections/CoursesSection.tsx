'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Monitor, Palette, Smartphone, BookOpen } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CoursesSection() {
  const t = useTranslations('courses');
  const { ref, isVisible } = useScrollAnimation(0.2);

  // Универсальная структура карточки курса для будущего заполнения из БД
  const coursePlaceholders = [
    {
      id: 1,
      icon: Monitor,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      icon: Palette,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      icon: Smartphone,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section 
      id="courses" 
      ref={ref}
      className={`py-20 bg-gradient-to-br from-gray-50 to-gray-100 ${
        isVisible ? 'section-transition visible' : 'section-transition'
      }`}
    >
      <Container>
        <div className={`text-center mb-16 ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            {t('description')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {coursePlaceholders.map((course, index) => {
            const Icon = course.icon;
            return (
              <Card
                key={course.id}
                hover
                className={`group relative overflow-hidden card-3d ${
                  isVisible ? 'feature-card-bounce' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                {/* Course Icon/Image Placeholder */}
                <div
                  className={`w-full h-48 bg-gradient-to-br ${course.gradient} rounded-xl mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                >
                  <Icon className="w-24 h-24 text-white" />
                </div>

                {/* Course Info Structure */}
                <div className="space-y-4">
                  {/* Title Placeholder */}
                  <div className="h-7 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>

                  {/* Description Placeholder */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                      Гибридный формат
                    </span>
                    <span className="px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-sm font-medium">
                      Личный ментор
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Формат</div>
                      <div className="font-bold text-gray-900">Гибрид</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Занятия</div>
                      <div className="font-bold text-gray-900">2x/неделя</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Доступ</div>
                      <div className="font-bold text-gray-900">24/7</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full mt-4"
                    onClick={() => {
                      // Future: navigate to course detail
                      console.log('Course details');
                    }}
                  >
                    Подробнее
                  </Button>
                </div>

                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 bg-white text-primary-600 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  TBD
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info Message */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-medium mb-4">
            <BookOpen className="w-5 h-5" />
            <span>Информация о курсах</span>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Подробная информация о курсах, программах обучения и ценах будет
            добавлена после согласования с командой ОКУРМЕН. Структура карточек
            курсов готова для заполнения через административную панель.
          </p>
        </div>
      </Container>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
