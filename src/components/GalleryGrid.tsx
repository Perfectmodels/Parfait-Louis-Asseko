import React from 'react';
import { GalleryAlbum } from '../types';
import { EyeIcon, CalendarIcon, TagIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface GalleryGridProps {
  albums: GalleryAlbum[];
  onAlbumClick: (album: GalleryAlbum) => void;
  selectedCategory?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ albums, onAlbumClick, selectedCategory }) => {
  const filteredAlbums = selectedCategory 
    ? albums.filter(album => album.category === selectedCategory)
    : albums;

  if (filteredAlbums.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 bg-pm-gold/10 rounded-full flex items-center justify-center">
          <PhotoIcon className="w-12 h-12 text-pm-gold/50" />
        </div>
        <h3 className="text-xl font-playfair text-pm-gold mb-2">
          {selectedCategory ? `Aucun album dans la catégorie "${selectedCategory}"` : 'Aucun album disponible'}
        </h3>
        <p className="text-pm-off-white/60">
          {selectedCategory ? 'Essayez une autre catégorie.' : 'Les albums photos seront bientôt disponibles.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {filteredAlbums.map((album) => (
        <a
          key={album.id}
          className="group cursor-pointer"
          href={`/galerie/albums/${album.id}`}
          onClick={(e) => { e.preventDefault(); onAlbumClick(album); }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black border border-pm-gold/20 group-hover:border-pm-gold transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-pm-gold/20">
            {/* Album Cover */}
            {album.coverUrl ? (
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : album.images && album.images.length > 0 ? (
              <img
                src={album.images[0]}
                alt={album.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 flex items-center justify-center">
                <PhotoIcon className="w-12 h-12 text-pm-gold/50" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Hover Content */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-4 bg-pm-gold/20 rounded-full flex items-center justify-center">
                  <EyeIcon className="w-8 h-8 text-pm-gold" />
                </div>
                <p className="text-sm font-bold uppercase tracking-wider">Voir l'album</p>
              </div>
            </div>
            
            {/* Image Count Badge */}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-pm-off-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <PhotoIcon className="w-3 h-3" />
              {album.images?.length || 0}
            </div>
          </div>
          
          {/* Album Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {album.category && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs font-bold uppercase tracking-wider rounded-full">
                  <TagIcon className="w-3 h-3" />
                  {album.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-pm-off-white/60 text-xs">
                <CalendarIcon className="w-3 h-3" />
                {new Date(album.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
            
            <h3 className="text-lg font-playfair font-bold text-pm-off-white group-hover:text-pm-gold transition-colors duration-300 line-clamp-2">
              {album.title}
            </h3>
            
            {album.description && (
              <p className="text-pm-off-white/70 text-sm line-clamp-2">
                {album.description}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

export default GalleryGrid;