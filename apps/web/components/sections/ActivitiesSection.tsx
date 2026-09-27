'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Sprout, Mic, Keyboard, MessageCircle, Bot, Target, GraduationCap, TrendingUp, Users } from 'lucide-react';

export default function ActivitiesSection() {
  const t = useTranslations('activities');

  const activities = [
    {
      title: t('onugu'),
      icon: Sprout,
      gradient: 'from-green-500 to-emerald-500',
      description: 'УЁРЅТЇРіТЇТЇ СЃР°Р±Р°РєС‚Р°СЂС‹',
    },
    {
      title: t('oratory'),
      icon: Mic,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Р Р°Р·РІРёС‚РёРµ РЅР°РІС‹РєРѕРІ РїСѓР±Р»РёС‡РЅС‹С… РІС‹СЃС‚СѓРїР»РµРЅРёР№',
    },
    {
      title: t('literacy'),
      icon: Keyboard,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Р‘Р°Р·РѕРІС‹Рµ РЅР°РІС‹РєРё СЂР°Р±РѕС‚С‹ СЃ РєРѕРјРїСЊСЋС‚РµСЂРѕРј',
    },
    {
      title: t('talking'),
      icon: MessageCircle,
      gradient: 'from-orange-500 to-red-500',
      description: 'Р Р°Р·РіРѕРІРѕСЂРЅС‹Р№ РєР»СѓР± РґР»СЏ РїСЂР°РєС‚РёРєРё СЏР·С‹РєР°',
    },
    {
      title: t('ai'),
      icon: Bot,
      gradient: 'from-indigo-500 to-purple-500',
      description: 'РСЃРєСѓСЃСЃС‚РІРµРЅРЅС‹Р№ РёРЅС‚РµР»Р»РµРєС‚ Рё СЃРѕРІСЂРµРјРµРЅРЅС‹Рµ С‚РµС…РЅРѕР»РѕРіРёРё',
    },
    {
      title: t('seminars'),
      icon: Target,
      gradient: 'from-yellow-500 to-amber-500',
      description: 'РЎРµРјРёРЅР°СЂС‹ РѕС‚ Р“Р°РїС‹СЂР° РњР°РґР°РјРёРЅРѕРІР°',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Card
                key={index}
                hover
                className="group relative overflow-hidden cursor-pointer"
              >
                {/* Background Gradient on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${activity.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br ${activity.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {activity.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {activity.description}
                  </p>

                  {/* Decorative Line */}
                  <div
                    className={`mt-4 h-1 bg-gradient-to-r ${activity.gradient} rounded-full w-0 group-hover:w-full transition-all duration-500`}
                  ></div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Info Section */}
        <div className="mt-16 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            РљРѕРјРїР»РµРєСЃРЅРѕРµ СЂР°Р·РІРёС‚РёРµ
          </h3>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            РћРљРЈР РњР•Рќ РїСЂРµРґР»Р°РіР°РµС‚ РЅРµ С‚РѕР»СЊРєРѕ IT-РѕР±СЂР°Р·РѕРІР°РЅРёРµ, РЅРѕ Рё РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ
            РїСЂРѕРіСЂР°РјРјС‹ РґР»СЏ РІСЃРµСЃС‚РѕСЂРѕРЅРЅРµРіРѕ СЂР°Р·РІРёС‚РёСЏ СЃС‚СѓРґРµРЅС‚РѕРІ. РњС‹ СЃРѕР·РґР°С‘Рј
            РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅСѓСЋ СЌРєРѕСЃРёСЃС‚РµРјСѓ, РєРѕС‚РѕСЂР°СЏ РїРѕРјРѕРіР°РµС‚ СЂР°Р·РІРёРІР°С‚СЊ РєР°Рє
            С‚РµС…РЅРёС‡РµСЃРєРёРµ, С‚Р°Рє Рё Р»РёС‡РЅРѕСЃС‚РЅС‹Рµ РЅР°РІС‹РєРё.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4 flex-wrap gap-2">
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-md flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>РћР±СЂР°Р·РѕРІР°РЅРёРµ</span>
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-md flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Р Р°Р·РІРёС‚РёРµ</span>
            </span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-md flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>РЎРѕРѕР±С‰РµСЃС‚РІРѕ</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}



