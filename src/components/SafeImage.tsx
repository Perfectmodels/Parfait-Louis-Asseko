import React, { useState, ImgHTMLAttributes } from 'react';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

/**
 * Composant d'image avec fallback automatique
 * Remplace automatiquement les images cassées par une image par défaut
 */
const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  fallback = '/placeholder-model.svg',
  className,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeImage;

