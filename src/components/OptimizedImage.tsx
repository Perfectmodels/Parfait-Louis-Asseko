import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero';
  lazy?: boolean;
  className?: string;
  fallback?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

const imageConfig = {
  baseUrl: 'https://images.perfectmodels.ga',
  sizes: {
    thumbnail: '150x150',
    small: '300x300',
    medium: '600x600',
    large: '1200x1200',
    hero: '1920x1080'
  },
  formats: ['webp', 'jpg', 'png'],
  quality: 85,
  lazy: true
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  size = 'medium',
  lazy = true,
  className = '',
  fallback = 'https://via.placeholder.com/600x600/D4AF37/FFFFFF?text=Image',
  placeholder = 'https://via.placeholder.com/600x600/1a1a1a/666666?text=Loading...',
  onLoad,
  onError,
  priority = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Générer l'URL optimisée
  const getOptimizedUrl = (originalSrc: string, targetSize: string) => {
    // Si c'est déjà une URL optimisée ou une URL externe, la retourner telle quelle
    if (originalSrc.includes('images.perfectmodels.ga') || originalSrc.includes('http')) {
      return originalSrc;
    }
    
    // Pour les images locales, utiliser le système d'optimisation
    const sizeConfig = imageConfig.sizes[size as keyof typeof imageConfig.sizes];
    return `${imageConfig.baseUrl}/${sizeConfig}/${originalSrc}`;
  };

  // Intersection Observer pour le lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy]);

  // Charger l'image quand elle est en vue
  useEffect(() => {
    if (isInView && !loaded && !error) {
      const optimizedSrc = getOptimizedUrl(src, size);
      setCurrentSrc(optimizedSrc);
    }
  }, [isInView, src, size, loaded, error]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setCurrentSrc(fallback);
    onError?.();
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={lazy && !priority ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      
      {/* Placeholder de chargement */}
      <AnimatePresence>
        {!loaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-pm-gold/20 to-pm-gold/10 animate-pulse flex items-center justify-center"
          >
            <div className="w-8 h-8 border-2 border-pm-gold/30 border-t-pm-gold rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur d'erreur */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-pm-gold/10 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-pm-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-pm-gold/50 text-sm">Image non disponible</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptimizedImage;
