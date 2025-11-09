import React from 'react';
import { motion } from 'framer-motion';
import { GalleryAlbum } from '../../types';

interface GalleryCarouselProps {
  albums: GalleryAlbum[];
  onAlbumClick: (album: GalleryAlbum) => void;
  selectedCategory?: string;
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ albums, onAlbumClick, selectedCategory }) => {
  // Filtrer les albums par catégorie si une catégorie est sélectionnée
  const filteredAlbums = selectedCategory
    ? albums.filter(album => album.category === selectedCategory)
    : albums;

  // Gérer le cas où il n'y a pas d'albums
  if (!filteredAlbums.length) {
    if (selectedCategory) {
      return (
        <div className="text-center py-12">
          <p className="text-pm-off-white/60">Aucun album trouvé dans la catégorie sélectionnée</p>
        </div>
      );
    }
    return (
      <div className="text-center py-12">
        <p className="text-pm-off-white/60">Aucun album disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-6 pb-6 overflow-x-auto scrollbar-hide">
        {filteredAlbums.map((album) => (
          <motion.div
            key={album.id}
            className="flex-shrink-0 w-64 h-80 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => onAlbumClick(album)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative w-full h-full">
              <img
                src={album.coverImage || '/placeholder-album.jpg'}
                alt={album.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-album.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-end p-4">
                <div>
                  <h3 className="text-white font-medium text-lg">{album.title}</h3>
                  <p className="text-pm-gold/80 text-sm">
                    {album.images?.length || 0} photo{album.images?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GalleryCarousel;
