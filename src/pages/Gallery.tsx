import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlayIcon, PhotoIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { GalleryCategory, GalleryItem } from '../types';

const CATEGORIES: GalleryCategory[] = [
  'Défilés',
  'Shootings Photo',
  'Campagnes Publicitaires',
  'Fashion Day',
  'Collaborations',
  'Entraînements',
  'Backstage',
  'Lookbook',
  'Événements',
  'Presse & Médias',
  'Autres',
];

const Gallery: React.FC = () => {
  const { data } = useData();
  const [activeTab, setActiveTab] = useState<GalleryCategory | 'Tout'>('Tout');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const items = useMemo(() => {
    const all = data?.gallery ?? [];
    if (activeTab === 'Tout') return all;
    return all.filter(i => i.category === activeTab);
  }, [data?.gallery, activeTab]);

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white">
      <SEO title="Galerie" description="Découvrez nos prestations, collaborations et entraînements en images et vidéos." />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <span className="section-label">Perfect Models Management</span>
        <h1 className="text-5xl md:text-7xl font-playfair font-black text-white mt-4 mb-6">
          Galerie
        </h1>
        <p className="text-white/40 text-sm tracking-widest uppercase max-w-md mx-auto">
          Nos moments, nos collaborations, notre univers
        </p>
      </section>

      {/* Tabs */}
      <div className="sticky top-[72px] z-30 bg-pm-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto scrollbar-hide">
          {(['Tout', ...CATEGORIES] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-5 py-4 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 -mb-px transition-all ${
                activeTab === tab
                  ? 'border-pm-gold text-pm-gold'
                  : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {items.length === 0 ? (
          <div className="text-center py-32">
            <PhotoIcon className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/20 text-sm uppercase tracking-widest">Aucun média pour le moment</p>
          </div>
        ) : (
          <motion.div
            layout
            className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
          >
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-sm"
                  onClick={() => setLightbox(item)}
                >
                  {item.mediaType === 'video' ? (
                    <div className="relative bg-black/40">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.caption ?? ''}
                          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full aspect-video bg-white/5 flex items-center justify-center">
                          <PlayIcon className="w-10 h-10 text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-pm-gold/90 flex items-center justify-center">
                          <PlayIcon className="w-5 h-5 text-pm-dark ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption ?? ''}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  {/* Overlay caption */}
                  {item.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-xs leading-snug">{item.caption}</p>
                    </div>
                  )}
                  {/* Category badge */}
                  <span className="absolute top-2 left-2 text-[8px] font-black uppercase tracking-widest bg-pm-dark/80 text-pm-gold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.category}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
              onClick={() => setLightbox(null)}
              aria-label="Fermer"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              {lightbox.mediaType === 'video' ? (
                <video
                  src={lightbox.url}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-full rounded-sm object-contain"
                />
              ) : (
                <img
                  src={lightbox.url}
                  alt={lightbox.caption ?? ''}
                  className="max-h-[80vh] w-full object-contain rounded-sm"
                />
              )}
              {lightbox.caption && (
                <p className="text-white/50 text-sm text-center">{lightbox.caption}</p>
              )}
              <span className="text-[9px] font-black uppercase tracking-widest text-pm-gold/50">
                {lightbox.category}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
