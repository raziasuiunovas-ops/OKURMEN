'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode } from '@/types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations: Record<LanguageCode, Record<string, string>> = {
  ru: {
    // Navigation
    'nav.dashboard': 'Главная',
    'nav.myGroup': 'Моя группа',
    'nav.students': 'Студенты',
    'nav.permissions': 'Разрешения',
    'nav.courses': 'Курсы',
    'nav.lessons': 'Уроки',
    'nav.analytics': 'Аналитика',
    'nav.schedule': 'Расписание',
    'nav.bookings': 'Встречи',
    'nav.reviews': 'Отзывы',
    'nav.profile': 'Профиль',
    'nav.settings': 'Настройки',
    'nav.security': 'Безопасность',
    'nav.logout': 'Выход',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.view': 'Просмотр',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.export': 'Экспорт',
    'common.import': 'Импорт',
    'common.refresh': 'Обновить',
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.previous': 'Назад',
    'common.submit': 'Отправить',
    'common.reset': 'Сбросить',
    'common.close': 'Закрыть',
    'common.confirm': 'Подтвердить',
    'common.noData': 'Нет данных',
    'common.selectAll': 'Выбрать все',
    'common.deselectAll': 'Снять выбор',
    
    // Auth
    'auth.signIn': 'Войти',
    'auth.signOut': 'Выйти',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.rememberMe': 'Запомнить меня',
    'auth.forgotPassword': 'Забыли пароль?',
    'auth.twoFactorCode': 'Код 2FA',
    'auth.verify': 'Проверить',
    'auth.enterCode': 'Введите код из Telegram',
    
    // Dashboard
    'dashboard.welcome': 'Добро пожаловать',
    'dashboard.overview': 'Обзор',
    'dashboard.stats': 'Статистика',
    'dashboard.recentActivity': 'Недавняя активность',
    
    // Students
    'students.title': 'Студенты',
    'students.active': 'Активные',
    'students.inactive': 'Неактивные',
    'students.graduated': 'Выпускники',
    'students.progress': 'Прогресс',
    'students.details': 'Детали студента',
    
    // Time
    'time.today': 'Сегодня',
    'time.yesterday': 'Вчера',
    'time.thisWeek': 'На этой неделе',
    'time.thisMonth': 'В этом месяце',
    'time.lastMonth': 'В прошлом месяце',
  },
  ky: {
    // Navigation
    'nav.dashboard': 'Башкы бет',
    'nav.myGroup': 'Менин тобум',
    'nav.students': 'Студенттер',
    'nav.permissions': 'Уруксаттар',
    'nav.courses': 'Курстар',
    'nav.lessons': 'Сабактар',
    'nav.analytics': 'Аналитика',
    'nav.schedule': 'Расписание',
    'nav.bookings': 'Жолугушуулар',
    'nav.reviews': 'Сын-пикирлер',
    'nav.profile': 'Профиль',
    'nav.settings': 'Жөндөөлөр',
    'nav.security': 'Коопсуздук',
    'nav.logout': 'Чыгуу',
    
    // Common
    'common.loading': 'Жүктөлүүдө...',
    'common.error': 'Ката',
    'common.success': 'Ийгиликтүү',
    'common.save': 'Сактоо',
    'common.cancel': 'Жокко чыгаруу',
    'common.delete': 'Өчүрүү',
    'common.edit': 'Өзгөртүү',
    'common.view': 'Көрүү',
    'common.search': 'Издөө',
    'common.noData': 'Маалымат жок',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.myGroup': 'My Group',
    'nav.students': 'Students',
    'nav.permissions': 'Permissions',
    'nav.courses': 'Courses',
    'nav.lessons': 'Lessons',
    'nav.analytics': 'Analytics',
    'nav.schedule': 'Schedule',
    'nav.bookings': 'Bookings',
    'nav.reviews': 'Reviews',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.security': 'Security',
    'nav.logout': 'Logout',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.noData': 'No data',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('ru');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as LanguageCode | null;
    if (savedLang && ['ru', 'ky', 'en'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
