'use client';

import HeroSection from '@/components/sections/HeroSection';
import WhySection from '@/components/sections/WhySection';
import CoursesSection from '@/components/sections/CoursesSection';
import StatsBar from '@/components/sections/StatsBar';
import TeamSection from '@/components/sections/TeamSection';
import AlumniSection from '@/components/sections/AlumniSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ContactsSection from '@/components/sections/ContactsSection';
import ApplicationFormSection from '@/components/sections/ApplicationFormSection';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function LandingSections() {
  return (
    <>
      <HeroSection />
      <RevealOnScroll delay={0}>
        <CoursesSection />
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <WhySection />
      </RevealOnScroll>
      <RevealOnScroll delay={0}>
        <StatsBar />
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <TeamSection />
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <AlumniSection />
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <ReviewsSection />
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <ContactsSection />
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <ApplicationFormSection />
      </RevealOnScroll>
    </>
  );
}
