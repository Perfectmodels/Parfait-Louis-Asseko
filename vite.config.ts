import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    hmr: {
      port: 5173,
      host: 'localhost',
      clientPort: 5173
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['@heroicons/react/24/outline', '@heroicons/react/24/solid']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    force: true,
    include: ['react', 'react-dom', 'react-router-dom']
  }
});