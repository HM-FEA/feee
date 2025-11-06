"use client";

import React from 'react';
import { ArrowDown } from 'lucide-react';

const Starfield = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
    {Array.from({ length: 100 }).map((_, i) => {
      const size = Math.random() * 2 + 1;
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 5 + 5}s`,
      };
      return <div key={i} className="star" style={style} />;
    })}
  </div>
);

export default function HeroSection() {
    return (
        <section className="scroll-section flex flex-col items-center justify-center bg-black text-white relative">
            <Starfield />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-black to-black/50 z-10" />
            <div className="relative z-20 flex flex-col items-center text-center p-8">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40 py-4 animate-pulse">
                    NEXUS-ALPHA
                </h1>
                <p className="mt-4 text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
                    Ask, Analyze, and Simulate the Future of the Global Economy.
                </p>
            </div>
            <div className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce z-20">
                <span className="text-sm text-white/50">Scroll to explore</span>
                <ArrowDown className="w-6 h-6 text-white/50" />
            </div>
        </section>
    );
}