
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import PublicPageLayout from '../components/PublicPageLayout';
import { PhotoIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Gallery: React.FC = () => {
  const { data } = useData();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const albums = useMemo(() => {
    return (data?.albums || []).filter(album => album.isPublic)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data?.albums]);

  const handleSelectAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedAlbumId(null);
  };

  const selectedAlbum = albums.find(album => album.id === selectedAlbumId);

  return (
    <PublicPageLayout
      title="Galerie"
      subtitle="Explorez notre univers visuel à travers des collections de photos uniques, capturant l'essence de notre agence et le talent de nos mannequins."
      heroImage={data?.siteImages.galleryHero}
      pageName="Galerie"
    >
      {selectedAlbum ? (
        <AlbumDetail album={selectedAlbum} onBack={handleBack} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} onSelect={() => handleSelectAlbum(album.id)} />
          ))}
        </div>
      )}
    </PublicPageLayout>
  );
};


const AlbumCard: React.FC<{ album: any; onSelect: () => void; }> = ({ album, onSelect }) => (
    <div onClick={onSelect} className="relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer group shadow-lg">
        <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h3 className="text-2xl font-playfair text-white font-bold group-hover:text-pm-gold transition-colors">{album.title}</h3>
            <p className="text-sm text-pm-off-white/80 mt-1">{album.photos.length} photos</p>
        </div>
    </div>
);

const AlbumDetail: React.FC<{ album: any; onBack: () => void }> = ({ album, onBack }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="inline-flex items-center gap-2 text-pm-gold font-semibold mb-8 group">
                <ChevronLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                Retour à la galerie
            </button>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-playfair text-pm-off-white mb-4">{album.title}</h1>
                <p className="text-lg text-pm-off-white/70 max-w-3xl mx-auto">{album.description}</p>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {album.photos.map((photo: any, index: number) => (
                    <div key={photo.id || index} onClick={() => setSelectedPhoto(index)} className="break-inside-avoid relative rounded-lg overflow-hidden cursor-pointer group">
                        <img src={photo.url} alt={photo.title || `Photo ${index + 1}`} className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <PhotoIcon className="w-10 h-10 text-white" />
                        </div>
                    </div>
                ))}
            </div>

            {selectedPhoto !== null && (
                <Lightbox 
                    photos={album.photos} 
                    currentIndex={selectedPhoto} 
                    onClose={() => setSelectedPhoto(null)} 
                />
            )}
        </div>
    );
};

const Lightbox: React.FC<{ photos: any[], currentIndex: number, onClose: () => void }> = ({ photos, currentIndex, onClose }) => {
    const [index, setIndex] = useState(currentIndex);

    const handleNext = () => setIndex((prev) => (prev + 1) % photos.length);
    const handlePrev = () => setIndex((prev) => (prev - 1 + photos.length) % photos.length);

    const photo = photos[index];

    return (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-10"><XMarkIcon className="w-10 h-10" /></button>
            
            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <button onClick={handlePrev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><ChevronLeftIcon className="w-8 h-8 text-white" /></button>
                
                <img src={photo.url} alt={photo.title || ''} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                
                <button onClick={handleNext} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><ChevronRightIcon className="w-8 h-8 text-white" /></button>

                <div className="absolute bottom-6 text-center text-white">
                    <p className="font-semibold text-lg">{photo.title}</p>
                    <p className="text-sm text-white/70">{index + 1} / {photos.length}</p>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
