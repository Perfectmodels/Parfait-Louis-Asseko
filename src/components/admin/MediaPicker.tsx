import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, PhotoIcon, VideoCameraIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { GalleryItem, GalleryCategory } from '../../types';
import { useFirebaseCollection } from '../../hooks/useFirebaseCollection';

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  resourceType?: 'image' | 'video' | 'auto';
  title?: string;
}

const CATEGORIES: (GalleryCategory | 'Tout')[] = [
  'Tout', 'Défilés', 'Shootings Photo', 'Campagnes Publicitaires', 'Fashion Day',
  'Collaborations', 'Entraînements', 'Backstage', 'Lookbook',
  'Événements', 'Presse & Médias', 'Autres',
];

const MediaPicker: React.FC<MediaPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  resourceType = 'auto',
  title = 'Bibliothèque de médias'
}) => {
  const { items: gallery, isLoading } = useFirebaseCollection<GalleryItem>('gallery', { orderBy: 'createdAt' });
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'Tout'>('Tout');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const filtered = gallery.filter(item => {
    const matchesCategory = activeCategory === 'Tout' || item.category === activeCategory;
    const matchesType = resourceType === 'auto' || item.mediaType === resourceType;
    const matchesSearch = !search || (item.caption?.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesType && matchesSearch;
  });

  const toggleSelection = (item: GalleryItem) => {
    if (!multiple) {
      onSelect([item.url]);
      onClose();
      return;
    }

    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(item.url)) {
        next.delete(item.url);
      } else {
        next.add(item.url);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onSelect(Array.from(selected));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div className="bg-[#0d0d0d] border border-pm-gold/20 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-pm-dark/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-pm-gold/10 flex items-center justify-center">
              <PhotoIcon className="w-5 h-5 text-pm-gold" />
            </div>
            <div>
              <h2 className="text-base font-playfair font-black text-white">{title}</h2>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">
                {multiple ? `${selected.size} média(s) sélectionné(s)` : 'Sélectionner un média'}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fermer la fenêtre" className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors rounded-full hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  activeCategory === c
                    ? 'bg-pm-gold text-pm-dark border-pm-gold'
                    : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white focus:border-pm-gold/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <span className="loading loading-ring loading-md text-pm-gold" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 opacity-20">
              <PhotoIcon className="w-16 h-16" />
              <p className="text-sm font-black uppercase tracking-widest">Aucun média trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleSelection(item)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${
                    selected.has(item.url) ? 'border-pm-gold scale-[0.98]' : 'border-transparent hover:border-white/20'
                  }`}
                >
                  {item.mediaType === 'video' ? (
                    <div className="w-full h-full bg-pm-dark">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <VideoCameraIcon className="w-8 h-8 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                          <VideoCameraIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                  )}

                  {/* Selection Overlay */}
                  <div className={`absolute inset-0 bg-pm-gold/20 transition-opacity ${selected.has(item.url) ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'}`} />

                  {/* Selected Icon */}
                  {selected.has(item.url) && (
                    <div className="absolute top-2 right-2">
                      <CheckCircleIcon className="w-6 h-6 text-pm-gold fill-pm-dark" />
                    </div>
                  )}

                  {/* Caption Overlay */}
                  {item.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-[10px] text-white truncate">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {multiple && (
          <div className="px-6 py-4 border-t border-white/5 bg-pm-dark/50 flex items-center justify-between">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
              {selected.size} élément(s) sélectionné(s)
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelected(new Set())}
                className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Tout désélectionner
              </button>
              <button
                onClick={handleConfirm}
                disabled={selected.size === 0}
                className="px-8 py-2.5 text-[10px] font-black uppercase tracking-widest bg-pm-gold text-pm-dark rounded-full hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Confirmer la sélection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPicker;
