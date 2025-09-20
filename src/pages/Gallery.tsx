import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  EyeIcon, 
  CalendarIcon, 
  MapPinIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const Gallery: React.FC = () => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('Tous');
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  const albums = data?.albums || [];

  // Extraire tous les thèmes uniques
  const themes = useMemo(() => {
    const uniqueThemes = [...new Set(albums.map(album => album.theme))];
    return ['Tous', ...uniqueThemes];
  }, [albums]);

  // Filtrer les albums
  const filteredAlbums = useMemo(() => {
    return albums.filter(album => {
      const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           album.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           album.theme.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTheme = selectedTheme === 'Tous' || album.theme === selectedTheme;
      const isPublic = album.isPublic;
      
      return matchesSearch && matchesTheme && isPublic;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [albums, searchTerm, selectedTheme]);

  const selectedAlbumData = albums.find(album => album.id === selectedAlbum);

  if (selectedAlbumData) {
    return (
      <AlbumDetail 
        album={selectedAlbumData} 
        onBack={() => setSelectedAlbum(null)} 
      />
    );
  }

  return (
    <>
      <SEO 
        title="Galerie - Perfect Models Management" 
        description="Découvrez nos shootings photos organisés par thème. Portfolio de nos mannequins et créations artistiques."
        keywords="galerie, shooting, photos, mannequins, mode, Gabon, portfolio"
      />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[50vh] flex items-center justify-center text-center"
        style={{ 
          backgroundImage: data?.siteImages?.galleryHero ? `url(${data.siteImages.galleryHero})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl font-extrabold text-pm-gold mb-4 drop-shadow-lg">Galerie Photos</h1>
          <p className="text-xl text-pm-off-white/90 max-w-2xl mx-auto">
            Découvrez nos créations artistiques et shootings photos organisés par thème. 
            Chaque album raconte une histoire unique de beauté et d'élégance.
          </p>
        </div>
      </div>
      
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6">

          {/* Search and Filters */}
          <div className="bg-black border border-pm-gold/20 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold" />
                <input
                  type="text"
                  placeholder="Rechercher un album, thème ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-pm-dark border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-pm-gold" />
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="px-4 py-3 bg-pm-dark border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                >
                  {themes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* YouTube Gallery Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-pm-gold mb-4">Nos Vidéos</h2>
              <p className="text-pm-off-white/70 text-lg">
                Découvrez nos créations vidéo et nos coulisses de shooting
              </p>
            </div>
            
            {/* YouTube Gallery Widget */}
            <div className="bg-black/50 rounded-lg p-6 border border-pm-gold/20">
              <div className="elfsight-app-5b1c2fd7-c3ca-4e37-be1d-4ff3e82c7788" data-elfsight-app-lazy></div>
            </div>
          </div>

          {/* Albums Grid */}
          {filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlbums.map(album => (
                <AlbumCard 
                  key={album.id} 
                  album={album} 
                  onClick={() => setSelectedAlbum(album.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-pm-gold/10 rounded-full flex items-center justify-center">
                <EyeIcon className="w-12 h-12 text-pm-gold" />
              </div>
              <h3 className="text-xl font-semibold text-pm-off-white mb-2">
                Aucun album trouvé
              </h3>
              <p className="text-pm-off-white/60">
                {searchTerm || selectedTheme !== 'Tous' 
                  ? 'Essayez de modifier vos critères de recherche.' 
                  : 'De nouveaux albums seront bientôt disponibles.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const AlbumCard: React.FC<{ album: any; onClick: () => void }> = ({ album, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden cursor-pointer hover:border-pm-gold/50 transition-all duration-300 group shadow-lg hover:shadow-pm-gold/20"
    >
      <div className="relative h-64 overflow-hidden bg-black/30">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <EyeIcon className="w-12 h-12 text-white" />
        </div>

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-pm-gold text-pm-dark text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
            {album.theme}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-playfair text-white mb-1 truncate group-hover:text-pm-gold transition-colors">
            {album.title}
          </h3>
          <p className="text-sm text-white/80 line-clamp-2">
            {album.description}
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-pm-dark/30">
        <div className="flex items-center justify-between text-sm text-pm-off-white/60">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-pm-gold/70" />
            <span>{new Date(album.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <EyeIcon className="w-4 h-4 text-pm-gold/70" />
            <span>{(album.photos || []).length} photos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlbumDetail: React.FC<{ album: any; onBack: () => void }> = ({ album, onBack }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-pm-gold hover:text-white mb-4 transition-colors"
          >
            ← Retour à la galerie
          </button>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-4xl font-playfair text-pm-gold mb-4">
                {album.title}
              </h1>
              <p className="text-lg text-pm-off-white/80 mb-6">
                {album.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-pm-gold" />
                  <span className="text-pm-off-white/60">Thème:</span>
                  <span className="text-pm-gold">{album.theme}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-pm-gold" />
                  <span className="text-pm-off-white/60">Date:</span>
                  <span>{new Date(album.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                {album.location && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-pm-gold" />
                    <span className="text-pm-off-white/60">Lieu:</span>
                    <span>{album.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <EyeIcon className="w-4 h-4 text-pm-gold" />
                  <span className="text-pm-off-white/60">Photos:</span>
                  <span>{(album.photos || []).length}</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-96">
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full h-64 object-cover rounded-lg border border-pm-gold/20"
              />
            </div>
          </div>
        </div>

        {/* Photos Grid - Masonry Layout */}
        {(album.photos || []).length > 0 ? (
            <div className="masonry-gallery">
                {(album.photos || []).map((photo: any, index: number) => (
                    <div
                        key={photo.id}
                        onClick={() => setSelectedPhotoIndex(index)}
                        className="masonry-item relative cursor-pointer group"
                    >
                        <img
                            src={photo.url}
                            alt={photo.title || `Photo ${index + 1}`}
                            className="w-full h-auto object-cover rounded-lg border border-pm-gold/20 group-hover:border-pm-gold transition-colors"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center">
                            <EyeIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
            </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-pm-off-white/60">Aucune photo dans cet album.</p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {(album.photos || []).length > 0 && (
        <PhotoModal
          photos={album.photos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(-1)}
          onPrevious={() => setSelectedPhotoIndex(Math.max(0, selectedPhotoIndex - 1))}
          onNext={() => setSelectedPhotoIndex(Math.min((album.photos || []).length - 1, selectedPhotoIndex + 1))}
        />
      )}
    </div>
  );
};

const PhotoModal: React.FC<{
  photos: any[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}> = ({ photos, currentIndex, onClose, onPrevious, onNext }) => {
  if (currentIndex < 0 || currentIndex >= (photos || []).length) return null;

  const photo = photos[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          ✕
        </button>
        
        <img
          src={photo.url}
          alt={photo.title || `Photo ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain"
        />
        
        {(photos || []).length > 1 && (
          <>
            <button
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
            >
              ‹
            </button>
            <button
              onClick={onNext}
              disabled={currentIndex === (photos || []).length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
            >
              ›
            </button>
          </>
        )}
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
          <p className="text-sm">
            {currentIndex + 1} / {(photos || []).length}
          </p>
          {photo.title && (
            <p className="text-lg font-semibold">{photo.title}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
