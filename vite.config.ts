import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],

  build: {
    // Code splitting optimisé
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - Bibliothèques tierces
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'firebase': ['firebase/app', 'firebase/database', 'firebase/auth'],
          'heroicons': ['@heroicons/react/24/outline', '@heroicons/react/24/solid'],

          // Admin chunks - Panneau d'administration
          'admin-core': [
            './src/pages/Admin.tsx',
            './src/components/admin/AdminLayout.tsx',
          ],
          'admin-pages': [
            './src/pages/AdminModels.tsx',
            './src/pages/AdminMagazine.tsx',
            './src/pages/AdminCasting.tsx',
          ],
        },
      },
    },

    // Minification avec Terser
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer console.log en production
        drop_debugger: true, // Supprimer debugger en production
        pure_funcs: ['console.log', 'console.info'], // Supprimer ces fonctions
      },
    },

    // Limite de taille des chunks
    chunkSizeWarningLimit: 500,

    // Optimisation du CSS
    cssCodeSplit: true,

    // Source maps pour le debugging (désactiver en production si non nécessaire)
    sourcemap: false,
  },

  // Optimisation du serveur de développement
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },

  // Optimisation des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
    ],
  },
})
