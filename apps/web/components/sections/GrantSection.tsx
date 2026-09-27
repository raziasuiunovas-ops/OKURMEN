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
        <div className={`max-w-4xl mx-auto mb-12 ${isVisible ? 'magnetic' : ''}`}>
          <Card className="bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 text-gray-900 overflow-hidden shadow-2xl relative group">
            <div className="relative">
              {/* Animated background patterns */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <div className="relative z-10 text-center py-12 px-8">
                <div className="relative inline-block mb-6">
                  <DollarSign className="w-24 h-24 mx-auto text-white drop-shadow-lg animate-bounce" />
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                </div>
                
                <h3 className="text-6xl sm:text-7xl font-bold mb-4 text-white drop-shadow-2xl">
                  <span className="inline-block animate-bounce">10</span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}> </span>
                  <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>000</span>
                  <span className="text-4xl ml-2 inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>сом</span>
                </h3>
                
                <p className="text-xl sm:text-2xl font-semibold mb-6 text-white drop-shadow-lg">
                  Грант для выпускников
                </p>
                
                <div className="max-w-2xl mx-auto glass rounded-xl p-6 shadow-xl backdrop-blur-md border border-white/30">
                  <p className="text-gray-800 leading-relaxed font-medium">
                    {t('description')}
                  </p>
                </div>
                
                {/* Floating icons */}
                <div className="mt-6 flex justify-center gap-4">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Conditions */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8 title-decoration">
            {t('conditions')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {conditions.map((condition, index) => {
              const Icon = condition.icon;
              return (
                <Card
                  key={index}
                  hover
                  className="group relative overflow-hidden card-holographic morph-hover"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${condition.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-20 h-20 mb-4 bg-gradient-to-br ${condition.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 icon-pulse relative overflow-hidden`}
                    >
                      <Icon className="w-10 h-10 text-white relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gradient-static transition-all">
                      {condition.title}
                    </h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {condition.description}
                    </p>
                    
                    {/* Progress bar decoration */}
                    <div className="mt-4 h-1 w-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full group-hover:w-full transition-all duration-700"></div>
                  </div>
                  
                  {/* Decorative corner gradient */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${condition.gradient} opacity-0 group-hover:opacity-20 rounded-bl-full transition-opacity duration-500`}></div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-8 max-w-4xl mx-auto shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-100/50 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-100/50 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6 text-gradient-static">
              Как это работает
            </h3>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  text: 'Успешно завершите обучение на курсе ОКУРМЭН IT',
                  color: 'from-blue-400 to-cyan-400'
                },
                {
                  step: 2,
                  text: 'Получите работу в IT-компании или создайте крупный коммерческий проект',
                  color: 'from-purple-400 to-pink-400'
                },
                {
                  step: 3,
                  text: 'Предоставьте подтверждающие документы',
                  color: 'from-green-400 to-emerald-400'
                },
                {
                  step: 4,
                  text: 'Получите грант 10 000 сом от ОКУРМЭН',
                  color: 'from-yellow-400 to-amber-500'
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 group morph-hover border border-gray-100 hover:border-primary-200"
                >
                  <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative`}>
                    <span className="relative z-10">{item.step}</span>
                    <div className="absolute inset-0 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <p className="flex-grow text-gray-700 pt-2 leading-relaxed group-hover:text-gray-900 transition-colors font-medium">{item.text}</p>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary-500 text-xl">→</div>
                </div>
              ))}
            </div>
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

