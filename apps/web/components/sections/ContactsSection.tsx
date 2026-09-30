'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactsSection() {
  const t = useTranslations('contacts');
  const scheduleT = useTranslations('schedule');

  const contactInfo = [
    {
      icon: MapPin,
      title: t('address'),
      value: t('address_value'),
      link: null,
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600'
    },
    {
      icon: Phone,
      title: t('phone'),
      value: '+996 990 686 889',
      link: 'tel:+996990686889',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@okurmen.kg',
      link: 'mailto:info@okurmen.kg',
      gradient: 'from-purple-500 to-indigo-500',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600'
    },
  ];

  const schedule = [
    { days: scheduleT('monday_thursday'), time: '09:00 - 21:00', active: true },
    { days: scheduleT('friday_label'), time: scheduleT('closed'), active: false },
    { days: scheduleT('saturday_sunday'), time: '09:00 - 21:00', active: true },
  ];

  return (
    <section id="contacts" className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/10 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Cards */}
          <div className="lg:col-span-2 grid md:grid-cols-3 gap-6">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              const content = (
                <div
                  className="group relative p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-premium-lg border-2 border-slate-200 dark:border-slate-700 hover:border-transparent transition-all duration-300 hover:-translate-y-2 animate-scale-in overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${contact.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>

                  <div className="relative space-y-5">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl ${contact.iconBg} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                      <Icon className={`w-7 h-7 ${contact.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                      {contact.title}
                    </h3>

                    {/* Value */}
                    <p className={`text-sm leading-relaxed ${contact.link ? 'text-orange-600 dark:text-orange-400 font-semibold group-hover:text-orange-700 dark:group-hover:text-orange-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      {contact.value}
                    </p>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute bottom-4 right-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`absolute bottom-0 right-0 w-6 h-0.5 bg-gradient-to-l ${contact.gradient}`}></div>
                    <div className={`absolute bottom-0 right-0 w-0.5 h-6 bg-gradient-to-t ${contact.gradient}`}></div>
                  </div>
                </div>
              );

              return contact.link ? (
                <a key={index} href={contact.link} className="relative block">
                  {content}
                </a>
              ) : (
                <div key={index} className="relative">
                  {content}
                </div>
              );
            })}
          </div>

          {/* Schedule Card */}
          <div className="relative p-8 bg-gradient-to-br from-orange-600 via-orange-500 to-blue-600 rounded-2xl shadow-premium-lg text-white animate-scale-in overflow-hidden" style={{ animationDelay: '0.3s' }}>
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}></div>
            </div>

            {/* Animated Background Shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="font-display text-2xl font-bold">{scheduleT('title')}</h3>
              </div>

              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/40 ${
                      !item.active ? 'opacity-70' : ''
                    }`}
                  >
                    <span className="font-semibold text-sm">{item.days}</span>
                    <span className={`text-sm font-bold ${item.active ? 'text-white' : 'text-white/70'}`}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-sm text-white/90 text-center">
                  📞 {scheduleT('call_or_apply')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t('follow_us')}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t('social_description')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/okurmen.kg/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white dark:bg-slate-900 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 text-slate-700 dark:text-slate-300 hover:text-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-110 border border-slate-200 dark:border-slate-700"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@okurmen_kg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white dark:bg-slate-900 hover:bg-red-600 text-slate-700 dark:text-slate-300 hover:text-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-110 border border-slate-200 dark:border-slate-700"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
