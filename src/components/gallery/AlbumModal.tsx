import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ShareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryAlbum } from '../../types';

interface AlbumModalProps {
  album: GalleryAlbum | null;
  onClose: () => void;
}

const AlbumModal: React.FC<AlbumModalProps> = ({ album, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (album) {
      setCurrentImageIndex(0);
      setIsLoading(true);
      
      // Précharger les images
      const preloadImages = () => {
        if (!album.images) return;
        
        const imagePromises = album.images.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        });

        Promise.all(imagePromises)
          .then(() => setIsLoading(false))
          .catch(console.error);
      };

      preloadImages();
    }
  }, [album]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!album) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [album, currentImageIndex]);

  if (!album) return null;

  const handleNext = () => {
    if (!album.images) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % album.images!.length);
  };

  const handlePrev = () => {
    if (!album.images) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? album.images!.length - 1 : prevIndex - 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleDownload = () => {
    if (!album?.images?.[currentImageIndex]) return;
    
    const link = document.createElement('a');
    link.href = album.images[currentImageIndex];
    link.download = `${album.title}-${currentImageIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!album) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: album.title,
          text: album.description || 'Découvrez cet album photo',
          url: window.location.href,
        });
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
        await navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers');
      }
    } catch (err) {
      console.error('Erreur lors du partage :', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            className={`relative bg-pm-dark rounded-xl overflow-hidden shadow-2xl w-full max-w-6xl mx-auto ${
              isFullscreen ? 'h-[90vh]' : 'max-h-[90vh]'
            }`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between p-4 border-b border-pm-off-white/10 bg-pm-dark/80 backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-semibold text-pm-off-white">{album.title}</h2>
                {album.description && (
                  <p className="text-sm text-pm-off-white/70 mt-1">{album.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
                  title="Partager"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
                  title="Télécharger"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors hidden md:block"
                  title={isFullscreen ? 'Réduire' : 'Plein écran'}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isFullscreen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    )}
                  </svg>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-pm-off-white/70 hover:text-red-400 transition-colors"
                  title="Fermer"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="flex flex-col h-[calc(100%-56px)]">
              {/* Image principale */}
              <div className="relative flex-1 flex items-center justify-center p-4 bg-black">
                {isLoading ? (
                  <div className="animate-pulse bg-pm-dark/30 w-full h-64 md:h-[60vh] rounded-lg" />
                ) : (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-pm-off-white hover:bg-pm-gold hover:text-pm-dark transition-colors z-10"
                      disabled={isLoading}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>

                    <motion.img
                      key={currentImageIndex}
                      src={album.images?.[currentImageIndex] || ''}
                      alt={`${album.title} - Image ${currentImageIndex + 1}`}
                      className="max-h-[70vh] max-w-full object-contain"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-album.jpg';
                      }}
                    />

                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-pm-off-white hover:bg-pm-gold hover:text-pm-dark transition-colors z-10"
                      disabled={isLoading}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-pm-off-white text-sm px-3 py-1 rounded-full">
                      {currentImageIndex + 1} / {album.images?.length || 0}
                    </div>
                  </>
                )}
              </div>

              {/* Vignettes */}
              {album.images && album.images.length > 1 && (
                <div className="p-2 bg-pm-dark/80 border-t border-pm-off-white/10 overflow-x-auto">
                  <div className="flex gap-2 justify-center">
                    {album.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-pm-gold scale-105'
                            : 'border-transparent hover:border-pm-off-white/30'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Miniature ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-album.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlbumModal;
