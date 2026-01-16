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

                {/* Gallery Grid */}
                {sortedItems.length === 0 ? (
                    <FadeIn>
                        <div className="text-center py-20 text-pm-off-white/40 italic bg-white/5 rounded-2xl border border-white/5 mx-auto max-w-2xl">
                            Aucun contenu disponible pour cette catégorie.
                        </div>
                    </FadeIn>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {sortedItems.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={item.id}
                                    className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-pm-gold/30 shadow-lg"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <div className="absolute inset-0 bg-gray-900 pointer-events-none">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                                <PhotoIcon className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <span className="inline-block px-2 py-1 bg-pm-gold/90 text-pm-dark text-xs font-bold uppercase tracking-wider rounded mb-2 w-fit">
                                            {item.category === 'Show' ? 'Défilé' : item.category === 'Video' ? 'Vidéo' : 'Shooting'}
                                        </span>
                                        <h3 className="text-xl font-playfair text-white text-shadow-sm mb-1 line-clamp-2 leading-tight">{item.title}</h3>
                                        <p className="text-xs text-pm-off-white/70 uppercase tracking-widest">{new Date(item.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>

                                        {item.category === 'Video' && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                                <PlayIcon className="w-8 h-8 text-white ml-1" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative max-w-6xl w-full max-h-[95vh] flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute -top-12 right-0 text-white/50 hover:text-pm-gold transition-colors p-2"
                            >
                                <XMarkIcon className="w-10 h-10" />
                            </button>

                            <div className="w-full h-auto max-h-[75vh] overflow-hidden rounded-xl bg-black border border-white/10 shadow-2xl relative flex items-center justify-center">
                                {selectedItem.category === 'Video' && selectedItem.videoUrl ? (
                                    <div className="aspect-video w-full h-full bg-black">
                                        <iframe
                                            src={selectedItem.videoUrl.replace('watch?v=', 'embed/').includes('youtu') ? selectedItem.videoUrl.replace('watch?v=', 'embed/') : selectedItem.videoUrl}
                                            title={selectedItem.title}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    <img src={selectedItem.imageUrl} alt={selectedItem.title} className="max-w-full max-h-full object-contain" />
                                )}
                            </div>

                            <div className="mt-6 w-full text-left bg-white/5 p-6 md:p-8 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                                <div className="flex justify-between items-start flex-col md:flex-row gap-6">
                                    <div>
                                        <h3 className="text-3xl font-playfair text-pm-gold mb-3">{selectedItem.title}</h3>
                                        {selectedItem.description && (
                                            <p className="text-pm-off-white/80 max-w-3xl text-lg font-light leading-relaxed">{selectedItem.description}</p>
                                        )}
                                    </div>
                                    <div className="text-left md:text-right min-w-fit">
                                        <p className="text-xs text-pm-off-white/50 uppercase tracking-widest font-bold mb-1">Date</p>
                                        <p className="text-white mb-4">{new Date(selectedItem.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                                        <p className="text-xs text-pm-off-white/50 uppercase tracking-widest font-bold mb-1">Catégorie</p>
                                        <p className="text-pm-gold font-bold uppercase">{selectedItem.category === 'Show' ? 'Défilé' : selectedItem.category === 'Video' ? 'Clip Vidéo' : 'Shooting'}</p>
                                    </div>
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
