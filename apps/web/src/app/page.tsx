'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Brain, TrendingUp, Globe, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // Trigger fade-in animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-accent-cyan tracking-tight">Nexus-Alpha</div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-text-secondary hover:text-white transition-colors">Features</a>
            <a href="#platform" className="text-text-secondary hover:text-white transition-colors">Platform</a>
            <a href="#about" className="text-text-secondary hover:text-white transition-colors">About</a>
            <Link href="/dashboard" className="px-4 py-2 bg-accent-cyan text-black rounded-lg hover:bg-accent-cyan/80 transition-all text-sm font-medium">
              Launch Platform
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div
          className={`text-center max-w-4xl transition-all duration-1500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-accent-cyan to-accent-magenta leading-tight">
            Economic Intelligence
            <br />
            Reimagined
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
            AI-powered 4-level ontology platform for institutional-grade financial analysis
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all inline-flex items-center gap-2 text-base"
            >
              <span>Enter Platform</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/learn"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-all inline-flex items-center gap-2 text-base"
            >
              <span>Explore Docs</span>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/20 rounded-full p-1">
              <div className="w-1 h-3 bg-accent-cyan rounded-full mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Platform Features</h2>
            <p className="text-text-secondary text-lg">Comprehensive tools for sophisticated financial analysis</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: '4-Level Ontology',
                description: 'Hierarchical economic framework connecting macro variables to asset-level analysis',
                color: 'cyan'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Advanced Simulation',
                description: 'Backtest strategies with 10+ years of historical data and ML-driven forecasting',
                color: 'magenta'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Trading Arena',
                description: 'Deploy algorithmic trading bots and compete in live tournaments',
                color: 'emerald'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Network Visualization',
                description: 'Interactive 3D graphs revealing systemic risk and liquidity flows',
                color: 'cyan'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Risk Intelligence',
                description: 'Real-time ICR monitoring and portfolio stress testing',
                color: 'magenta'
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'AI Agents',
                description: 'Fundamental, technical, and sentiment analysis powered by LLMs',
                color: 'emerald'
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-8 hover:border-accent-cyan/30 transition-all duration-300"
              >
                <div className={`text-accent-${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section id="platform" className="relative z-10 py-32 px-6 bg-gradient-to-b from-black via-accent-cyan/5 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Built for Professionals</h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Nexus-Alpha combines institutional-grade data infrastructure with cutting-edge AI to deliver
                insights that were previously only available to hedge funds and investment banks.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  '2,500+ stocks with real-time data',
                  'Sector-specific fundamental equations',
                  'Macro-driven strategy backtesting',
                  'Community of quantitative analysts',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/ontology"
                className="inline-flex items-center gap-2 text-accent-cyan hover:gap-4 transition-all"
              >
                <span className="text-sm font-medium">Explore the Ontology</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-accent-cyan/20 to-accent-magenta/20 rounded-3xl backdrop-blur-sm border border-white/10 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-4">4</div>
                  <div className="text-xl text-text-secondary">Ontology Levels</div>
                  <div className="mt-8 space-y-2 text-sm text-text-tertiary">
                    <div>Macro → Sector</div>
                    <div>→ Company → Asset</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Vision</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-12">
            We're building the financial analysis platform of the future—one that democratizes
            access to institutional-grade tools while maintaining the sophistication that
            professionals demand. Our 4-level economic ontology provides a unified framework
            for understanding how macro forces cascade through markets.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent-cyan mb-2">14K+</div>
              <div className="text-text-secondary text-sm">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-magenta mb-2">$52K</div>
              <div className="text-text-secondary text-sm">Monthly Revenue</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-emerald mb-2">2.5K</div>
              <div className="text-text-secondary text-sm">Stocks Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Begin?</h2>
          <p className="text-text-secondary text-lg mb-12">
            Join thousands of analysts, traders, and investors using Nexus-Alpha
          </p>
          <Link
            href="/dashboard"
            className="px-12 py-5 bg-accent-cyan text-black font-bold rounded-lg hover:bg-accent-cyan/80 transition-all inline-flex items-center gap-3 text-lg"
          >
            <span>Launch Platform</span>
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-text-tertiary text-sm">
            © 2025 Nexus-Alpha. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm text-text-secondary">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes subtleFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(2px, 2px); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite, subtleFloat 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
