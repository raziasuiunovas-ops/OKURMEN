'use client';

import { useState } from 'react';
import { Settings, User, Bell, Lock, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'Жалпы', icon: Settings },
    { id: 'profile', name: 'Профиль', icon: User },
    { id: 'notifications', name: 'Билдирүүлөр', icon: Bell },
    { id: 'security', name: 'Коопсуздук', icon: Lock },
  ];

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Орнотуулар
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Системанын орнотууларын башкарыңыз
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden">
        <div className="flex border-b border-slate-200/50 dark:border-slate-700/50 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Theme */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Тема
                </h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    {theme === 'light' ? (
                      <Sun className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {theme === 'light' ? 'Жарык режим' : 'Караңгы режим'}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Көрсөтмө темасын өзгөртүү
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-orange-500' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Тил
                </h3>
                <div className="grid gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        language === lang.code
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500'
                          : 'bg-slate-50 dark:bg-slate-700/50 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {lang.name}
                        </span>
                      </div>
                      {language === lang.code && (
                        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Профиль орнотуулары
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Бул бөлүм иштеп жатат
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Билдирүү орнотуулары
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Бул бөлүм иштеп жатат
                </p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Коопсуздук орнотуулары
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Бул бөлүм иштеп жатат
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
