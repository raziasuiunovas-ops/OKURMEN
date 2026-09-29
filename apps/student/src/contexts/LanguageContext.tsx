'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ru' | 'en' | 'ky';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': { ru: 'Главная', en: 'Dashboard', ky: 'Башкы' },
  'nav.courses': { ru: 'Мои курсы', en: 'My Courses', ky: 'Менин курстарым' },
  'nav.group': { ru: 'Моя группа', en: 'My Group', ky: 'Менин тобум' },
  'nav.leaderboard': { ru: 'Рейтинг', en: 'Leaderboard', ky: 'Рейтинг' },
  'nav.bookings': { ru: 'Бронирования', en: 'Bookings', ky: 'Брондоо' },
  'nav.profile': { ru: 'Профиль', en: 'Profile', ky: 'Профиль' },
  'nav.logout': { ru: 'Выйти', en: 'Logout', ky: 'Чыгуу' },

  // Dashboard
  'dashboard.greeting': { ru: 'Привет', en: 'Hello', ky: 'Салам' },
  'dashboard.streak': { ru: 'дней подряд', en: 'days streak', ky: 'күн катары' },
  
  // Common
  'common.loading': { ru: 'Загрузка...', en: 'Loading...', ky: 'Жүктөлүүдө...' },
  'common.error': { ru: 'Ошибка', en: 'Error', ky: 'Ката' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang && ['ru', 'en', 'ky'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  // Always provide the context, even before mounting
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
