/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        'pm-dark': '#111111',
        'pm-gold': '#D4AF37',
        'pm-off-white': '#f0f0f0',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#f0f0f0',
            h2: {
              color: '#D4AF37',
              fontFamily: '"Playfair Display", serif',
            },
            h3: {
              color: '#D4AF37',
              fontFamily: '"Playfair Display", serif',
            },
            strong: {
              color: '#f0f0f0',
            },
            a: {
              color: '#D4AF37',
              '&:hover': {
                color: '#ffffff',
              },
            },
          },
        },
      },
      animation: {
          'marquee': 'marquee 60s linear infinite',
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'fade-up': 'fadeUp 600ms ease-out forwards',
          'fade-down': 'fadeDown 600ms ease-out forwards',
          'fade-left': 'fadeLeft 600ms ease-out forwards',
          'fade-right': 'fadeRight 600ms ease-out forwards',
          'scale-in': 'scaleIn 500ms ease-out forwards',
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
          fadeUp: {
              '0%': { opacity: 0, transform: 'translateY(16px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          fadeDown: {
              '0%': { opacity: 0, transform: 'translateY(-16px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          fadeLeft: {
              '0%': { opacity: 0, transform: 'translateX(16px)' },
              '100%': { opacity: 1, transform: 'translateX(0)' },
          },
          fadeRight: {
              '0%': { opacity: 0, transform: 'translateX(-16px)' },
              '100%': { opacity: 1, transform: 'translateX(0)' },
          },
          scaleIn: {
              '0%': { opacity: 0, transform: 'scale(0.95)' },
              '100%': { opacity: 1, transform: 'scale(1)' },
          },
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
