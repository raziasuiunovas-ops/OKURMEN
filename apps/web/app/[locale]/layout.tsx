import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/app/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  const titles: Record<string, string> = {
    ky: 'ОКУРМЕН IT — Заманбап IT билим берүү',
    ru: 'ОКУРМЕН IT — Современное IT-образование',
    en: 'OKURMEN IT — Modern IT Education',
  };

  const descriptions: Record<string, string> = {
    ky: 'Гибриддик формат, жеке ментор жана чыныгы натыйжалар. 3000+ студент ОКУРМЕН аркылуу билим алышты. Бишкек, Кыргызстан.',
    ru: 'Гибридный формат, личный ментор и реальные результаты. Более 3000 студентов прошли обучение в ОКУРМЕН. Бишкек, Кыргызстан.',
    en: 'Hybrid format, personal mentor, and real results. 3000+ students completed training at OKURMEN. Bishkek, Kyrgyzstan.',
  };

  return {
    title: titles[locale] || titles.ru,
    description: descriptions[locale] || descriptions.ru,
    keywords: [
      'ОКУРМЕН',
      'OKURMEN',
      'IT образование',
      'IT education',
      'программирование',
      'programming',
      'Бишкек',
      'Bishkek',
      'Кыргызстан',
      'Kyrgyzstan',
      'курсы IT',
      'IT courses',
      'ментор',
      'mentor',
    ],
    authors: [
      { name: 'Санжарбек Мадумаров' },
      { name: 'Улукбек Бакыбек уулу' },
    ],
    openGraph: {
      title: titles[locale] || titles.ru,
      description: descriptions[locale] || descriptions.ru,
      url: 'https://okurmen.kg',
      siteName: 'ОКУРМЕН IT',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.ru,
      description: descriptions[locale] || descriptions.ru,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      languages: {
        ky: '/ky',
        ru: '/ru',
        en: '/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
