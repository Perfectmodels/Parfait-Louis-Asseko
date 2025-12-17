/**
 * LazyImage Component
 * 
 * Composant d'image avec lazy loading optimisé
 * Utilise IntersectionObserver pour charger les images uniquement quand elles sont visibles
 * 
 * Fonctionnalités:
 * - Lazy loading natif
 * - Placeholder pendant le chargement
 * - Transition fluide à l'apparition
 * - Support WebP avec fallback
 * - Intersection Observer pour performance optimale
 * 
 * @author Perfect Models Management
 * @version 1.0
 */

import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    /**
     * URL de l'image à charger
     */
    src: string;

    /**
     * Texte alternatif pour l'accessibilité
     */
    alt: string;

    /**
     * Classes CSS additionnelles
     */
    className?: string;

    /**
     * Image placeholder (base64 ou SVG)
     * Par défaut: rectangle gris
     */
    placeholder?: string;

    /**
     * Activer le support WebP automatique
     * @default true
     */
    useWebP?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23222" width="400" height="300"/%3E%3C/svg%3E',
    useWebP = true
}) => {
    const [imageSrc, setImageSrc] = useState(placeholder);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    /**
     * Convertir le src en WebP si disponible
     */
    const getWebPSrc = (originalSrc: string): string => {
        if (!useWebP) return originalSrc;
        return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    };

    /**
     * IntersectionObserver pour lazy loading
     */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Charger l'image quand elle entre dans le viewport
                        setImageSrc(src);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Charger 50px avant d'être visible
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [src]);

    /**
     * Gérer les erreurs de chargement
     */
    const handleError = () => {
        setHasError(true);
        // Fallback vers l'image originale si WebP échoue
        if (useWebP && imageSrc.endsWith('.webp')) {
            setImageSrc(src);
        }
    };

    /**
     * Gérer le chargement réussi
     */
    const handleLoad = () => {
        setIsLoaded(true);
    };

    return (
        <picture>
            {/* Source WebP si activé */}
            {useWebP && !hasError && (
                <source srcSet={getWebPSrc(src)} type="image/webp" />
            )}

            {/* Image avec fallback */}
            <img
                ref={imgRef}
                src={imageSrc}
                alt={alt}
                className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${className}`}
                onLoad={handleLoad}
                onError={handleError}
                loading="lazy"
                decoding="async"
            />
        </picture>
    );
};

export default LazyImage;
