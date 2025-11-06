"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

export default function CtaSection() {
    return (
        <section className="scroll-section flex flex-col items-center justify-center bg-black text-white relative">
            <Starfield />
            <div className="relative z-20 flex flex-col items-center text-center p-8">
                <h2 className="text-5xl font-bold text-white/90 mb-4">Enter the Platform</h2>
                <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">The simulation is ready. Access the full suite of analysis tools and begin your exploration.</p>
                <Link href="/platform" className="group relative mt-8 inline-flex items-center justify-center overflow-hidden rounded-full px-12 py-4 font-bold text-white transition-all duration-300 focus:outline-none text-xl">
                    <span className="absolute -inset-full top-0 z-0 block h-full w-full -skew-x-12 transform bg-gradient-to-r from-transparent to-accent-cyan opacity-40 group-hover:to-accent-cyan/80 group-hover:skew-x-12" />
                    <span className="relative z-10 flex items-center">
                    Launch Analysis Platform <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </span>
                </Link>
            </div>
        </section>
    );
}
