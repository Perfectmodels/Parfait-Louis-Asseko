import React, { useEffect, useMemo, useRef, useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Gallery: React.FC = () => {
  const { data, isInitialized } = useData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const images: string[] = useMemo(() => {
    const acc = new Set<string>();
    if (!data) return [];

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

    const list = Array.from(acc).filter((u) => typeof u === 'string' && (u as string).length > 4) as string[];
    return list;
  }, [data]);

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
        <SEO title="Galerie" description="Parcourez les images de nos événements, articles et mannequins." image={data.siteImages.fashionDayBg} />
        <div className="container mx-auto px-6">
          <h1 className="page-title">Galerie</h1>
          <p className="page-subtitle">Sélection d'images issues du site, des événements et des portfolios.</p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {images.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(src)}
                className="relative aspect-square overflow-hidden rounded-md bg-black ring-1 ring-pm-gold/10 hover:ring-pm-gold"
                aria-label={`Voir l'image ${idx + 1}`}
              >
                <img src={src} alt={`Galerie ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
            {images.length === 0 && (
              <p className="col-span-full text-center text-pm-off-white/60">Aucune image à afficher.</p>
            )}
          </div>
        </div>
      </div>

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
