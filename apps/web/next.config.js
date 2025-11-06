/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000',
  },

  // Image optimization
  images: {
    domains: ['assets.example.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // API rewrites for proxying backend services
  async rewrites() {
    return [
      {
        source: '/api/quant/:path*',
        destination: `${process.env.QUANT_ENGINE_URL || 'http://localhost:8000'}/api/:path*`,
      },
      {
        source: '/api/trading-agents/:path*',
        destination: `${process.env.TRADING_AGENTS_URL || 'http://localhost:8001'}/api/:path*`,
      },
    ];
  },

  // Vercel deployment settings
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
