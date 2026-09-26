'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { RefreshCw, Users, Smartphone, Target, DollarSign, BookOpen, Star } from 'lucide-react';

export default function WhySection() {
  const t = useTranslations('why');

  const features = [
    {
      icon: RefreshCw,
      title: t('hybrid.title'),
      description: t('hybrid.description'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: t('mentor.title'),
      description: t('mentor.description'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Smartphone,
      title: t('access.title'),
      description: t('access.description'),
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Target,
      title: t('methodology.title'),
      description: t('methodology.description'),
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: DollarSign,
      title: t('grant.title'),
      description: t('grant.description'),
      gradient: 'from-yellow-500 to-amber-500',
    },
    {
      icon: BookOpen,
      title: t('activities.title'),
      description: t('activities.description'),
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                hover
                className="group relative overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative Element */}
                  <div
                    className={`mt-4 w-12 h-1 bg-gradient-to-r ${feature.gradient} rounded-full group-hover:w-full transition-all duration-300`}
                  ></div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-2xl shadow-xl p-8 max-w-2xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              <span className="font-bold text-primary-600">3000+</span>{' '}
              студентов уже выбрали ОКУРМЕН для своего IT-образования
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
