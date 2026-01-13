
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassIcon, CalendarDaysIcon, MapPinIcon, CameraIcon } from '@heroicons/react/24/outline';
import OptimizedImage from '../components/OptimizedImage';
import { GalleryAlbum, Photo } from '../types';

const Gallery: React.FC = () => {
    const { data } = useData();
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
    const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
    const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch and filter albums
    const filteredAlbums = useMemo(() => {
        if (!data?.galleryAlbums) return [];

        return data.galleryAlbums.filter(album => {
            if (!album.isPublic) return false;

            const matchesCategory = selectedCategory === 'Tous' || album.category === selectedCategory.toLowerCase();
            const matchesSearch =
                album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                album.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                album.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [data, selectedCategory, searchQuery]);

    const categories = ['Tous', 'Shooting', 'Défilé', 'Événement', 'Backstage', 'Portrait', 'Autre'];

    return (
        <div className="bg-pm-dark min-h-screen text-pm-off-white">
            <SEO
                title="Galerie Photo | Perfect Models Management"
                description="Découvrez nos collaborations, défilés de mode, shootings et moments forts en images."
                keywords="galerie photo, mode gabon, défilés, shootings, mannequins, photographie"
            />

            <div className="pt-32 pb-20 px-6 container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-playfair text-pm-gold"
                    >
                        Galerie
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-pm-off-white/70 max-w-2xl mx-auto"
                    >
                        Plongez dans l'univers visuel de Perfect Models. Des podiums aux studios, revivez nos plus beaux moments.
                    </motion.p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-full text-sm uppercase tracking-wider transition-all duration-300 border ${
                                    selectedCategory === cat
                                    ? 'bg-pm-gold text-pm-dark border-pm-gold font-bold shadow-lg shadow-pm-gold/20'
                                    : 'bg-transparent text-pm-off-white/60 border-pm-off-white/10 hover:border-pm-gold/50 hover:text-pm-gold'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pm-off-white/40" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/30 border border-pm-off-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-pm-gold/50 transition-colors placeholder-pm-off-white/30"
                        />
                    </div>
                </div>

                {/* Gallery Grid */}
                {selectedAlbum ? (
                    // Album View
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <button
                            onClick={() => setSelectedAlbum(null)}
                            className="mb-8 flex items-center gap-2 text-pm-gold hover:underline group"
                        >
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour aux albums
                        </button>

                        <div className="mb-10 border-b border-pm-gold/10 pb-8">
                            <h2 className="text-4xl font-playfair text-pm-gold mb-4">{selectedAlbum.title}</h2>
                            <p className="text-pm-off-white/80 max-w-3xl mb-6">{selectedAlbum.description}</p>
                            <div className="flex flex-wrap gap-6 text-sm text-pm-off-white/50">
                                <div className="flex items-center gap-2">
                                    <CalendarDaysIcon className="w-5 h-5 text-pm-gold" />
                                    {new Date(selectedAlbum.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                {selectedAlbum.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPinIcon className="w-5 h-5 text-pm-gold" />
                                        {selectedAlbum.location}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <CameraIcon className="w-5 h-5 text-pm-gold" />
                                    {selectedAlbum.photos.length} photos
                                </div>
                            </div>
                        </div>

                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {selectedAlbum.photos.map((photo, idx) => (
                                <motion.div
                                    key={photo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="break-inside-avoid group cursor-pointer relative rounded-lg overflow-hidden"
                                    onClick={() => setLightboxPhoto(photo)}
                                >
                                    <OptimizedImage
                                        src={photo.url}
                                        alt={photo.caption}
                                        className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                        <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-pm-gold font-playfair text-lg italic mb-1">{photo.caption}</p>
                                            {photo.photographer && <p className="text-xs text-pm-off-white/70">© {photo.photographer}</p>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    // Albums List
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredAlbums.map(album => (
                                <motion.div
                                    layout
                                    key={album.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ y: -5 }}
                                    className="group cursor-pointer bg-black border border-pm-gold/10 rounded-xl overflow-hidden shadow-lg hover:shadow-pm-gold/20 hover:border-pm-gold/30 transition-all duration-300"
                                    onClick={() => setSelectedAlbum(album)}
                                >
                                    <div className="aspect-[4/3] overflow-hidden relative">
                                        <OptimizedImage
                                            src={album.coverImage}
                                            alt={album.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-pm-gold border border-pm-gold/20">
                                            {album.category}
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-6 pt-20">
                                             <h3 className="text-2xl font-playfair text-white mb-2 group-hover:text-pm-gold transition-colors">{album.title}</h3>
                                             <div className="flex items-center justify-between text-sm text-pm-off-white/70">
                                                <span>{new Date(album.date).getFullYear()}</span>
                                                <span className="flex items-center gap-1">
                                                    <CameraIcon className="w-4 h-4" /> {album.photos.length}
                                                </span>
                                             </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!selectedAlbum && filteredAlbums.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-pm-off-white/50 font-playfair">Aucun album trouvé pour cette catégorie.</p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
                        onClick={() => setLightboxPhoto(null)}
                    >
                        <button className="absolute top-6 right-6 p-2 bg-pm-dark/50 rounded-full text-white hover:bg-pm-gold hover:text-pm-dark transition-colors">
                            <XMarkIcon className="w-8 h-8" />
                        </button>

                        <div
                            className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={lightboxPhoto.url}
                                alt={lightboxPhoto.caption}
                                className="max-w-full max-h-[80vh] object-contain shadow-2xl border border-pm-gold/10 rounded-sm"
                            />
                            <div className="mt-6 text-center">
                                <h3 className="text-2xl font-playfair text-pm-gold">{lightboxPhoto.caption}</h3>
                                {lightboxPhoto.photographer && (
                                    <p className="text-sm text-pm-off-white/60 mt-1">Photographe : {lightboxPhoto.photographer}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
