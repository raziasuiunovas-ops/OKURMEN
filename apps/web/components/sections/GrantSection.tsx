'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Gift, DollarSign, Briefcase, Rocket, Target } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function GrantSection() {
  const t = useTranslations('grant');
  const { ref, isVisible } = useScrollAnimation(0.2);

  const conditions = [
    {
      icon: Briefcase,
      title: 'Трудоустройство',
      description: 'Получите работу после окончания курса',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Rocket,
      title: 'Коммерческий проект',
      description: 'Создайте крупный коммерческий проект',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section 
      ref={ref}
      className={`py-20 bg-white relative overflow-hidden ${
        isVisible ? 'section-transition visible' : 'section-transition'
      }`}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className={`absolute -top-20 -right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl ${
          isVisible ? 'float-animation' : ''
        }`}></div>
        <div className={`absolute -bottom-20 -left-20 w-96 h-96 bg-amber-300 rounded-full blur-3xl ${
          isVisible ? 'float-animation' : ''
        }`} style={{ animationDelay: '1s' }}></div>
      </div>

      <Container className="relative z-10">
        <div className={`text-center mb-16 ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-6 py-2 rounded-full font-bold text-lg mb-6 shadow-lg pulse-glow">
            <Gift className="w-5 h-5 inline mr-2" />Специальное предложение
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-amber-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Grant Card */}
        <div className={`max-w-4xl mx-auto mb-12 ${isVisible ? 'magnetic-hover' : ''}`}>
          <Card className="bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 text-gray-900 overflow-hidden shadow-2xl card-3d">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>

              <div className="relative z-10 text-center py-12 px-8">
                <DollarSign className="w-24 h-24 mx-auto mb-6 text-white" />
                <h3 className="text-6xl sm:text-7xl font-bold mb-4">
                  10 000
                  <span className="text-4xl ml-2">сом</span>
                </h3>
                <p className="text-xl sm:text-2xl font-semibold mb-6">
                  Грант для выпускников
                </p>
                <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {t('description')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Conditions */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('conditions')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {conditions.map((condition, index) => {
              const Icon = condition.icon;
              return (
                <Card
                  key={index}
                  hover
                  className="group relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${condition.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-20 h-20 mb-4 bg-gradient-to-br ${condition.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">
                      {condition.title}
                    </h4>
                    <p className="text-gray-600 text-lg">
                      {condition.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Как это работает
          </h3>
          <div className="space-y-4">
            {[
              {
                step: 1,
                text: 'Успешно завершите обучение на курсе ОКУРМЕН IT',
              },
              {
                step: 2,
                text: 'Получите работу в IT-компании или создайте крупный коммерческий проект',
              },
              {
                step: 3,
                text: 'Предоставьте подтверждающие документы',
              },
              {
                step: 4,
                text: 'Получите грант 10 000 сом от ОКУРМЕН',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {item.step}
                </div>
                <p className="flex-grow text-gray-700 pt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-6 py-3 rounded-full">
            <Target className="w-6 h-6 text-gray-800" />
            <p className="text-gray-800 font-medium">
              Ваш успех — наша цель
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
