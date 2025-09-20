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
            'src/pages/Admin.tsx',
            'src/pages/AdminAnalytics.tsx',
            'src/pages/AdminNotifications.tsx'
          ],
          'admin-forms': [
            'src/pages/AdminUserManagement.tsx',
            'src/pages/AdminAccounting.tsx',
            'src/pages/AdminPayments.tsx'
          ],
          'admin-content': [
            'src/pages/AdminGallery.tsx',
            'src/pages/AdminMagazine.tsx',
            'src/pages/AdminArtisticDirection.tsx'
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
