import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Créer un chunk séparé pour les dépendances node_modules
          if (id.includes('node_modules')) {
            // Grouper les dépendances par package
            const packageName = id.toString().split('node_modules/')[1].split('/')[0].toString()
            
            // Regrouper les dépendances principales
            if (['react', 'react-dom', 'react-router-dom'].includes(packageName)) {
              return 'vendor-react'
            }
            if (['framer-motion'].includes(packageName)) {
              return 'vendor-framer'
            }
            if (['@heroicons'].includes(packageName)) {
              return 'vendor-icons'
            }
            
            // Toutes les autres dépendances dans un chunk vendor commun
            return 'vendor-other'
          }
          
          // Créer des chunks pour les pages
          if (id.includes('pages/')) {
            const page = id.split('pages/')[1].split('/')[0]
            if (page) {
              return `page-${page}`
            }
          }
          
          // Créer un chunk pour les composants partagés
          if (id.includes('components/')) {
            return 'shared-components'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 1000, // Augmenter la limite d'avertissement à 1000KB
    sourcemap: process.env.NODE_ENV !== 'production', // Activer les source maps en développement
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production', // Supprimer les console.log en production
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    host: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
  },
})
