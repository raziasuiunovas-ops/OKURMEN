'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Users, User, Info, Laptop } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function TeamSection() {
  const t = useTranslations('team');
  const { ref, isVisible } = useScrollAnimation(0.2);

  // Placeholder для будущих данных из OKURMEN_TEAM.md
  const teamPlaceholders = [
    {
      id: 1,
      role: 'Основатели',
      color: 'from-primary-500 to-accent-500',
    },
    {
      id: 2,
      role: 'Преподаватели',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      role: 'Менторы',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 4,
      role: 'Управление',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section 
      id="team" 
      ref={ref}
      className={`py-20 bg-gradient-to-br from-gray-50 to-gray-100 parallax-section ${
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

        {/* Подтверждённая информация о команде */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Основатели */}
          <Card 
            hover 
            className={`bg-gradient-to-br from-primary-50 to-accent-50 card-3d ${
              isVisible ? 'stagger-item' : ''
            }`}
            style={{ animationDelay: '0s' }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Основатели
                </h3>
                <p className="text-gray-600">Май 2022</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="font-bold text-lg text-gray-900">
                  Санжарбек Мадумаров
                </p>
                <p className="text-gray-600 text-sm">Сооснователь</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="font-bold text-lg text-gray-900">
                  Улукбек Бакыбек уулу
                </p>
                <p className="text-gray-600 text-sm">Сооснователь</p>
              </div>
            </div>
          </Card>

          {/* Онлайн-преподаватель */}
          <Card 
            hover 
            className={`bg-gradient-to-br from-purple-50 to-pink-50 card-3d ${
              isVisible ? 'stagger-item' : ''
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Laptop className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Онлайн-уроки
                </h3>
                <p className="text-gray-600">USA</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="font-bold text-lg text-gray-900">
                Айзада Акылбекова
              </p>
              <p className="text-gray-600 text-sm mb-2">
                Преподаватель онлайн-уроков
              </p>
              <p className="text-gray-700 text-sm">
                Работает в США. Проводит онлайн-уроки для студентов ОКУРМЕН.
              </p>
            </div>
          </Card>
        </div>

        {/* Team Structure Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teamPlaceholders.map((placeholder, index) => (
            <Card key={placeholder.id} hover className="text-center">
              <div
                className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${placeholder.color} rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300`}
              >
                <User className="w-12 h-12 text-white" />
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">
                {placeholder.role}
              </h4>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
              </div>
              <div className="mt-4 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                TBD
              </div>
            </Card>
          ))}
        </div>

        {/* Info Message */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-medium mb-4">
            <Info className="w-5 h-5" />
            <span>Информация о команде</span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Подробная информация о сотрудниках, преподавателях и менторах
            ОКУРМЕН находится в процессе сбора и будет добавлена после
            согласования с командой.
          </p>
          <p className="text-sm text-gray-600">
            Структура карточек сотрудников предусматривает: ФИО, должность,
            фото, описание, опыт, специализацию, образование и профессиональные
            навыки.
          </p>
        </div>
      </Container>
    </section>
  );
}
