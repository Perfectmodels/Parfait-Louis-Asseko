import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Prompt for update (allows us to show "New version available")
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Add other static assets if they exist
      manifest: {
        name: 'Perfect Models Management',
        short_name: 'PMM',
        description: "L'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode et notre vision qui redéfinit l'élégance africaine.",
        theme_color: '#D4AF37',
        background_color: '#111111',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'https://i.ibb.co/fVBxPNTP/T-shirt.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'https://i.ibb.co/fVBxPNTP/T-shirt.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
            {
              src: "https://i.ibb.co/K2wS0Pz/hero-bg.jpg",
              sizes: "1280x720",
              type: "image/jpeg",
              form_factor: "wide",
              label: "Page d'accueil de PMM"
            },
            {
              src: "https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg",
              sizes: "720x1280",
              type: "image/jpeg",
              form_factor: "narrow",
              label: "Portfolio de Mannequin"
            }
        ]
      },
      workbox: {
        // Define runtime caching strategies
        runtimeCaching: [
          {
            // Cache Firebase Database calls (Network First)
            urlPattern: ({ url }) => url.hostname.includes('firebaseio.com'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-data-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache CDN Images (Stale While Revalidate)
            urlPattern: ({ url }) =>
              url.hostname.includes('i.ibb.co') ||
              url.hostname.includes('i.postimg.cc') ||
              /\.(?:png|jpg|jpeg|svg|gif|webp)$/.test(url.pathname),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // Cache Google Fonts (Cache First)
            urlPattern: ({ url }) => url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ],
        // Ensure index.html is cached for navigation fallback
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: true, // Enable PWA in dev mode for testing
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

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
