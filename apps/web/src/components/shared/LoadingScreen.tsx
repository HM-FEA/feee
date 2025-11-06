'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Complete loading after fade out animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <h1
          className={`text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-cyan to-accent-emerald transition-all duration-1000 ${
            fadeOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
          style={{ animationDelay: '0.3s' }}
        >
          Nexus-Alpha
        </h1>
        <p
          className={`text-text-secondary text-lg mt-4 transition-all duration-1000 delay-300 ${
            fadeOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          Initializing Platform...
        </p>
      </div>
    </div>
  );
}
