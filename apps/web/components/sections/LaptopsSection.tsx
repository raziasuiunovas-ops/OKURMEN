'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Laptop, Mouse, Briefcase as BagIcon, Plug, DollarSign, Package, GraduationCap, Info } from 'lucide-react';

export default function LaptopsSection() {
  const t = useTranslations('laptops');

  const includes = [
    {
      icon: Laptop,
      title: 'Ноутбук',
      description: 'Современная модель для обучения',
    },
    {
      icon: Mouse,
      title: t('mouse'),
      description: 'Удобная мышь для работы',
    },
    {
      icon: BagIcon,
      title: t('bag'),
      description: 'Защитная сумка для переноски',
    },
    {
      icon: Plug,
      title: t('charger'),
      description: 'Оригинальное зарядное устройство',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            {t('description')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Laptop Visual */}
          <div className="relative">
            <Card className="bg-gradient-to-br from-gray-100 to-gray-200 p-12 text-center shadow-2xl">
              <Laptop className="w-32 h-32 mx-auto mb-6 text-gray-600" />
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
                  <div className="mt-4 inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
                    TBD
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-primary-200 rounded-full blur-2xl opacity-50"></div>
              <div className="absolute bottom-4 left-4 w-20 h-20 bg-accent-200 rounded-full blur-2xl opacity-50"></div>
            </Card>
          </div>

          {/* Package Includes */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {t('includes')}:
            </h3>
            <div className="space-y-4">
              {includes.map((item, index) => (
                <Card
                  key={index}
                  hover
                  className="group flex items-center space-x-4"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-primary-600">
                    <svg
                      className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Преимущества покупки через ОКУРМЕН
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                title: 'Удобная цена',
                description: 'Доступные цены для студентов',
              },
              {
                icon: Package,
                title: 'Полный комплект',
                description: 'Всё необходимое в одном пакете',
              },
              {
                icon: GraduationCap,
                title: 'Для обучения',
                description: 'Подходит для всех курсов ОКУРМЕН',
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-3 text-primary-600" />
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info & CTA */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
          <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-medium mb-4">
            <Info className="w-5 h-5 inline mr-2" />Информация о ноутбуках
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">
            Точные модели ноутбуков, цены, характеристики и условия покупки
            будут добавлены после согласования с командой ОКУРМЕН.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              // Future: open inquiry form
              console.log('Laptop inquiry');
            }}
          >
            Узнать подробнее
          </Button>
        </div>
      </Container>
    </section>
  );
}
