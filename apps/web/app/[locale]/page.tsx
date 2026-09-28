import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import WhySection from '@/components/sections/WhySection';
import CoursesSection from '@/components/sections/CoursesSection';
import StatsBar from '@/components/sections/StatsBar';
import TeamSection from '@/components/sections/TeamSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ContactsSection from '@/components/sections/ContactsSection';
import ApplicationFormSection from '@/components/sections/ApplicationFormSection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <CoursesSection />
      <WhySection />
      <StatsBar />
      <TeamSection />
      <ReviewsSection />
      <ContactsSection />
      <ApplicationFormSection />
      <Footer />
    </main>
  );
}
