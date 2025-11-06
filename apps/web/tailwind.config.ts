import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#050505',      // Ultra dark matte black
          secondary: '#0D0D0F',    // Card background
          tertiary: '#151518',     // Hover background
        },
        accent: {
          emerald: '#00FF9F',      // Bright emerald (whiter)
          'emerald-dark': '#00D98A', // Dark emerald for hover
          'emerald-glow': '#66FFB2', // Lighter glow
          blue: '#3B82F6',         // Secondary blue
          silver: '#E5E7EB',       // Brighter silver
          cyan: '#00E5FF',         // Legacy cyan
          magenta: '#E6007A',      // Legacy magenta
          green: '#39FF14',        // Legacy green
          red: '#FF1744',          // Legacy red
          yellow: '#FFC107',       // Legacy yellow
        },
        text: {
          primary: '#F3F4F6',      // Bright gray
          secondary: '#9CA3AF',    // Medium gray
          tertiary: '#6B7280',     // Muted gray
        },
        border: {
          primary: '#1A1A1F',      // Darker border
          hover: '#252530',        // Hover border
          glow: '#00FF9F',         // Bright emerald glow
        },
        status: {
          safe: '#00FF9F',         // Safe (bright emerald)
          caution: '#FBBF24',      // Caution (bright yellow)
          danger: '#FF4444',       // Danger (bright red)
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      spacing: {
        'header': '64px',
        'sidebar': '400px',
        'news-feed': '200px',
      },
    },
  },
  plugins: [],
}

export default config
