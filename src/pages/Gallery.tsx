import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlayIcon, PhotoIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { GalleryAlbum, GalleryCategory, GalleryItem } from '../types';
import { useFirebaseCollection } from '../hooks/useFirebaseCollection';

const CAT_LIST: GalleryCategory[] = [
  'Défilés', 'Shootings Photo', 'Campagnes Publicitaires', 'Fashion Day',
  'Collaborations', 'Entraînements', 'Backstage', 'Lookbook',
  'Événements', 'Presse & Médias', 'Autres',
];

// ── Carrousel horizontal par catégorie ───────────────────────────────────────
const AlbumCarousel: React.FC<{
  category: GalleryCategory;
  items: GalleryItem[];
  onOpen: (item: GalleryItem, items: GalleryItem[]) => void;
}> = ({ category, items, onOpen }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') =>
    trackRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });

  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <span className="w-1 h-6 bg-pm-gold rounded-full" />
          <h2 className="text-sm font-black uppercase tracking-[0.25em] text-white">{category}</h2>
          <span className="text-[10px] font-black text-pm-gold/40 uppercase tracking-widest">
            {items.length} média{items.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => scroll('left')} aria-label="Précédent"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-pm-gold/20 border border-white/10 hover:border-pm-gold/40 flex items-center justify-center transition-all">
            <ChevronLeftIcon className="w-4 h-4 text-white/60" />
          </button>
          <button onClick={() => scroll('right')} aria-label="Suivant"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-pm-gold/20 border border-white/10 hover:border-pm-gold/40 flex items-center justify-center transition-all">
            <ChevronRightIcon className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>
      <div ref={trackRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
        {items.map(item => (
          <motion.div key={item.id}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            onClick={() => onOpen(item, items)}
            className="flex-shrink-0 w-64 sm:w-72 aspect-[4/3] relative cursor-pointer group overflow-hidden rounded-xl snap-start bg-black/40"
          >
            {item.mediaType === 'video' ? (
              <>
                {item.thumbnailUrl
                  ? <img src={item.thumbnailUrl} alt={item.caption ?? ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  : <div className="w-full h-full flex items-center justify-center bg-white/5"><PlayIcon className="w-10 h-10 text-white/20" /></div>}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                  <div className="w-11 h-11 rounded-full bg-pm-gold/90 flex items-center justify-center shadow-lg">
                    <PlayIcon className="w-5 h-5 text-pm-dark ml-0.5" />
                  </div>
                </div>
              </>
            ) : (
              <img src={item.url} alt={item.caption ?? ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            )}
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs leading-snug line-clamp-2">{item.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ── Page principale ───────────────────────────────────────────────────────────
const Gallery: React.FC = () => {
  const { items: allItems, isLoading } = useFirebaseCollection<GalleryItem>('gallery', { orderBy: 'createdAt' });
  const { items: albums } = useFirebaseCollection<GalleryAlbum>('galleryAlbums', { orderBy: 'createdAt' });

  const [activeTab, setActiveTab] = useState<GalleryCategory | 'Tout'>('Tout');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Catégories qui ont au moins un item (fallback sur toutes si pas encore chargé)
  const activeCategories = useMemo(() => {
    if (allItems.length === 0) return CAT_LIST;
    const cats = new Set(allItems.map(i => i.category));
    return CAT_LIST.filter(c => cats.has(c));
  }, [allItems]);

  // Items filtrés par onglet actif
  const filteredItems = useMemo(() => {
    if (activeTab === 'Tout') return allItems;
    return allItems.filter(i => i.category === activeTab);
  }, [allItems, activeTab]);

  // Groupes par catégorie pour les carrousels
  const grouped = useMemo(() => {
    const cats = activeTab === 'Tout' ? activeCategories : [activeTab as GalleryCategory];
    return cats
      .map(cat => ({ cat, items: filteredItems.filter(i => i.category === cat) }))
      .filter(g => g.items.length > 0);
  }, [filteredItems, activeTab, activeCategories]);

  const openLightbox = (item: GalleryItem, items: GalleryItem[]) => {
    const idx = items.findIndex(i => i.id === item.id);
    setLightboxItems(items);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightbox(item);
  };

  const navLightbox = (dir: 'prev' | 'next') => {
    const newIdx = dir === 'next'
      ? (lightboxIndex + 1) % lightboxItems.length
      : (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    setLightboxIndex(newIdx);
    setLightbox(lightboxItems[newIdx]);
  };

  // Trouver le nom de l'album d'un item
  const getAlbumName = (item: GalleryItem) =>
    item.albumId ? albums.find(a => a.id === item.albumId)?.name : undefined;

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white">
      <SEO title="Galerie | Perfect Models Management" description="Découvrez nos prestations, collaborations et entraînements en images et vidéos." />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <span className="section-label">Perfect Models Management</span>
        <h1 className="text-5xl md:text-7xl font-playfair font-black text-white mt-4 mb-4">
          Gale<span className="text-pm-gold">rie</span>
        </h1>
        <p className="text-white/40 text-sm tracking-widest uppercase max-w-md mx-auto">
          Nos moments, nos collaborations, notre univers
        </p>
      </section>

      {/* Tabs filtre */}
      <div className="sticky top-[72px] z-30 bg-pm-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto scrollbar-hide">
          {(['Tout', ...activeCategories] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as GalleryCategory | 'Tout')}
              className={`flex-shrink-0 px-5 py-4 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 -mb-px transition-all whitespace-nowrap ${
                activeTab === tab ? 'border-pm-gold text-pm-gold' : 'border-transparent text-white/30 hover:text-white/60'
              }`}>
              {tab}
              {tab !== 'Tout' && (
                <span className="ml-1.5 text-white/20">
                  {allItems.filter(i => i.category === tab).length}
                </span>
              )}
              {tab === 'Tout' && (
                <span className="ml-1.5 text-white/20">{allItems.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-pm-gold/30 border-t-pm-gold rounded-full animate-spin" />
          </div>
        ) : grouped.length === 0 ? (
          <div className="text-center py-32">
            <PhotoIcon className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/20 text-sm uppercase tracking-widest">Aucun média pour le moment</p>
          </div>
        ) : (
          grouped.map(({ cat, items }) => (
            <AlbumCarousel key={cat} category={cat} items={items} onOpen={openLightbox} />
          ))
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
              onClick={() => setLightbox(null)} aria-label="Fermer">
              <XMarkIcon className="w-8 h-8" />
            </button>

            {lightboxItems.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-pm-gold/30 flex items-center justify-center transition-all z-10"
                onClick={e => { e.stopPropagation(); navLightbox('prev'); }} aria-label="Précédent">
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            )}

            <motion.div
              key={lightbox.id}
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-3"
              onClick={e => e.stopPropagation()}
            >
              {lightbox.mediaType === 'video'
                ? <video src={lightbox.url} controls autoPlay className="max-h-[80vh] w-full rounded-xl object-contain" />
                : <img src={lightbox.url} alt={lightbox.caption ?? ''} className="max-h-[80vh] w-full object-contain rounded-xl" />}
              <div className="flex items-center gap-4 flex-wrap justify-center">
                {lightbox.caption && <p className="text-white/50 text-sm text-center">{lightbox.caption}</p>}
                {getAlbumName(lightbox) && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{getAlbumName(lightbox)}</span>
                )}
                <span className="text-[9px] font-black uppercase tracking-widest text-pm-gold/50">{lightbox.category}</span>
                {lightboxItems.length > 1 && (
                  <span className="text-[9px] text-white/20">{lightboxIndex + 1} / {lightboxItems.length}</span>
                )}
              </div>
            </motion.div>

            {lightboxItems.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-pm-gold/30 flex items-center justify-center transition-all z-10"
                onClick={e => { e.stopPropagation(); navLightbox('next'); }} aria-label="Suivant">
                <ChevronRightIcon className="w-5 h-5 text-white" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
