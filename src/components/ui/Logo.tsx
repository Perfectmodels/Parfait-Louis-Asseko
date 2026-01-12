import React, { useState, useEffect } from 'react';

interface LogoProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ src, alt = "Perfect Models Management", className = "", fallbackClassName = "" }) => {
  const [error, setError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  // Determine if we should show fallback
  const showFallback = !src || error;

  if (showFallback) {
    // Check for footer variant based on className content
    // This assumes the footer passes 'brightness-0 invert' or similar
    const isFooter = className.includes('brightness-0') || className.includes('invert');

    if (isFooter) {
       // Strip image specific classes that might interfere with text
       const containerClass = className
         .replace('brightness-0', '')
         .replace('invert', '')
         .replace('w-auto', 'w-auto px-3');

       return (
         <div className={`flex items-center justify-center border-2 border-white/50 p-2 ${containerClass} ${fallbackClassName}`}>
           <span className="text-white font-playfair font-bold text-2xl tracking-widest whitespace-nowrap">PMM</span>
         </div>
       );
    }

    // Default / Header / Login fallback
    // Should be a circle with PMM inside.
    // We want to preserve the circular shape if 'rounded-full' is present.
    // We enforce aspect-square to ensure it stays circular.

    const containerClass = className.replace('w-auto', 'w-auto aspect-square');

    return (
      <div className={`flex items-center justify-center overflow-hidden ${containerClass} ${fallbackClassName}`}>
        <span className="text-pm-gold font-playfair font-bold text-sm lg:text-base tracking-tighter">PMM</span>
      </div>
    );
  }

  return (
    <img
      src={src!}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default Logo;
