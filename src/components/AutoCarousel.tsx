import React, { useEffect, useRef, useState, useCallback } from 'react';

interface AutoCarouselProps {
  images: string[];
  onImageClick?: (img: string) => void;
  autoPlayMs?: number;
  className?: string;
}

const AutoCarousel: React.FC<AutoCarouselProps> = ({
  images,
  onImageClick,
  autoPlayMs = 2500,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement | undefined;
    if (!child) return;
    container.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      if (paused) return;
      setCurrent((prev) => {
        const next = (prev + 1) % images.length;
        scrollToIndex(next);
        return next;
      });
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [images.length, autoPlayMs, paused, scrollToIndex]);

  useEffect(() => {
    const onResize = () => scrollToIndex(current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [current, scrollToIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={containerRef}
        className="flex overflow-x-auto no-scrollbar gap-2 snap-x snap-mandatory scroll-smooth"
      >
        {images.map((src, idx) => (
          <button
            key={idx}
            className="relative aspect-square flex-shrink-0 w-[120px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[220px] snap-start bg-black border-2 border-transparent hover:border-pm-gold rounded-md overflow-hidden group"
            aria-label={`Voir l'image ${idx + 1}`}
            onClick={() => onImageClick?.(src)}
          >
            <img
              src={src}
              alt={`Fashion - ${idx + 1}`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AutoCarousel;
