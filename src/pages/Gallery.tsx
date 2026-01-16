
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { XMarkIcon, PlayIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

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

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white pt-24 pb-20">
            <SEO title="Galerie - Perfect Models Management" description="Découvrez nos défilés, shootings et vidéos." />

            <div className="container mx-auto px-4">
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pm-gold/5 rounded-full blur-[80px] -z-10"></div>
                    <span className="text-pm-gold uppercase tracking-widest text-sm font-bold block mb-2">Portfolio</span>
                    <h1 className="text-4xl md:text-5xl font-playfair text-white mb-6">Notre Galerie</h1>
                    <p className="max-w-2xl mx-auto text-pm-off-white/60 text-lg">
                        Plongez dans l'univers de Perfect Models à travers nos événements, collaborations artistiques et productions visuelles.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {[
                        { label: 'Tous', value: 'All' },
                        { label: 'Défilés', value: 'Show' },
                        { label: 'Shootings', value: 'Shooting' },
                        { label: 'Vidéos', value: 'Video' }
                    ].map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value as any)}
                            className={`px-6 py-2 rounded-full border border-pm-gold/30 transition-all duration-300 ${filter === f.value
                                    ? 'bg-pm-gold text-pm-dark font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                    : 'hover:bg-pm-gold/10 hover:border-pm-gold text-pm-off-white/80'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {sortedItems.length === 0 ? (
                    <div className="text-center py-20 text-pm-off-white/40 italic">
                        Aucun contenu disponible pour le moment.
                    </div>
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                        <span className="inline-block px-2 py-1 bg-pm-gold/20 backdrop-blur-sm border border-pm-gold/30 text-pm-gold text-xs font-bold uppercase tracking-wider rounded mb-2 w-fit">
                                            {item.category === 'Show' ? 'Défilé' : item.category === 'Video' ? 'Vidéo' : 'Shooting'}
                                        </span>
                                        <h3 className="text-xl font-playfair text-white text-shadow-sm mb-1 line-clamp-2">{item.title}</h3>
                                        <p className="text-sm text-pm-off-white/70">{new Date(item.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>

                                        {item.category === 'Video' && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                                                <PlayIcon className="w-6 h-6 text-white ml-1" />
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute -top-10 -right-4 md:right-0 text-white/70 hover:text-white transition-colors"
                            >
                                <XMarkIcon className="w-8 h-8" />
                            </button>

                            <div className="w-full h-auto max-h-[80vh] overflow-hidden rounded-lg bg-black border border-white/10 shadow-2xl relative">
                                {selectedItem.category === 'Video' && selectedItem.videoUrl ? (
                                    <div className="aspect-video w-full h-full">
                                        <iframe
                                            src={selectedItem.videoUrl.replace('watch?v=', 'embed/').includes('youtu') ? selectedItem.videoUrl.replace('watch?v=', 'embed/') : selectedItem.videoUrl}
                                            title={selectedItem.title}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-contain mx-auto" />
                                )}
                            </div>

                            <div className="mt-6 w-full text-left bg-white/5 p-6 rounded-lg backdrop-blur-md border border-white/5">
                                <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                                    <div>
                                        <h3 className="text-2xl font-playfair text-pm-gold mb-2">{selectedItem.title}</h3>
                                        {selectedItem.description && (
                                            <p className="text-pm-off-white/80 max-w-2xl">{selectedItem.description}</p>
                                        )}
                                    </div>
                                    <div className="text-right sm:text-left min-w-fit">
                                        <p className="text-sm text-pm-off-white/50 uppercase tracking-widest">{new Date(selectedItem.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p className="text-sm font-bold text-pm-gold mt-1 uppercase">{selectedItem.category === 'Show' ? 'Défilé' : selectedItem.category === 'Video' ? 'Clip Vidéo' : 'Shooting'}</p>
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
