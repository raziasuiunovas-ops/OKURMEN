'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // РџРѕРєР°Р·С‹РІР°РµРј РєРЅРѕРїРєСѓ РєРѕРіРґР° РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РїСЂРѕРєСЂСѓС‚РёР» РІРЅРёР· РЅР° 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      aria-label="РџСЂРѕРєСЂСѓС‚РёС‚СЊ РЅР°РІРµСЂС…"
    >
      <ArrowUp size={24} />
    </button>
  );
}

