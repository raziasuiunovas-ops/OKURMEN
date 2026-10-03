'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BilbarsWelcome() {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState<'bilbars' | 'logo' | 'fade'>('bilbars');

  useEffect(() => {
    // Check if welcome was already shown
    const hasSeenWelcome = sessionStorage.getItem('bilbars-welcome-shown');
    
    if (hasSeenWelcome) {
      setIsVisible(false);
      return;
    }

    // Stage 1: Show BILBARS (1.5s)
    const timer1 = setTimeout(() => {
      setStage('logo');
    }, 1500);

    // Stage 2: Show logo (1.5s)
    const timer2 = setTimeout(() => {
      setStage('fade');
    }, 3000);

    // Stage 3: Fade out (0.8s) then hide
    const timer3 = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('bilbars-welcome-shown', 'true');
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white dark:bg-slate-900 flex items-center justify-center transition-opacity duration-800 ${
        stage === 'fade' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* БИЛБАРС с открытыми руками */}
        <div
          className={`transition-all duration-1000 ${
            stage === 'bilbars' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
          }`}
        >
          <Image
            src="/bilbars/приветствие с открытой рукой.jpg"
            alt="БИЛБАРС"
            width={300}
            height={300}
            className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* OKURMEN Logo */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            stage === 'logo' || stage === 'fade' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <Image
            src="/logo.svg"
            alt="OKURMEN"
            width={200}
            height={60}
            className="h-16 w-auto dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            alt="OKURMEN"
            width={200}
            height={60}
            className="h-16 w-auto hidden dark:block"
          />
        </div>
      </div>
    </div>
  );
}
