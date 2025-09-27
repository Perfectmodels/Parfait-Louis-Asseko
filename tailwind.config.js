/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Ajout pour Next.js App Router
    "./index.html", // Conservé pour la compatibilité avec Vite
    "./src/**/*.{js,ts,jsx,tsx}", // Conservé pour la compatibilité avec Vite
  ],
  theme: {
    extend: {
      colors: {
        'pm-dark': '#111111',
        'pm-gold': '#D4AF37',
        'pm-off-white': '#f0f0f0',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        'playfair': ['var(--font-playfair)', 'serif'],
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
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
