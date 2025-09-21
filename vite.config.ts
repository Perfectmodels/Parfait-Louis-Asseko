import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "bundle-analysis.html", 
    }),
  ],
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
    exclude: ['@vite/client', '@vite/env'],
    force: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - séparer les grosses dépendances
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            if (id.includes('framer-motion') || id.includes('@heroicons')) {
              return 'ui';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('html2canvas')) {
              return 'html2canvas';
            }
            if (id.includes('jspdf')) {
              return 'jspdf';
            }
            if (id.includes('dompurify')) {
              return 'dompurify';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'chartjs';
            }
            if (id.includes('@fullcalendar')) {
                return 'fullcalendar';
            }
            if (id.includes('react-quill')) {
                return 'react-quill';
            }
            // Autres dépendances node_modules
            return 'vendor';
          }
          
          // Admin chunks - diviser en plus petits chunks
          if (id.includes('src/pages/admin/')) {
            if (id.includes('Admin.tsx') || id.includes('AdminAnalytics.tsx') || id.includes('AdminNotifications.tsx')) {
              return 'admin-core';
            }
            if (id.includes('AdminUserManagement.tsx') || id.includes('AdminAccounting.tsx') || id.includes('AdminPayments.tsx')) {
              return 'admin-forms';
            }
            if (id.includes('AdminGallery.tsx') || id.includes('AdminMagazine.tsx') || id.includes('AdminArtisticDirection.tsx')) {
              return 'admin-content';
            }
            if (id.includes('AdminModels.tsx') || id.includes('AdminCasting.tsx') || id.includes('AdminFashionDay.tsx')) {
              return 'admin-models';
            }
            if (id.includes('AdminSettings.tsx') || id.includes('AdminTeam.tsx') || id.includes('AdminServer.tsx')) {
              return 'admin-settings';
            }
            // Autres pages admin
            return 'admin-other';
          }
          
          // Services chunks
          if (id.includes('src/services/')) {
            return 'services';
          }
          
          // Components chunks
          if (id.includes('src/components/')) {
            if (id.includes('Enhanced') || id.includes('ModelCard') || id.includes('ServiceCard')) {
              return 'components-enhanced';
            }
            if (id.includes('Admin') || id.includes('Loading') || id.includes('Error')) {
              return 'components-admin';
            }
            return 'components';
          }
          
          // Public pages chunks
          if (id.includes('src/pages/') && !id.includes('admin/')) {
            if (id.includes('Home.tsx') || id.includes('Models.tsx') || id.includes('Services.tsx')) {
              return 'public-main';
            }
            if (id.includes('Contact.tsx') || id.includes('FashionDayApplicationForm.tsx') || id.includes('CastingForm.tsx')) {
              return 'public-forms';
            }
            if (id.includes('Gallery.tsx') || id.includes('Magazine.tsx') || id.includes('Agency.tsx')) {
              return 'public-content';
            }
            return 'public-other';
          }
          
          // Hooks et utils
          if (id.includes('src/hooks/') || id.includes('src/utils/')) {
            return 'hooks-utils';
          }
          
          // Types et constants
          if (id.includes('src/types.ts') || id.includes('src/constants/')) {
            return 'types-constants';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
