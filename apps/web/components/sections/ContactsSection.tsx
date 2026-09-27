'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Clock, Smartphone, Shield, MessageCircle, Send } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function ContactsSection() {
  const t = useTranslations('contacts');
  const { ref, isVisible } = useScrollAnimation(0.2);

  // Статические значения для кругов (чтобы избежать hydration mismatch)
  const backgroundCircles = [
    { width: 120, height: 100, left: 10, top: 15, opacity: 0.2 },
    { width: 80, height: 90, left: 85, top: 25, opacity: 0.15 },
    { width: 100, height: 110, left: 45, top: 60, opacity: 0.25 },
    { width: 70, height: 80, left: 20, top: 80, opacity: 0.1 },
    { width: 90, height: 95, left: 70, top: 45, opacity: 0.18 },
    { width: 110, height: 85, left: 30, top: 35, opacity: 0.22 },
    { width: 75, height: 105, left: 60, top: 70, opacity: 0.12 },
    { width: 95, height: 75, left: 15, top: 50, opacity: 0.16 },
    { width: 85, height: 100, left: 80, top: 10, opacity: 0.19 },
    { width: 105, height: 90, left: 50, top: 20, opacity: 0.14 },
  ];

  return (
    <section 
      id="contacts" 
      ref={ref}
      className={`py-20 bg-gradient-to-br from-primary-500 via-accent-500 to-purple-500 text-white relative overflow-hidden ${
        isVisible ? 'section-transition visible' : 'section-transition'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {backgroundCircles.map((circle, i) => (
            <div
              key={i}
              className={`absolute bg-white rounded-full ${
                isVisible ? 'float-animation' : ''
              }`}
              style={{
                width: circle.width + 'px',
                height: circle.height + 'px',
                left: circle.left + '%',
                top: circle.top + '%',
                opacity: circle.opacity,
                animationDelay: `${i * 0.2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <Container className="relative z-10">
        <div className={`text-center mb-16 ${isVisible ? 'fade-in-up' : ''}`}>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Address Card */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{t('address')}</h3>
                  <p className="text-white/90 text-lg font-semibold">
                    {t('address_value')}
                  </p>
                  <p className="text-white/70 text-sm mt-1">Бишкек, Кыргызстан</p>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-white flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/70 mb-1">{t('phone')}</p>
                    <p className="text-white/60 text-sm">{t('curator')}: TBD</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-white flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/70 mb-1">{t('email')}</p>
                    <a href="mailto:info@okurmen.kg" className="text-white hover:text-white/80 transition-colors">
                      info@okurmen.kg
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-white flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/70 mb-1">{t('workingHours')}</p>
                    <p className="text-white">{t('workingHoursValue')}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <h4 className="font-bold text-lg mb-4">{t('social')}</h4>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="#contacts"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-sm font-medium group"
                  title={t('telegram')}
                >
                  <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{t('telegram')}</span>
                </a>
                <a
                  href="#contacts"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-sm font-medium group"
                  title={t('whatsapp')}
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{t('whatsapp')}</span>
                </a>
                <a
                  href="#contacts"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-sm font-medium group"
                  title="Social"
                >
                  <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Social</span>
                </a>
                <a
                  href="#contacts"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-sm font-medium group"
                  title="Messenger"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Messenger</span>
                </a>
              </div>
              <p className="text-xs text-white/60 mt-4 text-center">
                {t('curator')}: TBD
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div>
            <Card className="bg-white text-gray-900 shadow-2xl">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {t('cta')}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Заполните форму, и мы свяжемся с вами для консультации о курсах
                и процессе обучения в ОКУРМЭН IT.
              </p>

              {/* Simple Form Structure */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Введите ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="+996"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Интересующий курс (опционально)
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all">
                    <option>Выберите курс</option>
                    <option>TBD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Комментарий (опционально)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Дополнительная информация"
                  ></textarea>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    // Future: submit form
                    console.log('Form submitted');
                  }}
                >
                  Отправить заявку
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </Card>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-16 flex flex-col items-center space-y-4">
          <a 
            href="http://localhost:3003" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-medium transition-all hover:scale-105"
          >
            <Shield className="w-5 h-5" />
            <span>Админ-панель</span>
          </a>
        </div>
      </Container>
    </section>
  );
}




