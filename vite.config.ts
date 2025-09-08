import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Regroupement des dépendances principales
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            // Regroupement des icônes
            if (id.includes('@heroicons') || id.includes('react-icons')) {
              return 'vendor-icons';
            }
            // Regroupement des utilitaires
            if (id.includes('date-fns') || id.includes('react-markdown') || id.includes('syntax-highlighter')) {
              return 'vendor-utils';
            }
            // Autres dépendances node_modules
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
