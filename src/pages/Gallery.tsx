import React, { useEffect, useMemo, useRef, useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { GalleryAlbum } from '../types';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import GalleryCarousel from '../components/gallery/GalleryCarousel';
import GalleryGrid from '../components/gallery/GalleryGrid';
import GalleryFilters from '../components/gallery/GalleryFilters';
import AlbumModal from '../components/gallery/AlbumModal';

const Gallery: React.FC = () => {
  const { data, isInitialized } = useData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  const albums: GalleryAlbum[] = useMemo(() => {
    if (!data?.fashionDayEvents) return [];
    
    // Filtrer par recherche si un terme de recherche est fourni
    let filteredAlbums = [...(data.fashionDayEvents as unknown as GalleryAlbum[])];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredAlbums = filteredAlbums.filter(album => 
        album.title.toLowerCase().includes(query) ||
        (album.description && album.description.toLowerCase().includes(query)) ||
        (album.category && album.category.toLowerCase().includes(query))
      );
    }
    
    // Trier par date de création (du plus récent au plus ancien)
    return filteredAlbums.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data, searchQuery]);

  const categories: string[] = useMemo(() => {
    const cats = new Set<string>();
    albums.forEach(album => {
      if (album.category) cats.add(album.category);
    });
    return Array.from(cats).sort();
  }, [albums]);

  const images: string[] = useMemo(() => {
    const acc = new Set<string>();
    if (!data) return [];

    // Albums curated first (if any album has images)
    if (albums && albums.length > 0) {
      albums.forEach(alb => (alb.images || []).forEach(u => { if (u) acc.add(u); }));
    } else {
      // Site images
      Object.values(data.siteImages || {}).forEach((url) => { if (url) acc.add(url as string); });

      // News
      (data.newsItems || []).forEach((n) => { if (n.imageUrl) acc.add(n.imageUrl); });

      // Articles cover images
      (data.articles || []).forEach((a) => { if (a.imageUrl) acc.add(a.imageUrl); });

      // Models (public first image + portfolio)
      (data.models || [])
        .filter((m) => m.isPublic)
        .forEach((m) => {
          if (m.imageUrl) acc.add(m.imageUrl);
          (m.portfolioImages || []).forEach((u) => { if (u) acc.add(u); });
        });

      // Fashion Day stylists/artists
      (data.fashionDayEvents || []).forEach((ev) => {
        (ev.stylists || []).forEach((s) => (s.images || []).forEach((u) => { if (u) acc.add(u); }));
        (ev.artists || []).forEach((a) => (a.images || []).forEach((u) => { if (u) acc.add(u); }));
      });
    }

    const list = Array.from(acc).filter((u) => typeof u === 'string' && (u as string).length > 4) as string[];
    return list;
  }, [data, albums]);

  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedImage(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedImage]);

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"/>;
  }

  return (
    <>
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <SEO title="Galerie" description="Découvrez nos albums photos d'événements, shootings et collaborations." image={data.siteImages.fashionDayBg} />
        <div className="container mx-auto px-6">
          <h1 className="page-title">Galerie</h1>
          <p className="page-subtitle">Découvrez nos albums photos d'événements, shootings et collaborations.</p>

          {/* Albums Section */}
          {albums.length > 0 && (
            <div className="mt-16">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-pm-gold mb-4 lg:mb-0">
                  Albums Photos
                </h2>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-pm-off-white/80 text-sm">
                    <span>Vue :</span>
                    <button
                      onClick={() => setViewMode('carousel')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        viewMode === 'carousel'
                          ? 'bg-pm-gold text-pm-dark'
                          : 'bg-pm-gold/20 text-pm-gold hover:bg-pm-gold/30'
                      }`}
                    >
                      Carrousel
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        viewMode === 'grid'
                          ? 'bg-pm-gold text-pm-dark'
                          : 'bg-pm-gold/20 text-pm-gold hover:bg-pm-gold/30'
                      }`}
                    >
                      Grille
                    </button>
                  </div>
                </div>
              </div>

              <GalleryFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onClearFilters={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                }}
              />

              {viewMode === 'carousel' ? (
                <GalleryCarousel
                  albums={albums}
                  onAlbumClick={setSelectedAlbum}
                  selectedCategory={selectedCategory || undefined}
                />
              ) : (
                <GalleryGrid
                  albums={albums}
                  onAlbumClick={setSelectedAlbum}
                  selectedCategory={selectedCategory || undefined}
                />
              )}
            </div>
          )}

          {/* Legacy Images Section */}
          {images.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-pm-gold mb-8">
                Toutes les Images
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(src)}
                    className="relative aspect-square overflow-hidden rounded-md bg-black ring-1 ring-pm-gold/10 hover:ring-pm-gold transition-all duration-300 hover:scale-105"
                    aria-label={`Voir l'image ${idx + 1}`}
                  >
                    <img src={src} alt={`Galerie ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {albums.length === 0 && images.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-pm-gold/10 rounded-full flex items-center justify-center">
                <PhotoIcon className="w-12 h-12 text-pm-gold/50" />
              </div>
              <h3 className="text-xl font-playfair text-pm-gold mb-2">Aucune image disponible</h3>
              <p className="text-pm-off-white/60">Les albums et images seront bientôt disponibles.</p>
            </div>
          )}
        </div>
      </div>

      {/* Album Modal */}
      <AlbumModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />

      {/* Legacy Image Modal */}
      {selectedImage && (
        <div
          ref={modalRef}
          tabIndex={-1}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vue agrandie de l'image"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-pm-gold transition-colors z-10"
            aria-label="Fermer"
            onClick={() => setSelectedImage(null)}
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          <div className="relative max-w-6xl max-h-[90vh] cursor-default" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Vue agrandie" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-pm-gold/20" />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
