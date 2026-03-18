import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — always needed first
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Framer Motion — heavy animation lib
          'vendor-motion': ['framer-motion'],

          // Firebase — split by service
          'vendor-firebase-app': ['firebase/app'],
          'vendor-firebase-auth': ['firebase/auth'],
          'vendor-firebase-db': ['firebase/database'],
          'vendor-firebase-messaging': ['firebase/messaging'],

          // @google/genai and html2canvas are loaded dynamically — no manual chunk needed
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
})
