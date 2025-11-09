import React from 'react';
import { motion } from 'framer-motion';
import { GalleryAlbum } from '../../types';

interface GalleryGridProps {
  albums: GalleryAlbum[];
  onAlbumClick: (album: GalleryAlbum) => void;
  selectedCategory?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ albums, onAlbumClick, selectedCategory }) => {
  if (!albums.length) {
    return (
      <div className="text-center py-12">
        <p className="text-pm-off-white/60">Aucun album disponible pour le moment</p>
      </div>
    );
  }

  const filteredAlbums = selectedCategory
    ? albums.filter(album => album.category === selectedCategory)
    : albums;

  if (!filteredAlbums.length) {
    return (
      <div className="text-center py-12">
        <p className="text-pm-off-white/60">Aucun album trouvé dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAlbums.map((album) => (
        <motion.div
          key={album.id}
          className="group relative overflow-hidden rounded-lg bg-pm-dark/50 hover:bg-pm-dark/70 transition-colors duration-300 cursor-pointer"
          onClick={() => onAlbumClick(album)}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
            <img
              src={album.coverImage || '/placeholder-album.jpg'}
              alt={album.title}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-album.jpg';
              }}
            />
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-pm-off-white group-hover:text-pm-gold transition-colors">
                {album.title}
              </h3>
              <span className="text-xs bg-pm-gold/20 text-pm-gold px-2 py-1 rounded-full">
                {album.imageCount} photo{album.imageCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            {album.description && (
              <p className="mt-2 text-pm-off-white/70 text-sm line-clamp-2">
                {album.description}
              </p>
            )}
            
            <div className="mt-3 flex justify-between items-center text-xs text-pm-off-white/50">
              {album.category && (
                <span className="inline-flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {album.category}
                </span>
              )}
              <span>{new Date(album.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryGrid;
