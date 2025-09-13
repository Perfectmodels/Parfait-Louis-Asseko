/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gabon-green': '#009E60',
        'gabon-yellow': '#FCD116',
        'gabon-blue': '#0033A0',
        'pm-dark': '#111111',
        'pm-gold': '#D4AF37',
        'pm-gold-light': '#EACD6D',
        'pm-off-white': '#f0f0f0',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
      animation: {
          'marquee': 'marquee 60s linear infinite',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 1s ease-in-out',
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
          slideUp: {
              '0%': { transform: 'translateY(20px)', opacity: 0 },
              '100%': { transform: 'translateY(0)', opacity: 1 },
          },
      },
      boxShadow: {
        'gold': '0 0 20px 0px rgba(212, 175, 55, 0.5)',
        'gold-lg': '0 0 30px 5px rgba(212, 175, 55, 0.5)',
      }
    }
  },
  plugins: [],
}
