/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pm-dark': '#0b0b0d',
        'pm-dark-2': '#111114',
        'pm-gray': '#16161a',
        'pm-gold': '#D4AF37',
        'pm-gold-light': '#F5E6A8',
        'pm-gold-dark': '#A67C24',
        'pm-off-white': '#f4f1ea',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.45em',
      },
      boxShadow: {
        'gold-glow': '0 0 40px rgba(212, 175, 55, 0.18)',
        'gold-glow-lg': '0 10px 60px rgba(212, 175, 55, 0.28)',
        'premium': '0 30px 80px -20px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'gold-shine': 'linear-gradient(110deg, #A67C24 0%, #D4AF37 28%, #F5E6A8 50%, #D4AF37 72%, #A67C24 100%)',
        'gold-radial': 'radial-gradient(ellipse at top, rgba(212,175,55,0.10), transparent 60%)',
      },
      animation: {
          'marquee': 'marquee 180s linear infinite',
          'marquee-slow': 'marquee var(--marquee-duration, 30s) linear infinite',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'glow': 'glow 2s ease-in-out infinite',
          'shimmer': 'shimmer 6s linear infinite',
      },
      keyframes: {
          marquee: {
              '0%': { transform: 'translateX(0%)' },
              '100%': { transform: 'translateX(-50%)' },
          },
          fadeIn: {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
          },
          glow: {
            '0%, 100%': { boxShadow: '0 0 5px #D4AF37, 0 0 10px #D4AF37' },
            '50%': { boxShadow: '0 0 20px #D4AF37, 0 0 30px #D4AF37' },
          },
          shimmer: {
            '0%': { backgroundPosition: '200% center' },
            '100%': { backgroundPosition: '-200% center' },
          },
      }
    }
  },
  plugins: [],
}
