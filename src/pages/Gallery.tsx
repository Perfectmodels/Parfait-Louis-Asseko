import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { XMarkIcon, PlayIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ParallaxHero from '../components/ui/ParallaxHero';
import FadeIn from '../components/ui/FadeIn';

const Gallery: React.FC = () => {
    const { data, isInitialized } = useData();
    const [filter, setFilter] = useState<'All' | 'Show' | 'Shooting' | 'Video'>('All');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const items = data?.gallery || [];

    const filteredItems = filter === 'All'
        ? items
        : items.filter(item => item.category === filter);

    // Sort by date descending
    const sortedItems = [...filteredItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!isInitialized) {
        return <div className="min-h-screen bg-pm-dark flex items-center justify-center text-pm-gold">Chargement...</div>;
    }

    // Default gallery hero or some nice image
    const heroImage = data?.siteImages?.hero || "https://i.ibb.co/6P0D66b/gallery-hero.jpg";

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO title="Galerie - Perfect Models Management" description="Découvrez nos défilés, shootings et vidéos." />

            <ParallaxHero
                image={heroImage}
                title="Notre Galerie"
                subtitle="Plongez dans l'univers artistique de Perfect Models Management."
                height="h-[60vh]"
            />

            <div className="page-container -mt-20 relative z-20">
                <FadeIn className="text-center mb-12">
                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-4 bg-black/50 p-4 rounded-full backdrop-blur-sm inline-flex border border-white/10">
                        {[
                            { label: 'Tous', value: 'All' },
                            { label: 'Défilés', value: 'Show' },
                            { label: 'Shootings', value: 'Shooting' },
                            { label: 'Vidéos', value: 'Video' }
                        ].map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value as any)}
                                className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${filter === f.value
                                    ? 'bg-pm-gold text-pm-dark shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                    : 'hover:bg-white/10 text-pm-off-white/70 hover:text-white'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </FadeIn>

                {/* Gallery Grid - Masonry Layout */}
                {sortedItems.length === 0 ? (
                    <FadeIn>
                        <div className="text-center py-20 text-pm-off-white/40 italic bg-white/5 rounded-2xl border border-white/5 mx-auto max-w-2xl">
                            Aucun contenu disponible pour cette catégorie.
                        </div>
                    </FadeIn>
                ) : (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                        <AnimatePresence>
                            {sortedItems.map((item, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    key={item.id}
                                    className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-pm-gold/40 shadow-xl transition-all duration-500"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <div className="relative overflow-hidden bg-gray-900">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="aspect-[3/4] w-full flex items-center justify-center text-white/20">
                                                <PhotoIcon className="w-12 h-12" />
                                            </div>
                                        )}

                                        {/* Premium Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <span className="inline-block px-3 py-1 bg-pm-gold/20 text-pm-gold text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-3 border border-pm-gold/30 backdrop-blur-md">
                                                    {item.category === 'Show' ? 'Défilé' : item.category === 'Video' ? 'Vidéo' : 'Shooting'}
                                                </span>
                                                <h3 className="text-xl font-playfair text-white text-shadow-sm mb-1 leading-tight">{item.title}</h3>
                                                <p className="text-[10px] text-pm-off-white/60 uppercase tracking-[0.2em] font-bold">
                                                    {new Date(item.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                                                </p>
                                            </div>

                                            {item.category === 'Video' && (
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-2xl">
                                                    <PlayIcon className="w-8 h-8 text-white ml-1" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence mode="wait">
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-xl"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative max-w-7xl w-full max-h-[98vh] flex flex-col md:flex-row gap-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                title="Fermer"
                                className="absolute -top-12 md:top-0 md:-right-16 text-white/50 hover:text-pm-gold transition-all duration-300 p-2 z-50 bg-white/5 md:bg-transparent rounded-full"
                            >
                                <XMarkIcon className="w-10 h-10" />
                            </button>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="w-full h-auto aspect-video md:aspect-[16/10] overflow-hidden rounded-2xl bg-black/40 border border-white/10 shadow-3xl relative flex items-center justify-center group/main">
                                    {selectedItem.category === 'Video' && selectedItem.videoUrl ? (
                                        <div className="w-full h-full bg-black">
                                            <iframe
                                                src={selectedItem.videoUrl.replace('watch?v=', 'embed/').includes('youtu') ? selectedItem.videoUrl.replace('watch?v=', 'embed/') : selectedItem.videoUrl}
                                                title={selectedItem.title}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ) : (
                                        <motion.img
                                            key={selectedItem.currentImageUrl || selectedItem.imageUrl}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            src={selectedItem.currentImageUrl || selectedItem.imageUrl}
                                            alt={selectedItem.title}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    )}
                                </div>

                                {/* Thumbnails for Additional Images */}
                                {selectedItem.category !== 'Video' && selectedItem.additionalImages && selectedItem.additionalImages.length > 0 && (
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                                        {[selectedItem.imageUrl, ...selectedItem.additionalImages].map((url, idx) => (
                                            <motion.div
                                                key={idx}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`flex-shrink-0 w-24 aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${(selectedItem.currentImageUrl || selectedItem.imageUrl) === url
                                                    ? 'border-pm-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                                    : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                                                    }`}
                                                onClick={() => setSelectedItem({ ...selectedItem, currentImageUrl: url })}
                                            >
                                                <img src={url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Info Side Panel */}
                            <div className="w-full md:w-96 text-left flex flex-col gap-6 h-fit">
                                <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                                    <div className="space-y-2">
                                        <span className="px-3 py-1 bg-pm-gold/20 text-pm-gold border border-pm-gold/30 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                                            {selectedItem.category === 'Show' ? 'Défilé' : selectedItem.category === 'Video' ? 'Clip Vidéo' : 'Shooting'}
                                        </span>
                                        <h3 className="text-4xl font-playfair text-white leading-tight">{selectedItem.title}</h3>
                                    </div>

                                    {selectedItem.description && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-pm-off-white/40 uppercase tracking-widest font-bold">À propos</p>
                                            <p className="text-pm-off-white/70 text-lg font-light leading-relaxed italic border-l-2 border-pm-gold/30 pl-4">
                                                {selectedItem.description}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                                        <div>
                                            <p className="text-[10px] text-pm-off-white/40 uppercase tracking-widest font-black mb-1">Date de l'événement</p>
                                            <p className="text-white font-medium">{new Date(selectedItem.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        {selectedItem.location && (
                                            <div>
                                                <p className="text-[10px] text-pm-off-white/40 uppercase tracking-widest font-black mb-1">Lieu</p>
                                                <p className="text-white font-medium">{selectedItem.location}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-6">
                                        <button
                                            onClick={() => setSelectedItem(null)}
                                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-pm-gold transition-colors duration-500"
                                        >
                                            Fermer la vue
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Gallery Note */}
                                <div className="bg-pm-gold p-6 rounded-2xl text-pm-dark flex items-center gap-4">
                                    <PhotoIcon className="w-8 h-8 opacity-40 shrink-0" />
                                    <p className="text-sm font-bold leading-tight">
                                        Cette galerie contient {selectedItem.additionalImages?.length ? selectedItem.additionalImages.length + 1 : 1} photos exclusives.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
