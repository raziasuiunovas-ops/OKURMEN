'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const contactsT = useTranslations('contacts');

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerLinks = {
    navigation: [
      { key: 'about', href: '#about' },
      { key: 'courses', href: '#courses' },
      { key: 'team', href: '#team' },
      { key: 'reviews', href: '#reviews' },
    ],
    social: [
      {
        name: 'Instagram',
        href: 'https://www.instagram.com/okurmen.kg',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
          </svg>
        ),
        gradient: 'from-purple-500 via-pink-500 to-rose-500'
      },
      {
        name: 'Telegram',
        href: 'https://t.me/okurmen_kg',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
        ),
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        name: 'WhatsApp',
        // TODO: Заменить на реальную ссылку WhatsApp когда будет доступен номер
        href: 'https://wa.me/996990686889',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        ),
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        name: 'Facebook',
        href: 'https://www.facebook.com/profile.php?id=61571215919153',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        ),
        gradient: 'from-blue-600 to-blue-500'
      },
    ]
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <RevealOnScroll delay={0}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.svg" 
                  alt="OKURMEN" 
                  className="h-11 w-auto" 
                />
                <span className="font-display text-2xl font-extrabold bg-gradient-to-r from-orange-500 via-orange-600 to-blue-600 bg-clip-text text-transparent">
                  ОКУРМЭН
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t('about')}
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {footerLinks.social.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 bg-slate-800 hover:bg-gradient-to-br ${social.gradient} rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-glow`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Navigation Links */}
          <RevealOnScroll delay={100}>
            <div>
              <h3 className="font-display text-lg font-bold mb-6 relative inline-block">
                {t('navigation')}
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-500 to-blue-600"></span>
              </h3>
              <ul className="space-y-3">
                {footerLinks.navigation.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className="group inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary-400 transition-colors"></span>
                      {navT(item.key as any)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          {/* Contact Info */}
          <RevealOnScroll delay={200}>
            <div>
              <h3 className="font-display text-lg font-bold mb-6 relative inline-block">
                {contactsT('title')}
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-500 to-blue-600"></span>
              </h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3 group">
                  <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                    <MapPin className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="flex-1 leading-relaxed">{contactsT('address_value')}</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                    <Phone className="w-4 h-4 text-orange-400" />
                  </div>
                  <a href="tel:+996990686889" className="hover:text-orange-400 transition-colors font-medium">
                    +996 990 686 889
                  </a>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                    <Mail className="w-4 h-4 text-orange-400" />
                  </div>
                  <a href="mailto:info@okurmen.kg" className="hover:text-orange-400 transition-colors font-medium">
                    info@okurmen.kg
                  </a>
                </li>
              </ul>
            </div>
          </RevealOnScroll>

          {/* Working Hours */}
          <RevealOnScroll delay={300}>
            <div>
              <h3 className="font-display text-lg font-bold mb-6 relative inline-block">
                {t('working_hours')}
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-500 to-blue-600"></span>
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-slate-400">Дүй - Бей</span>
                  <span className="text-orange-400 font-semibold">09:00 - 21:00</span>
                </li>
                <li className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-slate-400">Жума</span>
                  <span className="text-slate-600">Эс алуу</span>
                </li>
                <li className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-slate-400">Иш - Жек</span>
                  <span className="text-orange-400 font-semibold">09:00 - 21:00</span>
                </li>
              </ul>
            </div>
          </RevealOnScroll>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2024 <span className="text-orange-400 font-semibold">ОКУРМЭН</span>. {t('rights')}
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-orange-400 transition-colors">{t('privacy')}</a>
              <a href="#" className="hover:text-orange-400 transition-colors">{t('terms')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
