/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-pm-gold',
    'bg-pm-gold',
    'border-pm-gold',
    'hover:bg-pm-gold',
    'hover:border-pm-gold',
    'focus:ring-pm-gold',
    'text-pm-dark',
    'bg-pm-dark',
    'text-pm-off-white',
    'bg-pm-off-white',
  ],
  theme: {
    extend: {
      colors: {
        'pm-dark': '#111111',
        'pm-gold': '#D4AF37',
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
      }
    }
  },
  plugins: [],
}
