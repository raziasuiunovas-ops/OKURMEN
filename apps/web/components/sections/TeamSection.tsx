'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Users, Laptop, GraduationCap, Briefcase } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function TeamSection() {
  const t = useTranslations('team');
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section 
      id="team" 
      ref={ref}
      className={`py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 ${
        isVisible ? 'section-transition visible' : 'section-transition'
      }`}
    >
      <Container>
        <div className={`text-center mb-16 ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            {t('description')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
        </div>

        {/* Подтверждённая информация о команде */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Основатели */}
          <Card 
            hover 
            variant="gradient"
            className={`${isVisible ? 'stagger-item' : ''}`}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Основатели
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Май 2022</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                  Санжарбек Мадумаров
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Сооснователь</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                  Улукбек Бакыбек уулу
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Сооснователь</p>
              </div>
            </div>
          </Card>

          {/* Онлайн-преподаватель */}
          <Card 
            hover 
            variant="gradient"
            className={`${isVisible ? 'stagger-item' : ''}`}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Laptop className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Онлайн-уроки
                </h3>
                <p className="text-gray-600 dark:text-gray-400">USA</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="font-bold text-lg text-gray-900 dark:text-white">
                Айзада Акылбекова
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Преподаватель онлайн-уроков
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Работает в США. Проводит онлайн-уроки для студентов ОКУРМЭН.
              </p>
            </div>
          </Card>
        </div>

        {/* Структура команды */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card hover variant="glass" className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Преподаватели
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Опытные специалисты IT-индустрии
            </p>
          </Card>

          <Card hover variant="glass" className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Менторы
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              До 50 студентов на одного ментора
            </p>
          </Card>

          <Card hover variant="glass" className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Управление
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Администрация и координация
            </p>
          </Card>

          <Card hover variant="glass" className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Laptop className="w-10 h-10 text-white" />
            </div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
              Техподдержка
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              IT-инфраструктура и поддержка
            </p>
          </Card>
        </div>

        {/* Info Message */}
        <Card variant="glass" className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-full font-medium mb-4">
            <Users className="w-5 h-5" />
            <span>Информация о команде</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Подробная информация о сотрудниках, преподавателях и менторах ОКУРМЭН находится в процессе сбора и будет добавлена после согласования с командой.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Структура карточек сотрудников предусматривает: ФИО, должность, фото, описание, опыт, специализацию, образование и профессиональные навыки.
          </p>
        </Card>
      </Container>
    </section>
  );
}
