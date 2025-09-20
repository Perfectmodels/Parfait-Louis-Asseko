import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@heroicons/react/24/outline',
      'firebase/app',
      'firebase/database',
      'firebase/auth'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['framer-motion', '@heroicons/react'],
          'firebase': ['firebase/app', 'firebase/database', 'firebase/auth'],
          'utils': ['html2canvas', 'jspdf'],
          'email': ['src/services/emailConfirmationService.ts'],
          
          // Admin chunks
          'admin-core': [
            'src/pages/admin/Admin.tsx',
            'src/pages/admin/AdminAnalytics.tsx',
            'src/pages/admin/AdminNotifications.tsx'
          ],
          'admin-forms': [
            'src/pages/admin/AdminUserManagement.tsx',
            'src/pages/admin/AdminAccounting.tsx',
            'src/pages/admin/AdminPayments.tsx'
          ],
          'admin-content': [
            'src/pages/admin/AdminGallery.tsx',
            'src/pages/admin/AdminMagazine.tsx',
            'src/pages/admin/AdminArtisticDirection.tsx'
          ],
          
          // Public chunks
          'public-forms': [
            'src/pages/Contact.tsx',
            'src/pages/FashionDayApplicationForm.tsx',
            'src/pages/CastingForm.tsx'
          ],
          'public-pages': [
            'src/pages/Home.tsx',
            'src/pages/Models.tsx',
            'src/pages/Services.tsx',
            'src/pages/Gallery.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
