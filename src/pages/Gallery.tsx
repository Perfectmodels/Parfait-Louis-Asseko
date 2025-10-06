import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MagnifyingGlassIcon, 
    FunnelIcon, 
    EyeIcon, 
    PhotoIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    HeartIcon,
    ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import SEO from '../components/SEO';
import { Album } from '../types';

const Gallery: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

    // Données d'exemple pour les albums
    const albums: Album[] = [
        {
            id: '1',
            title: 'Mannequins Professionnels',
            description: 'Portfolio de nos mannequins les plus talentueux',
            coverImage: 'https://via.placeholder.com/400x600/1a1a1a/D4AF37?text=Model+Portfolio',
            images: [
                'https://via.placeholder.com/400x600/1a1a1a/D4AF37?text=Model+1',
                'https://via.placeholder.com/400x600/1a1a1a/D4AF37?text=Model+2',
                'https://via.placeholder.com/400x600/1a1a1a/D4AF37?text=Model+3',
                'https://via.placeholder.com/400x600/1a1a1a/D4AF37?text=Model+4'
            ],
            category: 'mannequins',
            isPublic: true,
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15'
        },
        {
            id: '2',
            title: 'Perfect Fashion Day 2024',
            description: 'Édition 2024 de notre événement phare',
            coverImage: 'https://via.placeholder.com/500x300/1a1a1a/D4AF37?text=Fashion+Day+2024',
            images: [
                'https://via.placeholder.com/500x300/1a1a1a/D4AF37?text=Fashion+Day+1',
                'https://via.placeholder.com/500x300/1a1a1a/D4AF37?text=Fashion+Day+2',
                'https://via.placeholder.com/500x300/1a1a1a/D4AF37?text=Fashion+Day+3',
                'https://via.placeholder.com/500x300/1a1a1a/D4AF37?text=Fashion+Day+4'
            ],
            category: 'fashion-day',
            isPublic: true,
            createdAt: '2024-02-10',
            updatedAt: '2024-02-10'
        },
        {
            id: '3',
            title: 'Sessions Casting',
            description: 'Moments forts des sessions de casting',
            coverImage: 'https://via.placeholder.com/400x300/1a1a1a/D4AF37?text=Casting+Session',
            images: [
                'https://via.placeholder.com/400x300/1a1a1a/D4AF37?text=Casting+1',
                'https://via.placeholder.com/400x300/1a1a1a/D4AF37?text=Casting+2',
                'https://via.placeholder.com/400x300/1a1a1a/D4AF37?text=Casting+3'
            ],
            category: 'casting',
            isPublic: true,
            createdAt: '2024-01-20',
            updatedAt: '2024-01-20'
        },
        {
            id: '4',
            title: 'Événements Spéciaux',
            description: 'Nos événements et collaborations',
            coverImage: 'https://i.ibb.co/8XqYzKj/event-1.jpg',
            images: [
                'https://i.ibb.co/8XqYzKj/event-1.jpg',
                'https://i.ibb.co/9yZzKj/event-2.jpg',
                'https://i.ibb.co/8XqYzKj/event-3.jpg'
            ],
            category: 'evenements',
            isPublic: true,
            createdAt: '2024-01-25',
            updatedAt: '2024-01-25'
        }
    ];

    const categories = [
        { id: 'all', label: 'Toutes les catégories', count: albums.length },
        { id: 'mannequins', label: 'Mannequins', count: albums.filter(a => a.category === 'mannequins').length },
        { id: 'fashion-day', label: 'Fashion Day', count: albums.filter(a => a.category === 'fashion-day').length },
        { id: 'casting', label: 'Casting', count: albums.filter(a => a.category === 'casting').length },
        { id: 'evenements', label: 'Événements', count: albums.filter(a => a.category === 'evenements').length }
    ];

    const filteredAlbums = useMemo(() => {
        return albums.filter(album => {
            const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                album.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || album.category === selectedCategory;
            return matchesSearch && matchesCategory && album.isPublic;
        });
    }, [searchQuery, selectedCategory, albums]);

    const toggleLike = (imageUrl: string) => {
        setLikedImages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(imageUrl)) {
                newSet.delete(imageUrl);
            } else {
                newSet.add(imageUrl);
            }
            return newSet;
        });
    };

    const openLightbox = (album: Album, imageIndex: number) => {
        setSelectedAlbum(album);
        setCurrentImageIndex(imageIndex);
    };

    const closeLightbox = () => {
        setSelectedAlbum(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        if (selectedAlbum) {
            setCurrentImageIndex(prev => 
                prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedAlbum) {
            setCurrentImageIndex(prev => 
                prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pm-dark to-black">
            <SEO title="Galerie - Perfect Models Management" />
            
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-pm-gold/10 to-transparent">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-playfair text-pm-gold mb-6">
                            Galerie
                        </h1>
                        <p className="text-xl text-pm-off-white/80 max-w-3xl mx-auto">
                            Découvrez nos plus belles créations, nos mannequins talentueux et les moments forts de notre agence.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filtres et Recherche */}
            <section className="py-8 bg-black/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Recherche */}
                        <div className="relative flex-1 max-w-md">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold/70" />
                            <input
                                type="text"
                                placeholder="Rechercher dans la galerie..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            />
                        </div>

                        {/* Catégories */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <FunnelIcon className="w-5 h-5 text-pm-gold" />
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                        selectedCategory === category.id
                                            ? 'bg-pm-gold text-pm-dark'
                                            : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-gold/20 hover:text-pm-gold'
                                    }`}
                                >
                                    {category.label} ({category.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Grille des Albums */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {filteredAlbums.length === 0 ? (
                        <div className="text-center py-16">
                            <PhotoIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                            <h3 className="text-xl font-playfair text-pm-gold mb-2">Aucun album trouvé</h3>
                            <p className="text-pm-off-white/70">Essayez de modifier vos critères de recherche.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredAlbums.map((album, index) => (
                                <motion.div
                                    key={album.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group cursor-pointer"
                                    onClick={() => openLightbox(album, 0)}
                                >
                                    <div className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl overflow-hidden hover:border-pm-gold/40 transition-all duration-300 hover:scale-105">
                                        {/* Image de couverture */}
                                        <div className="relative aspect-square overflow-hidden">
                                            <img
                                                src={album.coverImage}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                                <EyeIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {album.images.length} photos
                                            </div>
                                        </div>

                                        {/* Contenu */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-playfair text-pm-gold mb-2 group-hover:text-white transition-colors duration-300">
                                                {album.title}
                                            </h3>
                                            {album.description && (
                                                <p className="text-pm-off-white/70 text-sm group-hover:text-pm-off-white/90 transition-colors duration-300">
                                                    {album.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedAlbum && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            {/* Bouton fermer */}
                            <button
                                onClick={closeLightbox}
                                className="absolute top-4 right-4 z-10 p-2 text-white hover:text-pm-gold transition-colors duration-200"
                            >
                                <XMarkIcon className="w-8 h-8" />
                            </button>

                            {/* Image principale */}
                            <div className="relative max-w-6xl max-h-full">
                                <img
                                    src={selectedAlbum.images[currentImageIndex]}
                                    alt={`${selectedAlbum.title} - Image ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />

                                {/* Contrôles */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 rounded-full px-6 py-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage();
                                        }}
                                        className="p-2 text-white hover:text-pm-gold transition-colors duration-200"
                                    >
                                        <ChevronLeftIcon className="w-6 h-6" />
                                    </button>

                                    <span className="text-white text-sm font-medium">
                                        {currentImageIndex + 1} / {selectedAlbum.images.length}
                                    </span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                        className="p-2 text-white hover:text-pm-gold transition-colors duration-200"
                                    >
                                        <ChevronRightIcon className="w-6 h-6" />
                                    </button>

                                    <div className="w-px h-6 bg-white/30 mx-2"></div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(selectedAlbum.images[currentImageIndex]);
                                        }}
                                        className="p-2 text-white hover:text-red-400 transition-colors duration-200"
                                    >
                                        {likedImages.has(selectedAlbum.images[currentImageIndex]) ? (
                                            <HeartSolidIcon className="w-6 h-6 text-red-400" />
                                        ) : (
                                            <HeartIcon className="w-6 h-6" />
                                        )}
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Fonctionnalité de partage
                                            navigator.share?.({
                                                title: selectedAlbum.title,
                                                text: `Découvrez cette photo de ${selectedAlbum.title}`,
                                                url: window.location.href
                                            });
                                        }}
                                        className="p-2 text-white hover:text-pm-gold transition-colors duration-200"
                                    >
                                        <ShareIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Miniatures */}
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto">
                                {selectedAlbum.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                            index === currentImageIndex
                                                ? 'border-pm-gold'
                                                : 'border-transparent hover:border-pm-gold/50'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Miniature ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
