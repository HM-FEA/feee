'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Brain, TrendingUp, Globe, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Delayed fade-in for dramatic effect
    setTimeout(() => setIsLoaded(true), 800);

    // Handle scroll for parallax effects
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Minimal Starfield Background - Cylinder Effect */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0A0F] to-black">
          {Array.from({ length: 60 }).map((_, i) => {
            const depth = 0.4 + Math.random() * 0.25; // Limited depth range for cylinder effect
            return (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: (0.5 + Math.random() * 1) * depth + 'px',
                  height: (0.5 + Math.random() * 1) * depth + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  opacity: (Math.random() * 0.5 + 0.2) * depth,
                  transform: `translateY(${scrollY * 0.02 * depth}px)`, // Very minimal parallax
                  transition: 'transform 0.1s ease-out',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Apple-Style Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-white tracking-tight hover:text-accent-cyan transition-colors">
            Nexus-Alpha
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-text-secondary hover:text-white transition-colors font-medium">Features</a>
            <a href="#platform" className="text-text-secondary hover:text-white transition-colors font-medium">Platform</a>
            <a href="#about" className="text-text-secondary hover:text-white transition-colors font-medium">About</a>
            <Link href="/learn" className="text-text-secondary hover:text-white transition-colors font-medium">Learn</Link>
            <Link href="/dashboard" className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-xs font-medium border border-white/10">
              Launch Platform
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Complete Black to Fade In */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div
          className={`text-center max-w-5xl transition-all duration-2000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Small, Clean Typography */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-accent-cyan/70 font-medium">
              AI Economic Ontology Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 text-white tracking-tight leading-[1.1]">
            Economic Intelligence
            <br />
            <span className="font-extralight text-text-secondary">Reimagined</span>
          </h1>

          <p className="text-base md:text-lg text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Institutional-grade financial analysis powered by AI.
            <br className="hidden md:block" />
            From macro variables to asset-level precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="group px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all inline-flex items-center gap-2 text-sm"
            >
              <span>Enter Platform</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/learn"
              className="px-8 py-3 border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-all inline-flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              <span>Explore Docs</span>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div
            className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-1000 delay-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-5 h-8 border border-white/20 rounded-full p-1 flex justify-center">
              <div className="w-1 h-2 bg-accent-cyan rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bloomberg Style */}
      <section id="features" className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-light mb-3 text-white">Platform Capabilities</h2>
            <p className="text-text-secondary text-sm font-light max-w-2xl">
              Comprehensive tools for sophisticated financial analysis across all market sectors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: '4-Level Ontology',
                description: 'Hierarchical framework connecting macro variables to asset-level analysis',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: 'Advanced Simulation',
                description: 'Backtest strategies with 10+ years of historical data',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Trading Arena',
                description: 'Deploy algorithmic trading bots and compete in live tournaments',
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: 'Network Visualization',
                description: 'Interactive 3D graphs revealing systemic risk and liquidity flows',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Risk Intelligence',
                description: 'Real-time ICR monitoring and portfolio stress testing',
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'AI Agents',
                description: 'Fundamental, technical, and sentiment analysis powered by LLMs',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-[#0A0A0F]/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:border-accent-cyan/30 hover:bg-[#0A0A0F]/80 transition-all duration-300"
              >
                <div className="text-accent-cyan mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section - Palantir Style */}
      <section id="platform" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">Built for Professionals</h2>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed font-light">
                Nexus-Alpha combines institutional-grade data infrastructure with cutting-edge AI to deliver
                insights previously only available to hedge funds and investment banks.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  '2,500+ stocks with real-time data',
                  'Sector-specific fundamental equations',
                  'Macro-driven strategy backtesting',
                  'Community of quantitative analysts',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-text-secondary text-sm">
                    <div className="w-1 h-1 bg-accent-cyan rounded-full" />
                    <span className="font-light">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/ontology"
                className="inline-flex items-center gap-2 text-accent-cyan hover:gap-3 transition-all text-sm font-medium"
              >
                <span>Explore the Ontology</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-accent-cyan/10 to-accent-magenta/10 rounded-2xl backdrop-blur-sm border border-white/10 p-12 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl font-extralight text-white mb-4">4</div>
                  <div className="text-lg text-text-secondary font-light mb-8">Ontology Levels</div>
                  <div className="space-y-1.5 text-sm text-text-tertiary font-light">
                    <div>Macro → Sector</div>
                    <div>→ Company → Asset</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History/Timeline Section */}
      <section id="about" className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-white text-center">Vision</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-16 text-center max-w-3xl mx-auto font-light">
            We are building the financial analysis platform of the future—one that democratizes
            access to institutional-grade tools while maintaining the sophistication that
            professionals demand.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-[#0A0A0F]/50 backdrop-blur-sm border border-white/5 rounded-xl p-8">
              <div className="text-5xl font-extralight text-accent-cyan mb-2">14K+</div>
              <div className="text-text-secondary text-sm font-light">Active Users</div>
            </div>
            <div className="bg-[#0A0A0F]/50 backdrop-blur-sm border border-white/5 rounded-xl p-8">
              <div className="text-5xl font-extralight text-accent-magenta mb-2">$52K</div>
              <div className="text-text-secondary text-sm font-light">Monthly Revenue</div>
            </div>
            <div className="bg-[#0A0A0F]/50 backdrop-blur-sm border border-white/5 rounded-xl p-8">
              <div className="text-5xl font-extralight text-accent-emerald mb-2">2.5K</div>
              <div className="text-text-secondary text-sm font-light">Stocks Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">Ready to Begin?</h2>
          <p className="text-text-secondary text-sm mb-12 font-light">
            Join thousands of analysts, traders, and investors using Nexus-Alpha
          </p>
          <Link
            href="/dashboard"
            className="group px-12 py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all inline-flex items-center gap-3 text-base"
          >
            <span>Launch Platform</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-text-tertiary text-xs font-light">
            © 2025 Nexus-Alpha. All rights reserved.
          </div>
          <div className="flex gap-8 text-xs text-text-secondary font-light">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
