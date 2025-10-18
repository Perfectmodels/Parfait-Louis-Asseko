import React, { useEffect, useRef, useState } from 'react';
import { GalleryAlbum } from '../types';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, CalendarIcon, TagIcon, ShareIcon } from '@heroicons/react/24/outline';

interface AlbumModalProps {
  album: GalleryAlbum | null;
  onClose: () => void;
}

const AlbumModal: React.FC<AlbumModalProps> = ({ album, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!album) return;
    setCurrentImageIndex(0);
  }, [album]);

  useEffect(() => {
    if (!album) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [album, currentImageIndex]);

  const goToPrevious = () => {
    if (!album?.images) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? album.images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (!album?.images) return;
    setCurrentImageIndex((prev) => 
      prev === album.images.length - 1 ? 0 : prev + 1
    );
  };

  const shareAlbum = async () => {
    if (!album) return;
    const origin = window.location.origin;
    const shareUrl = `${origin}/api/s/al/${encodeURIComponent(album.id)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: album.title,
          text: album.description || `Découvrez l'album ${album.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Lien de partage copié dans le presse-papiers');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  if (!album) return null;

  const currentImage = album.images[currentImageIndex];
  const hasImages = album.images && album.images.length > 0;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-pm-gold/20 bg-black/50">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl lg:text-2xl font-playfair font-bold text-pm-gold truncate">
            {album.title}
          </h2>
          {album.description && (
            <p className="text-pm-off-white/80 text-sm lg:text-base mt-1 line-clamp-2">
              {album.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-pm-off-white/60">
            {album.category && (
              <span className="inline-flex items-center gap-1">
                <TagIcon className="w-3 h-3" />
                {album.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {new Date(album.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <EyeIcon className="w-3 h-3" />
              {album.images?.length || 0} photos
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={shareAlbum}
            className="p-2 text-pm-off-white hover:text-pm-gold transition-colors"
            aria-label="Partager l'album"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-pm-off-white hover:text-pm-gold transition-colors"
            aria-label="Fermer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Image Display */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative">
          {hasImages ? (
            <>
              <img
                src={currentImage}
                alt={`${album.title} - Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Navigation Arrows */}
              {album.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 text-pm-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-pm-gold/20"
                    aria-label="Image précédente"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 text-pm-gold rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-pm-gold/20"
                    aria-label="Image suivante"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-pm-off-white/60">
              <EyeIcon className="w-16 h-16 mx-auto mb-4 text-pm-gold/50" />
              <p>Aucune image dans cet album</p>
            </div>
          )}
        </div>

        {/* Thumbnails Sidebar */}
        {hasImages && album.images.length > 1 && (
          <div className="w-full lg:w-48 xl:w-64 bg-black/30 border-l border-pm-gold/20 p-4 overflow-y-auto">
            <h3 className="text-sm font-bold text-pm-gold mb-4 uppercase tracking-wider">
              Photos ({album.images.length})
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {album.images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'border-pm-gold shadow-lg shadow-pm-gold/20'
                      : 'border-pm-gold/20 hover:border-pm-gold/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${album.title} - Miniature ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {index === currentImageIndex && (
                    <div className="absolute inset-0 bg-pm-gold/20 flex items-center justify-center">
                      <EyeIcon className="w-6 h-6 text-pm-gold" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Counter */}
      {hasImages && album.images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-pm-off-white text-sm px-4 py-2 rounded-full border border-pm-gold/20">
          {currentImageIndex + 1} / {album.images.length}
        </div>
      )}
    </div>
  );
};

export default AlbumModal;