'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Monitor, Users, School, MessageCircle, Smartphone, Globe, Target } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function HybridLearningSection() {
  const t = useTranslations('hybrid');
  const { ref, isVisible } = useScrollAnimation(0.2);

  const steps = [
    {
      number: 1,
      title: t('step1'),
      icon: Monitor,
      description: 'РђР№Р·Р°РґР° РђРєС‹Р»Р±РµРєРѕРІР° (РЎРЁРђ)',
    },
    {
      number: 2,
      title: t('step2'),
      icon: Users,
      description: 'Р”Рѕ 50 СѓС‡РµРЅРёРєРѕРІ РЅР° РјРµРЅС‚РѕСЂР°',
    },
    {
      number: 3,
      title: t('step3'),
      icon: School,
      description: 'РћР РћР—Р‘Р•РљРћР’Рђ, 136',
    },
    {
      number: 4,
      title: t('step4'),
      icon: MessageCircle,
      description: 'РРЅРґРёРІРёРґСѓР°Р»СЊРЅР°СЏ РїРѕРґРґРµСЂР¶РєР°',
    },
    {
      number: 5,
      title: t('step5'),
      icon: Smartphone,
      description: 'Р”РѕСЃС‚СѓРї 24/7',
    },
  ];

  return (
    <section 
      id="learning" 
      ref={ref}
      className={`py-20 bg-white overflow-hidden parallax-section ${
        isVisible ? 'section-transition visible' : 'section-transition'
      }`}
    >
      <Container>
        <div className={`text-center mb-16 ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          <div className={`absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-accent-200 to-purple-200 transform -translate-y-1/2 ${
            isVisible ? 'pulse-glow' : ''
          }`}></div>

          <div className="relative z-10 flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center w-48"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
                  }}
                >
                  {/* Icon Circle */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 cursor-pointer">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-primary-600 rounded-full flex items-center justify-center font-bold text-primary-600">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>

                  {/* Connecting Arrow */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 left-1/2 transform translate-x-12 text-primary-400 text-3xl animate-pulse">
                      в†’
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex items-start space-x-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Number & Icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-primary-600 rounded-full flex items-center justify-center font-bold text-primary-600 text-xs">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="text-primary-400 text-2xl">в†“</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <Globe className="w-8 h-8 text-blue-600" />
              <h4 className="font-bold text-xl text-gray-900">
                РћРЅР»Р°Р№РЅ-РѕР±СѓС‡РµРЅРёРµ
              </h4>
            </div>
            <p className="text-gray-700">
              РђР№Р·Р°РґР° РђРєС‹Р»Р±РµРєРѕРІР° РїСЂРѕРІРѕРґРёС‚ РѕРЅР»Р°Р№РЅ-СѓСЂРѕРєРё РёР· РЎРЁРђ. Р’СЃРµ СѓСЂРѕРєРё
              РґРѕСЃС‚СѓРїРЅС‹ С‡РµСЂРµР· РїСЂРёР»РѕР¶РµРЅРёРµ РћРљРЈР РњР•Рќ.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
            <div className="flex items-center space-x-3 mb-3">
              <Target className="w-8 h-8 text-purple-600" />
              <h4 className="font-bold text-xl text-gray-900">
                РђР­Рњ-РјРµС‚РѕРґРёРєР°
              </h4>
            </div>
            <p className="text-gray-700">
              Р’ РѕР±СѓС‡РµРЅРёРё РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ РђР­Рњ-РјРµС‚РѕРґРёРєР° Р“Р°РїС‹СЂР° РњР°РґР°РјРёРЅРѕРІР° РґР»СЏ
              РјР°РєСЃРёРјР°Р»СЊРЅРѕР№ СЌС„С„РµРєС‚РёРІРЅРѕСЃС‚Рё.
            </p>
          </div>
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

