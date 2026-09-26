'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { GraduationCap, Star, Building2, Landmark, Building, Flag, Briefcase, Globe, Rocket } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function StudentsSection() {
  const t = useTranslations('students');
  const { ref, isVisible } = useScrollAnimation(0.2);

  const achievements = [
    {
      icon: Building2,
      company: 'Apple',
      description: t('apple'),
      gradient: 'from-gray-700 to-gray-900',
      highlight: true,
    },
    {
      icon: Landmark,
      company: 'Мэрия Бишкека',
      description: t('mayor'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Building,
      company: 'Kulikovsky',
      description: t('kulikovsky'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Flag,
      company: 'IT-компании Казахстана',
      description: t('kazakhstan'),
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Briefcase,
      company: 'Фриланс',
      description: t('freelance'),
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section 
      id="students" 
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
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Stat */}
        <div className={`max-w-4xl mx-auto mb-16 ${isVisible ? 'float-animation' : ''}`}>
          <Card className="bg-gradient-to-br from-primary-500 via-accent-500 to-purple-500 text-white text-center py-12 px-8 shadow-2xl">
            <GraduationCap className="w-20 h-20 mx-auto mb-6 text-white" />
            <h3 className="text-6xl font-bold mb-4">3000+</h3>
            <p className="text-2xl font-semibold">{t('total')}</p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={index}
                hover
                className={`group relative overflow-hidden card-3d ${
                  achievement.highlight ? 'lg:col-span-3' : ''
                } ${isVisible ? 'stagger-item' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {achievement.highlight && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured</span>
                  </div>
                )}

                <div
                  className={`flex ${
                    achievement.highlight
                      ? 'flex-col md:flex-row items-center'
                      : 'flex-col items-start'
                  } gap-6`}
                >
                  {/* Icon */}
                  <div
                    className={`${
                      achievement.highlight ? 'w-32 h-32' : 'w-20 h-20'
                    } flex-shrink-0 bg-gradient-to-br ${
                      achievement.gradient
                    } rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`${achievement.highlight ? 'w-16 h-16' : 'w-10 h-10'} text-white`} />
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3
                      className={`${
                        achievement.highlight ? 'text-3xl' : 'text-xl'
                      } font-bold text-gray-900 mb-2`}
                    >
                      {achievement.company}
                    </h3>
                    <p
                      className={`text-gray-600 ${
                        achievement.highlight ? 'text-lg' : 'text-base'
                      }`}
                    >
                      {achievement.description}
                    </p>
                    <div
                      className={`mt-4 h-1 bg-gradient-to-r ${achievement.gradient} rounded-full w-0 group-hover:w-full transition-all duration-500`}
                    ></div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Success Stories Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Истории успеха
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[
              {
                icon: Briefcase,
                title: 'Трудоустройство',
                description:
                  'Выпускники работают в крупных компаниях и государственных учреждениях',
              },
              {
                icon: Globe,
                title: 'Международный опыт',
                description:
                  'Студенты получают возможность работать в компаниях разных стран',
              },
              {
                icon: Rocket,
                title: 'Карьерный рост',
                description:
                  'От студента до профессионала в IT-индустрии',
              },
            ].map((story, index) => {
              const Icon = story.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">
                    {story.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{story.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-bold text-primary-600">
                Каждая история успеха
              </span>{' '}
              начинается с первого шага. Присоединяйтесь к ОКУРМЕН и станьте
              частью нашего растущего сообщества профессионалов IT-индустрии.
            </p>
          </div>
        </div>
      </Container>

      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  );
}
