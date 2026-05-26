import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FAF5E9',
          100: '#F5ECD3',
          200: '#EDD9A7',
          300: '#E4C67B',
          400: '#D4AF37',
          500: '#C9A96E',
          600: '#B8922A',
          700: '#8A6830',
          800: '#5C4520',
          900: '#2E2210',
          DEFAULT: '#C9A96E',
        },
        obsidian: {
          50: '#F2F2F2',
          100: '#E6E6E6',
          200: '#CCCCCC',
          300: '#999999',
          400: '#666666',
          500: '#333333',
          600: '#1A1A1A',
          700: '#111111',
          800: '#0A0A0A',
          900: '#050505',
          DEFAULT: '#0A0A0A',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A96E 0%, #E8D5A3 50%, #C9A96E 100%)',
        'gold-radial': 'radial-gradient(ellipse at center, #C9A96E 0%, #8A6830 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #111111 100%)',
        'hero-overlay': 'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.3) 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'gold-shimmer': 'goldShimmer 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        goldShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 169, 110, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(201, 169, 110, 0)' },
        },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201, 169, 110, 0.3)',
        'gold-lg': '0 0 40px rgba(201, 169, 110, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 40px rgba(201, 169, 110, 0.15)',
      },
      borderColor: {
        'gold-subtle': 'rgba(201, 169, 110, 0.2)',
        'gold-medium': 'rgba(201, 169, 110, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
