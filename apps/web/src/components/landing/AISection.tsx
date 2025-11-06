"use client";

import React from 'react';
import { BrainCircuit } from 'lucide-react';

export default function AISection() {
    return (
        <section className="scroll-section flex items-center justify-center bg-black">
            <div className="text-center max-w-5xl mx-auto p-8">
                <h2 className="text-5xl font-bold text-white/90 mb-4">Powered by Generative AI</h2>
                <p className="text-lg text-white/60 mb-12">Nexus-Alpha integrates with TradingAgents to provide automated analysis, sentiment detection, and report generation.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="w-full h-full bg-white/5 border border-white/10 rounded-xl backdrop-blur-lg flex flex-col items-center justify-center p-8"><BrainCircuit className="w-24 h-24 text-fuchsia-300 mb-6" /><p className="text-white/80 font-semibold">Automated insights at scale.</p></div>
                    <div className="w-full h-full bg-gray-900/50 border border-white/10 rounded-xl font-mono text-left p-6 text-sm text-white/70 overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                        <p className="animate-pulse">// Generating analysis for AAPL...</p><br />
                        <p><span className="text-cyan-400">const</span> report = await TradingAgents.analyze(&#123;</p>
                        <p className="pl-4">ticker: <span className="text-amber-300">'AAPL'</span>,</p>
                        <p className="pl-4">factors: ['interest_rate', 'consumer_sentiment'],</p>
                        <p>&#125;);</p><br />
                        <p><span className="text-cyan-400">console</span>.log(report.sentiment);</p>
                        <p className="text-lime-400">// Expected output: 'Slightly Bullish'</p>
                    </div>
                </div>
            </div>
        </section>
    );
}