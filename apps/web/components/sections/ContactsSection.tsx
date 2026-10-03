'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

export default function ContactsSection() {
  const t = useTranslations('contacts');
  const scheduleT = useTranslations('schedule');

  const contactInfo = [
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
          <div className="lg:col-span-2 space-y-6">
            {/* Phone and Email - Top Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone Card */}
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={index}
                    href={contact.link}
                    className="group relative p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-premium-lg border-2 border-slate-200 dark:border-slate-700 hover:border-transparent transition-all duration-300 hover:-translate-y-2 animate-scale-in overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${contact.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                        backgroundSize: '20px 20px'
                      }}></div>
                    </div>

                    <div className="relative space-y-5">
                      <div className={`inline-flex p-4 rounded-2xl ${contact.iconBg} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                        <Icon className={`w-7 h-7 ${contact.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                        {contact.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-orange-600 dark:text-orange-400 font-semibold group-hover:text-orange-700 dark:group-hover:text-orange-300">
                        {contact.value}
                      </p>
                    </div>

                    <div className="absolute bottom-4 right-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`absolute bottom-0 right-0 w-6 h-0.5 bg-gradient-to-l ${contact.gradient}`}></div>
                      <div className={`absolute bottom-0 right-0 w-0.5 h-6 bg-gradient-to-t ${contact.gradient}`}></div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Address Card - Horizontal under Phone/Email */}
            <div className="group relative p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 rounded-2xl shadow-soft hover:shadow-premium-lg border-2 border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-500/5 dark:from-blue-500/10 dark:via-cyan-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 dark:bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t('address')}
                    </h3>
                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 font-semibold">
                      {t('address_value')}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Бишкек, Кыргызстан
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:flex-shrink-0">
                  <a
                    href="https://go.2gis.com/0NyFS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md"
                  >
                    <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                    <span>2GIS</span>
                  </a>
                  <a
                    href="https://maps.app.goo.gl/ssPcmD2k8dtYKoQy7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-md"
                  >
                    <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                    <span>Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 right-0 w-6 h-0.5 bg-gradient-to-l from-blue-500 to-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-0.5 h-6 bg-gradient-to-t from-blue-500 to-cyan-500"></div>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="group relative p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-premium-lg border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:-translate-y-2 animate-scale-in overflow-hidden" style={{ animationDelay: '0.3s' }}>
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{scheduleT('title')}</h3>
              </div>

              <div className="space-y-3">
                {schedule.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-300 hover:scale-[1.02] ${
                      !item.active ? 'opacity-60' : ''
                    }`}
                  >
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{item.days}</span>
                    <span className={`text-sm font-bold ${item.active ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-5 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                <p className="text-xs text-orange-800 dark:text-orange-300 text-center font-medium">
                  📞 {scheduleT('call_or_apply')}
                </p>
              </div>
            </div>

            {/* Decorative corner */}
            <div className="absolute bottom-4 right-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 right-0 w-6 h-0.5 bg-gradient-to-l from-orange-500 to-orange-600"></div>
              <div className="absolute bottom-0 right-0 w-0.5 h-6 bg-gradient-to-t from-orange-500 to-orange-600"></div>
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
                href="https://www.instagram.com/okurmen_it?stkn=MWpxOXB1MHFubGdvbQ=="
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
                href="https://api.whatsapp.com/send/?phone=%2B996507811015&text&type=phone_number&app_absent=0&wame_ctl=1&fbclid=PAT01DUAUp05NleHRuA2FlbQIxMABwZG9mAnNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp5jIFGxZlestkweSDe7Ggb66tr4z_qGS4IvdBFTe402FjGFuU1vuDYuWYvLe_aem_8nustHx4nJMeX7z4x_Og5A"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white dark:bg-slate-900 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-500 text-slate-700 dark:text-slate-300 hover:text-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-110 border border-slate-200 dark:border-slate-700"
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@Okurmen_edu"
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
