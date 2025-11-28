import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import AlbumCard from '../components/AlbumCard';
import { GalleryAlbum } from '../types';

type CategoryFilter = 'toutes' | 'shooting' | 'défilé' | 'événement' | 'backstage' | 'portrait' | 'autre';

const Gallery: React.FC = () => {
    const { data } = useData();
    const [category, setCategory] = useState<CategoryFilter>('toutes');
    const [searchTerm, setSearchTerm] = useState('');

    const albums = useMemo(() => {
        const allAlbums = data?.galleryAlbums || [];
        
        // Filter by public visibility
        const publicAlbums = allAlbums.filter((album: GalleryAlbum) => album.isPublic);
        
        // Filter by category
        const filteredByCategory = category === 'toutes' 
            ? publicAlbums 
            : publicAlbums.filter((album: GalleryAlbum) => album.category === category);
        
        // Filter by search term
        const filteredBySearch = searchTerm === ''
            ? filteredByCategory
            : filteredByCategory.filter((album: GalleryAlbum) => 
                album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                album.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                album.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                album.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        
        // Sort by date (newest first)
        return filteredBySearch.sort((a: GalleryAlbum, b: GalleryAlbum) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [data?.galleryAlbums, category, searchTerm]);

    const categories: CategoryFilter[] = ['toutes', 'shooting', 'défilé', 'événement', 'backstage', 'portrait', 'autre'];

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO 
                title="Galerie Photos - Perfect Models Management" 
                description="Découvrez nos shootings, défilés et événements à travers notre galerie photo professionnelle."
            />
            
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-playfair text-pm-gold mb-4">Galerie</h1>
                    <p className="text-pm-off-white/70 text-lg max-w-2xl mx-auto">
                        Explorez nos réalisations à travers des shootings, défilés, événements et backstage. 
                        Découvrez le talent et la diversité de nos mannequins.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-2 text-sm font-medium uppercase tracking-wider rounded-full transition-all ${
                                    category === cat
                                        ? 'bg-pm-gold text-pm-dark shadow-lg'
                                        : 'bg-black border border-pm-gold/30 text-pm-gold hover:bg-pm-gold/10'
                                }`}
                            >
                                {cat === 'toutes' ? 'Toutes catégories' : cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Rechercher par titre, description, lieu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-black border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-center mb-8">
                    <p className="text-pm-off-white/60">
                        {albums.length} album{albums.length !== 1 ? 's' : ''} trouvé{albums.length !== 1 ? 's' : ''}
                        {searchTerm && ` pour "${searchTerm}"`}
                        {category !== 'toutes' && ` dans ${category}`}
                    </p>
                </div>

                {/* Gallery Grid */}
                {albums.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {albums.map((album: GalleryAlbum) => (
                            <AlbumCard 
                                key={album.id} 
                                album={album}
                                onClick={() => console.log('Navigate to album:', album.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-pm-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-pm-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-pm-gold mb-2">Aucun album trouvé</h3>
                            <p className="text-pm-off-white/60 mb-6">
                                {searchTerm || category !== 'toutes' 
                                    ? 'Essayez de modifier vos filtres pour voir plus de résultats.'
                                    : 'Notre galerie est en cours de construction. Revenez bientôt !'
                                }
                            </p>
                            {(searchTerm || category !== 'toutes') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setCategory('toutes');
                                    }}
                                    className="px-6 py-2 bg-pm-gold text-pm-dark rounded-full font-medium hover:bg-pm-gold/90 transition-colors"
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Admin Link */}
                <div className="text-center mt-16 pt-8 border-t border-pm-gold/20">
                    <p className="text-pm-off-white/50 text-sm mb-4">
                        Vous êtes photographe ou responsable de contenu ?
                    </p>
                    <Link 
                        to="/admin/gallery"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark rounded-full font-medium hover:bg-pm-gold/90 transition-colors"
                    >
                        Gérer la galerie
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Gallery;
