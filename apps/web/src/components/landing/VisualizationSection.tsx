"use client";

import React from 'react';

export default function VisualizationSection() {
    return (
        <section className="scroll-section flex items-center justify-center bg-black">
            <div className="text-center max-w-5xl mx-auto p-8">
                <h2 className="text-5xl font-bold text-white/90 mb-4">Visualize the Connections</h2>
                <p className="text-lg text-white/60 mb-12">Our interactive graphs and charts reveal the hidden relationships and risk propagation paths in the economy.</p>
                <div className="w-full h-96 bg-white/5 border border-white/10 rounded-xl backdrop-blur-lg flex items-center justify-center">
                    <svg width="80%" height="80%" viewBox="0 0 400 200" className="opacity-50">
                        <defs><linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#00E5FF" /><stop offset="100%" stopColor="#E6007A" /></linearGradient></defs>
                        <circle cx="50" cy="100" r="10" fill="#00E5FF"><animate attributeName="r" values="10;12;10" dur="2s" repeatCount="indefinite" /></circle>
                        <circle cx="150" cy="50" r="8" fill="#E6007A" />
                        <circle cx="180" cy="150" r="7" fill="#39FF14" />
                        <circle cx="250" cy="100" r="9" fill="#FFC107" />
                        <circle cx="350" cy="100" r="10" fill="#00E5FF"><animate attributeName="r" values="10;12;10" dur="2s" begin="1s" repeatCount="indefinite" /></circle>
                        <line x1="50" y1="100" x2="150" y2="50" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5 5"><animate attributeName="stroke-dashoffset" values="0;10" dur="1s" repeatCount="indefinite" /></line>
                        <line x1="50" y1="100" x2="180" y2="150" stroke="url(#line-gradient)" strokeWidth="1" />
                        <line x1="150" y1="50" x2="250" y2="100" stroke="url(#line-gradient)" strokeWidth="1" />
                        <line x1="180" y1="150" x2="250" y2="100" stroke="url(#line-gradient)" strokeWidth="1" />
                        <line x1="250" y1="100" x2="350" y2="100" stroke="url(#line-gradient)" strokeWidth="1" strokeDasharray="5 5"><animate attributeName="stroke-dashoffset" values="10;0" dur="1s" repeatCount="indefinite" /></line>
                    </svg>
                </div>
            </div>
        </section>
    );
}