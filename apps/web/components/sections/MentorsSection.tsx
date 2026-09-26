'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { UserCheck, BookOpen, MessageCircle, Target, HandHeart } from 'lucide-react';

export default function MentorsSection() {
  const t = useTranslations('mentors');

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
        </div>

        {/* Key Stat Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-primary-500 to-accent-500 text-white text-center py-12 px-8 shadow-2xl">
            <UserCheck className="w-20 h-20 mx-auto mb-6 text-white" />
            <h3 className="text-5xl font-bold mb-4">50</h3>
            <p className="text-2xl font-semibold mb-2">{t('description')}</p>
            <div className="w-32 h-1 bg-white/50 mx-auto rounded-full mt-6"></div>
          </Card>
        </div>

        {/* Role Description */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-center">
              <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium mb-4">
                Роль ментора
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {t('role')}
              </p>
            </div>
          </Card>
        </div>

        {/* Mentor Responsibilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              title: 'Обучение',
              description: 'Проведение очных занятий 2 раза в неделю',
              gradient: 'from-blue-500 to-cyan-500',
            },
            {
              icon: MessageCircle,
              title: 'Поддержка',
              description: 'Ответы на вопросы студентов',
              gradient: 'from-green-500 to-emerald-500',
            },
            {
              icon: Target,
              title: 'Контроль',
              description: 'Отслеживание прогресса обучения',
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              icon: HandHeart,
              title: 'Индивидуальный подход',
              description: 'Персональное сопровождение каждого студента',
              gradient: 'from-orange-500 to-red-500',
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} hover className="text-center group">
                <div
                  className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 via-accent-50 to-purple-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                2×
              </div>
              <p className="text-gray-700 font-medium">
                Очные занятия в неделю
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-600 mb-2">
                24/7
              </div>
              <p className="text-gray-700 font-medium">
                Доступ к онлайн-урокам
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                1:1
              </div>
              <p className="text-gray-700 font-medium">
                Индивидуальная поддержка
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
