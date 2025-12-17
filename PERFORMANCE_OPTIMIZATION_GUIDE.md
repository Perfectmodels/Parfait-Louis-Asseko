# 🚀 Guide d'Optimisation des Performances - Perfect Models Management

## 📊 État Actuel vs Objectifs

### **Métriques Actuelles** (estimées)

- Bundle Size: ~671 kB (210 kB gzipped)
- First Contentful Paint: ~2.5s
- Time to Interactive: ~4s
- Lighthouse Score: ~75

### **Objectifs**

- Bundle Size: < 500 kB (< 150 kB gzipped)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- Lighthouse Score: > 90

---

## 🎯 Plan d'Optimisation en 4 Phases

### **Phase 1 - Quick Wins** (Impact Immédiat)

### **Phase 2 - Images & Assets** (Gain de 40%)

### **Phase 3 - Code Splitting** (Gain de 30%)

### **Phase 4 - Caching & CDN** (Gain de 20%)

---

# 📦 PHASE 1 - QUICK WINS

## 1.1 Optimisation du Bundle Vite

### **vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    // Compression Gzip
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Compression Brotli (meilleur que Gzip)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // Visualiser le bundle
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // Code splitting optimisé
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'firebase': ['firebase/app', 'firebase/database', 'firebase/auth'],
          'icons': ['@heroicons/react/24/outline', '@heroicons/react/24/solid'],
          
          // Feature chunks
          'admin': [
            './src/pages/Admin.tsx',
            './src/pages/AdminModels.tsx',
            './src/pages/AdminMagazine.tsx',
          ],
        },
      },
    },
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer console.log en production
        drop_debugger: true,
      },
    },
    // Chunk size warning
    chunkSizeWarningLimit: 500,
  },
});
```

### **Installation**

```bash
npm install -D rollup-plugin-visualizer vite-plugin-compression
```

---

## 1.2 Lazy Loading des Images

### **Créer un composant LazyImage**

```tsx
// src/components/LazyImage.tsx
import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3C/svg%3E'
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' } // Charger 50px avant d'être visible
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
    />
  );
};

export default LazyImage;
```

---

## 1.3 Optimisation des Imports

### **Avant** ❌

```tsx
import { motion } from 'framer-motion';
import * as Icons from '@heroicons/react/24/outline';
```

### **Après** ✅

```tsx
// Import seulement ce dont vous avez besoin
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/outline';
```

---

## 1.4 Memoization des Composants

### **Utiliser React.memo**

```tsx
// Avant
const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  // ...
};

// Après
const ModelCard: React.FC<ModelCardProps> = React.memo(({ model }) => {
  // ...
});
```

### **Utiliser useMemo et useCallback**

```tsx
const Home: React.FC = () => {
  // Memoize les calculs coûteux
  const filteredModels = useMemo(() => {
    return models.filter(m => m.isPublic).slice(0, 4);
  }, [models]);

  // Memoize les callbacks
  const handleClick = useCallback(() => {
    // ...
  }, [dependencies]);

  return (
    // ...
  );
};
```

---

# 🖼️ PHASE 2 - IMAGES & ASSETS

## 2.1 Conversion en WebP

### **Script de Conversion**

```bash
# Installer sharp
npm install -D sharp

# Créer scripts/convert-to-webp.js
```

```javascript
// scripts/convert-to-webp.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images';
const outputDir = './public/images/webp';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`✅ Converted: ${file}`))
      .catch(err => console.error(`❌ Error: ${file}`, err));
  }
});
```

### **Utilisation**

```bash
node scripts/convert-to-webp.js
```

---

## 2.2 Composant Picture avec Fallback

```tsx
// src/components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, className }) => {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} className={className} loading="lazy" />
    </picture>
  );
};
```

---

## 2.3 Responsive Images

```tsx
<picture>
  <source 
    media="(max-width: 640px)" 
    srcSet="/images/hero-mobile.webp" 
  />
  <source 
    media="(max-width: 1024px)" 
    srcSet="/images/hero-tablet.webp" 
  />
  <img 
    src="/images/hero-desktop.webp" 
    alt="Hero" 
    loading="lazy"
  />
</picture>
```

---

## 2.4 Compression des Images

### **Tailles Recommandées**

```
Hero Images:
- Desktop: 1920x1080 (< 200KB)
- Tablet:  1024x768  (< 100KB)
- Mobile:  640x480   (< 50KB)

Model Cards:
- Desktop: 800x1200  (< 150KB)
- Mobile:  400x600   (< 50KB)

Thumbnails:
- 300x300 (< 30KB)
```

### **Outils de Compression**

```bash
# TinyPNG API
npm install tinify

# ImageOptim (Mac)
# Squoosh (Web)
# https://squoosh.app
```

---

# ⚡ PHASE 3 - CODE SPLITTING

## 3.1 Route-based Code Splitting

### **Déjà Implémenté** ✅

```tsx
// App.tsx
const Home = lazy(() => import('./pages/Home'));
const Models = lazy(() => import('./pages/Models'));
// etc...
```

---

## 3.2 Component-based Code Splitting

```tsx
// Lazy load des composants lourds
const AnalyticsDashboard = lazy(() => 
  import('./components/admin/AnalyticsDashboard')
);

// Utilisation avec Suspense
<Suspense fallback={<Spinner />}>
  <AnalyticsDashboard />
</Suspense>
```

---

## 3.3 Preload des Routes Critiques

```tsx
// Preload au hover
<Link 
  to="/models"
  onMouseEnter={() => import('./pages/Models')}
>
  Nos Mannequins
</Link>
```

---

# 🗄️ PHASE 4 - CACHING & CDN

## 4.1 Service Worker pour le Caching

### **vite-plugin-pwa**

```bash
npm install -D vite-plugin-pwa
```

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
              }
            }
          }
        ]
      }
    })
  ]
});
```

---

## 4.2 Headers de Cache

### **netlify.toml** (si déployé sur Netlify)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=2592000" # 30 jours
```

---

## 4.3 CDN pour les Assets

### **Utiliser un CDN**

```tsx
// Avant
<img src="/images/hero.jpg" />

// Après (avec CDN)
<img src="https://cdn.perfectmodels.cm/images/hero.webp" />
```

### **CDN Recommandés**

- Cloudflare (Gratuit)
- Cloudinary (Images optimisées)
- imgix (Images + transformations)

---

# 📊 MONITORING & ANALYTICS

## 5.1 Google Lighthouse

```bash
# Installer Lighthouse CLI
npm install -g lighthouse

# Analyser
lighthouse https://perfectmodels.cm --view
```

---

## 5.2 Web Vitals

```tsx
// src/utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals() {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}

// Dans main.tsx
import { reportWebVitals } from './utils/webVitals';
reportWebVitals();
```

---

## 5.3 Bundle Analyzer

```bash
# Analyser le bundle
npm run build
npx vite-bundle-visualizer
```

---

# ✅ CHECKLIST D'OPTIMISATION

## Images

- [ ] Convertir en WebP
- [ ] Compresser (< 200KB par image)
- [ ] Lazy loading implémenté
- [ ] Responsive images (srcset)
- [ ] Placeholder pendant le chargement

## Code

- [ ] Code splitting par route
- [ ] Tree shaking activé
- [ ] Minification activée
- [ ] Console.log supprimés en prod
- [ ] React.memo sur composants lourds
- [ ] useMemo/useCallback utilisés

## Fonts

- [ ] Google Fonts optimisées
- [ ] Font-display: swap
- [ ] Subset de caractères
- [ ] Préchargement des fonts critiques

## Caching

- [ ] Service Worker configuré
- [ ] Headers de cache optimisés
- [ ] CDN configuré
- [ ] Compression Gzip/Brotli

## Performance

- [ ] Lighthouse Score > 90
- [ ] FCP < 1.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Bundle < 500KB

---

# 🎯 RÉSULTATS ATTENDUS

## Avant Optimisation

```
Bundle Size:     671 kB (210 kB gzipped)
FCP:            2.5s
LCP:            4.0s
TTI:            4.5s
Lighthouse:     75
```

## Après Optimisation

```
Bundle Size:     450 kB (130 kB gzipped)  ✅ -33%
FCP:            1.2s                      ✅ -52%
LCP:            2.0s                      ✅ -50%
TTI:            2.3s                      ✅ -49%
Lighthouse:     92                        ✅ +23%
```

---

# 🚀 PLAN D'ACTION

## Semaine 1 - Quick Wins

- [ ] Configurer vite.config.ts
- [ ] Installer plugins de compression
- [ ] Optimiser les imports
- [ ] Ajouter React.memo

## Semaine 2 - Images

- [ ] Convertir toutes les images en WebP
- [ ] Compresser les images
- [ ] Implémenter LazyImage
- [ ] Créer responsive images

## Semaine 3 - Code Splitting

- [ ] Analyser le bundle
- [ ] Optimiser les chunks
- [ ] Lazy load composants lourds
- [ ] Preload routes critiques

## Semaine 4 - Caching & Deploy

- [ ] Configurer Service Worker
- [ ] Setup CDN
- [ ] Optimiser headers
- [ ] Tests de performance

---

**Date**: 17 décembre 2025  
**Version**: 1.0  
**Auteur**: Perfect Models Management  
**Objectif**: Lighthouse Score > 90
