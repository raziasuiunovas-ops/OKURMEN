'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ru' | 'en' | 'ky';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ru: {
    // Общие
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.add': 'Добавить',
    'common.search': 'Поиск',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    
    // Навигация
    'nav.dashboard': 'Дашборд',
    'nav.courses': 'Курсы',
    'nav.lessons': 'Уроки',
    'nav.students': 'Ученики',
    'nav.employees': 'Сотрудники',
    'nav.applications': 'Заявки',
    'nav.payments': 'Платежи',
    'nav.reviews': 'Отзывы',
    'nav.alumni': 'Выпускники',
    'nav.settings': 'Настройки',
    'nav.logout': 'Выйти',
    
    // Дашборд
    'dashboard.title': 'Панель управления',
    'dashboard.overview': 'Обзор',
    'dashboard.stats': 'Статистика',
    'dashboard.analytics': 'Аналитика',
    
    // Курсы
    'courses.title': 'Управление курсами',
    'courses.add': 'Добавить курс',
    'courses.name': 'Название курса',
    'courses.description': 'Описание',
    'courses.duration': 'Длительность',
    'courses.price': 'Стоимость',
    'courses.status': 'Статус',
    
    // Сотрудники
    'employees.title': 'Сотрудники',
    'employees.add': 'Добавить сотрудника',
    'employees.name': 'Имя',
    'employees.position': 'Должность',
    'employees.email': 'Email',
    'employees.phone': 'Телефон',
    
    // Авторизация
    'auth.signin': 'Вход',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.code': 'Код подтверждения',
    'auth.getCode': 'Получить код',
    'auth.verify': 'Войти',
    'auth.logout': 'Выйти',
  },
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.courses': 'Courses',
    'nav.lessons': 'Lessons',
    'nav.students': 'Students',
    'nav.employees': 'Employees',
    'nav.applications': 'Applications',
    'nav.payments': 'Payments',
    'nav.reviews': 'Reviews',
    'nav.alumni': 'Alumni',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.stats': 'Statistics',
    'dashboard.analytics': 'Analytics',
    
    // Courses
    'courses.title': 'Course Management',
    'courses.add': 'Add Course',
    'courses.name': 'Course Name',
    'courses.description': 'Description',
    'courses.duration': 'Duration',
    'courses.price': 'Price',
    'courses.status': 'Status',
    
    // Employees
    'employees.title': 'Employees',
    'employees.add': 'Add Employee',
    'employees.name': 'Name',
    'employees.position': 'Position',
    'employees.email': 'Email',
    'employees.phone': 'Phone',
    
    // Auth
    'auth.signin': 'Sign In',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.code': 'Verification Code',
    'auth.getCode': 'Get Code',
    'auth.verify': 'Sign In',
    'auth.logout': 'Logout',
  },
  ky: {
    // Жалпы
    'common.save': 'Сактоо',
    'common.cancel': 'Жокко чыгаруу',
    'common.delete': 'Өчүрүү',
    'common.edit': 'Өзгөртүү',
    'common.add': 'Кошуу',
    'common.search': 'Издөө',
    'common.loading': 'Жүктөлүүдө...',
    'common.error': 'Ката',
    'common.success': 'Ийгиликтүү',
    
    // Навигация
    'nav.dashboard': 'Башкы панель',
    'nav.courses': 'Курстар',
    'nav.lessons': 'Сабактар',
    'nav.students': 'Окуучулар',
    'nav.employees': 'Кызматкерлер',
    'nav.applications': 'Арыздар',
    'nav.payments': 'Төлөмдөр',
    'nav.reviews': 'Пикирлер',
    'nav.alumni': 'Бүтүрүүчүлөр',
    'nav.settings': 'Жөндөөлөр',
    'nav.logout': 'Чыгуу',
    
    // Башкы панель
    'dashboard.title': 'Башкы панель',
    'dashboard.overview': 'Жалпы көрүнүш',
    'dashboard.stats': 'Статистика',
    'dashboard.analytics': 'Аналитика',
    
    // Курстар
    'courses.title': 'Курстарды башкаруу',
    'courses.add': 'Курс кошуу',
    'courses.name': 'Курстун аталышы',
    'courses.description': 'Сүрөттөмө',
    'courses.duration': 'Узактыгы',
    'courses.price': 'Баасы',
    'courses.status': 'Статус',
    
    // Кызматкерлер
    'employees.title': 'Кызматкерлер',
    'employees.add': 'Кызматкер кошуу',
    'employees.name': 'Аты',
    'employees.position': 'Кызматы',
    'employees.email': 'Email',
    'employees.phone': 'Телефон',
    
    // Авторизация
    'auth.signin': 'Кируу',
    'auth.email': 'Email',
    'auth.password': 'Сырсөз',
    'auth.code': 'Ырастоо коду',
    'auth.getCode': 'Код алуу',
    'auth.verify': 'Кируу',
    'auth.logout': 'Чыгуу',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');

  useEffect(() => {
    // Загружаем язык из localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['ru', 'en', 'ky'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ru']] || key;
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
