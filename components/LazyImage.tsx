import React, { useState, useEffect, useRef } from 'react';
import Loading from './Loading';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  threshold?: number;
  className?: string;
  containerClassName?: string;
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjhmOCIgLz4KICA8cGF0aCBkPSJNMzAgNTBINzBNNTAgMzB2NDBNNTAgNzBWNjBNNTAgMzBMMzAgNTBNNTAgMzBsMjAgMjBNNTAgNzBsLTIwLTIwTTUwIDcwbDIwLTIwIiBzdHJva2U9IiNkNGExMjUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==',
  threshold = 0.1,
  className = '',
  containerClassName = '',
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Si le lazy loading n'est pas supporté, charger l'image immédiatement
    if (loading !== 'lazy' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Détacher l'observer une fois que l'image est en vue
          if (observerRef.current && imgRef.current) {
            observerRef.current.unobserve(imgRef.current);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '50px',
      threshold,
    });

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, [loading, threshold]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (onError) onError();
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`} ref={imgRef}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-pm-off-white">
          <Loading size="md" color="gold" />
        </div>
      )}
      
      {/* Image réelle */}
      <img
        {...props}
        src={isInView ? src : placeholderSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${!isLoaded ? 'opacity-0' : 'opacity-100'} ${className}`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default LazyImage;
