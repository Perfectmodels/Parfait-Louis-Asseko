import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { 
    PhotoIcon, 
    CalendarIcon, 
    MapPinIcon,
    FunnelIcon,
    MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { GalleryAlbum } from '../types';

const categoryIcons: Record<string, string> = {
    'défilé': '👗',
    'shooting': '📸',
    'événement': '🎭',
    'casting': '⭐',
    'backstage': '🎬',
    'autre': '📁'
};

const categoryColors: Record<string, string> = {
    'défilé': 'from-purple-500/20 to-pink-500/20',
    'shooting': 'from-blue-500/20 to-cyan-500/20',
    'événement': 'from-yellow-500/20 to-orange-500/20',
    'casting': 'from-green-500/20 to-emerald-500/20',
    'backstage': 'from-red-500/20 to-rose-500/20',
    'autre': 'from-gray-500/20 to-slate-500/20'
};

const Gallery: React.FC = () => {
    const { data } = useData();
    const albums = (data?.galleryAlbums || []).filter((album: GalleryAlbum) => album.isPublic);
    
    const [selectedCategory, setSelectedCategory] = useState<string>('tous');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'tous', label: 'Tous', icon: '🎨' },
        { id: 'défilé', label: 'Défilés', icon: '👗' },
        { id: 'shooting', label: 'Shootings', icon: '📸' },
        { id: 'événement', label: 'Événements', icon: '🎭' },
        { id: 'casting', label: 'Castings', icon: '⭐' },
        { id: 'backstage', label: 'Backstage', icon: '🎬' }
    ];

    const filteredAlbums = useMemo(() => {
        return albums.filter((album: GalleryAlbum) => {
            const matchesCategory = selectedCategory === 'tous' || album.category === selectedCategory;
            const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                album.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (album.location && album.location.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [albums, selectedCategory, searchQuery]);

    return (
        <>
            <SEO 
                title="Galerie"
                description="Découvrez notre galerie photo : défilés, shootings, événements et moments d'exception de Perfect Models Management"
                keywords="galerie, photos, défilés, shooting, mode, mannequins, événements, Perfect Models"
                image={albums[0]?.coverImage}
            />

            <div className="min-h-screen bg-pm-dark">
                {/* Hero Section */}
                <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-pm-dark to-pm-dark"></div>
                    {albums[0]?.coverImage && (
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-20"
                            style={{ backgroundImage: `url(${albums[0].coverImage})` }}
                        ></div>
                    )}
                    
                    <div className="relative z-10 text-center px-6">
                        <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
                            <PhotoIcon className="w-12 h-12 text-pm-gold" />
                            <h1 className="text-6xl md:text-7xl font-playfair font-extrabold text-pm-gold">
                                Galerie
                            </h1>
                        </div>
                        <p className="text-xl md:text-2xl text-pm-off-white/80 max-w-2xl mx-auto leading-relaxed">
                            Explorez nos moments d'exception, défilés prestigieux et shootings créatifs
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-pm-off-white/60">
                            <span className="flex items-center gap-2">
                                <PhotoIcon className="w-5 h-5 text-pm-gold" />
                                {albums.length} {albums.length > 1 ? 'Albums' : 'Album'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-2">
                                📷 {albums.reduce((acc: number, album: GalleryAlbum) => acc + album.photos.length, 0)} Photos
                            </span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-16">
                    {/* Filters */}
                    <div className="mb-12 space-y-6">
                        {/* Search */}
                        <div className="relative max-w-xl mx-auto">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pm-gold" />
                            <input
                                type="text"
                                placeholder="Rechercher un album..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-black border border-pm-gold/20 rounded-full text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/20 transition-all"
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <FunnelIcon className="w-5 h-5 text-pm-gold" />
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`
                                        px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wider
                                        transition-all duration-300 transform hover:scale-105
                                        ${selectedCategory === cat.id
                                            ? 'bg-pm-gold text-black shadow-lg shadow-pm-gold/30'
                                            : 'bg-black border border-pm-gold/20 text-pm-off-white hover:border-pm-gold'
                                        }
                                    `}
                                >
                                    <span className="mr-2">{cat.icon}</span>
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Albums Grid */}
                    {filteredAlbums.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredAlbums.map((album: GalleryAlbum, index: number) => (
                                <Link
                                    key={album.id}
                                    to={`/gallery/${album.id}`}
                                    className="group relative overflow-hidden rounded-2xl bg-black border border-pm-gold/20 hover:border-pm-gold transition-all duration-500 hover:shadow-2xl hover:shadow-pm-gold/20 hover:-translate-y-2"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Cover Image */}
                                    <div className="relative h-72 overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[album.category]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`}></div>
                                        <img
                                            src={album.coverImage}
                                            alt={album.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        
                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4 z-20 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full border border-pm-gold/30 flex items-center gap-2">
                                            <span className="text-lg">{categoryIcons[album.category]}</span>
                                            <span className="text-xs uppercase tracking-wider text-pm-gold font-bold">
                                                {album.category}
                                            </span>
                                        </div>

                                        {/* Photo Count */}
                                        <div className="absolute top-4 right-4 z-20 px-3 py-2 bg-pm-gold/90 backdrop-blur-sm rounded-full flex items-center gap-2">
                                            <PhotoIcon className="w-4 h-4 text-black" />
                                            <span className="text-sm font-bold text-black">
                                                {album.photos.length}
                                            </span>
                                        </div>

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-3">
                                        <h3 className="text-2xl font-playfair font-bold text-pm-gold group-hover:text-pm-off-white transition-colors line-clamp-2">
                                            {album.title}
                                        </h3>
                                        <p className="text-sm text-pm-off-white/70 line-clamp-2 leading-relaxed">
                                            {album.description}
                                        </p>
                                        
                                        <div className="flex items-center gap-4 text-xs text-pm-off-white/60 pt-2">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarIcon className="w-4 h-4 text-pm-gold" />
                                                {new Date(album.date).toLocaleDateString('fr-FR')}
                                            </span>
                                            {album.location && (
                                                <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPinIcon className="w-4 h-4 text-pm-gold" />
                                                        {album.location}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* View Album Button */}
                                        <div className="pt-4">
                                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-pm-gold group-hover:text-pm-off-white transition-colors">
                                                Voir l'album
                                                <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <PhotoIcon className="w-24 h-24 text-pm-off-white/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-playfair text-pm-off-white/60 mb-2">
                                Aucun album trouvé
                            </h3>
                            <p className="text-pm-off-white/40">
                                {searchQuery 
                                    ? 'Essayez une autre recherche' 
                                    : 'Aucun album dans cette catégorie'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Gallery;

