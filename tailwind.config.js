/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pm-dark': '#1a1a1a',
        'pm-gold': '#D4AF37',
        'pm-off-white': '#f0f0f0',
        'pm-gold-light': '#E6C547',
        'pm-gold-dark': '#B8941F',
        'pm-dark-light': '#2a2a2a',
        'pm-dark-lighter': '#3a3a3a',
        'pm-accent': '#FF6B6B',
        'pm-success': '#4ECDC4',
        'pm-warning': '#FFE66D',
        'pm-info': '#4A90E2',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
      animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'float': 'float 6s ease-in-out infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
          'shimmer': 'shimmer 2s infinite',
          'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
          'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
          'fade-in-left': 'fadeInLeft 0.6s ease-out forwards',
          'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
      },
      keyframes: {
          fadeIn: {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
          },
          float: {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
          },
          glow: {
              'from': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' },
              'to': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)' },
          },
          shimmer: {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' },
          },
          'pulse-glow': {
              '0%, 100%': { opacity: '1', transform: 'scale(1)' },
              '50%': { opacity: '0.8', transform: 'scale(1.05)' },
          },
          fadeInUp: {
              'from': { opacity: '0', transform: 'translateY(30px)' },
              'to': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeInLeft: {
              'from': { opacity: '0', transform: 'translateX(-30px)' },
              'to': { opacity: '1', transform: 'translateX(0)' },
          },
          fadeInRight: {
              'from': { opacity: '0', transform: 'translateX(30px)' },
              'to': { opacity: '1', transform: 'translateX(0)' },
          },
      },
      boxShadow: {
          'gold': '0 10px 40px rgba(212, 175, 55, 0.3)',
          'dark': '0 20px 60px rgba(0, 0, 0, 0.5)',
          'card': '0 8px 32px rgba(0, 0, 0, 0.3)',
          'card-hover': '0 20px 40px rgba(0, 0, 0, 0.4)',
          'glow': '0 0 30px rgba(212, 175, 55, 0.5)',
      },
      backdropBlur: {
          'glass': '10px',
      }
    }
  },
  plugins: [],
}
