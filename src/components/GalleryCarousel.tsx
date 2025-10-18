import React, { useState, useEffect } from 'react';
import { GalleryAlbum } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

interface GalleryCarouselProps {
  albums: GalleryAlbum[];
  onAlbumClick: (album: GalleryAlbum) => void;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ albums, onAlbumClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (albums.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % albums.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [albums.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? albums.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % albums.length);
  };

  if (!albums || albums.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-pm-gold/10 rounded-full flex items-center justify-center">
          <EyeIcon className="w-12 h-12 text-pm-gold/50" />
        </div>
        <h3 className="text-xl font-playfair text-pm-gold mb-2">Aucun album disponible</h3>
        <p className="text-pm-off-white/60">Les albums photos seront bientôt disponibles.</p>
      </div>
    );
  }

  const currentAlbum = albums[currentIndex];

  return (
    <div className="relative">
      <div className="relative group cursor-pointer" onClick={() => onAlbumClick(currentAlbum)}>
        {/* Album Cover */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black border border-pm-gold/20 group-hover:border-pm-gold transition-all duration-500">
          {currentAlbum.coverUrl ? (
            <img
              src={currentAlbum.coverUrl}
              alt={currentAlbum.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : currentAlbum.images && currentAlbum.images.length > 0 ? (
            <img
              src={currentAlbum.images[0]}
              alt={currentAlbum.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 flex items-center justify-center">
              <EyeIcon className="w-16 h-16 text-pm-gold/50" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2 mb-2">
              {currentAlbum.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs font-bold uppercase tracking-wider rounded-full">
                  <TagIcon className="w-3 h-3" />
                  {currentAlbum.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/40 text-pm-off-white text-xs font-medium rounded-full">
                <CalendarIcon className="w-3 h-3" />
                {new Date(currentAlbum.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long'
                })}
              </span>
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-playfair font-bold mb-2 group-hover:text-pm-gold transition-colors duration-300">
              {currentAlbum.title}
            </h3>
            
            {currentAlbum.description && (
              <p className="text-pm-off-white/90 text-sm lg:text-base mb-4 line-clamp-2">
                {currentAlbum.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-pm-off-white/70 text-sm">
                <EyeIcon className="w-4 h-4" />
                <span>{currentAlbum.images?.length || 0} photos</span>
              </div>
              
              <div className="flex items-center gap-2 text-pm-gold font-bold text-sm uppercase tracking-wider">
                Voir l'album
                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {albums.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 hover:bg-black/80 text-pm-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-pm-gold/20"
            aria-label="Album précédent"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/60 hover:bg-black/80 text-pm-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-pm-gold/20"
            aria-label="Album suivant"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {albums.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {albums.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-pm-gold'
                  : 'bg-pm-gold/30 hover:bg-pm-gold/50'
              }`}
              aria-label={`Aller à l'album ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryCarousel;