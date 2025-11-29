import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../hooks/useNotifications';
import { SEO, AlbumCard, AlbumEditor } from '../components';
import { GalleryAlbum } from '../types';
import { PlusIcon, EyeIcon, EyeSlashIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

type CategoryFilter = 'toutes' | 'shooting' | 'défilé' | 'événement' | 'backstage' | 'portrait' | 'autre';
type StatusFilter = 'toutes' | 'public' | 'privé';

const AdminGallery: React.FC = () => {
    const { data, saveData } = useData();
    const { addNotification } = useNotifications();
    const [category, setCategory] = useState<CategoryFilter>('toutes');
    const [status, setStatus] = useState<StatusFilter>('toutes');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
    const [showEditor, setShowEditor] = useState(false);

    const albums = useMemo(() => {
        const allAlbums = data?.galleryAlbums || [];

        // Filter by status
        const filteredByStatus = status === 'toutes'
            ? allAlbums
            : allAlbums.filter((album: GalleryAlbum) => status === 'public' ? album.isPublic : !album.isPublic);

        // Filter by category
        const filteredByCategory = category === 'toutes'
            ? filteredByStatus
            : filteredByStatus.filter((album: GalleryAlbum) => album.category === category);

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
    }, [data?.galleryAlbums, category, status, searchTerm]);

    const statistics = useMemo(() => {
        const allAlbums = data?.galleryAlbums || [];
        return {
            total: allAlbums.length,
            public: allAlbums.filter((a: GalleryAlbum) => a.isPublic).length,
            private: allAlbums.filter((a: GalleryAlbum) => !a.isPublic).length,
            totalPhotos: allAlbums.reduce((sum: number, album: GalleryAlbum) => sum + (album.photos?.length || 0), 0),
            categories: [...new Set(allAlbums.map((a: GalleryAlbum) => a.category).filter(Boolean))]
        };
    }, [data?.galleryAlbums]);

    const handleCreateAlbum = () => {
        const newAlbum: GalleryAlbum = {
            id: Date.now().toString(),
            title: '',
            description: '',
            category: 'shooting',
            coverImage: '',
            photos: [],
            date: new Date().toISOString().split('T')[0],
            location: '',
            isPublic: true,
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setEditingAlbum(newAlbum);
        setShowEditor(true);
    };

    const handleEditAlbum = (album: GalleryAlbum) => {
        setEditingAlbum(album);
        setShowEditor(true);
    };

    const handleSaveAlbum = async (album: GalleryAlbum) => {
        if (!data) return;

        const existingIndex = data.galleryAlbums?.findIndex((a: GalleryAlbum) => a.id === album.id) ?? -1;
        let updatedAlbums;

        if (existingIndex >= 0) {
            // Update existing album
            updatedAlbums = [...(data.galleryAlbums || [])];
            updatedAlbums[existingIndex] = { ...album, updatedAt: new Date().toISOString() };
            addNotification('Album mis à jour avec succès', 'success');
        } else {
            // Add new album
            updatedAlbums = [...(data.galleryAlbums || []), album];
            addNotification('Album créé avec succès', 'success');
        }

        await saveData({ ...data, galleryAlbums: updatedAlbums });
        setShowEditor(false);
        setEditingAlbum(null);
    };

    const handleDeleteAlbum = async (album: GalleryAlbum) => {
        if (!data || !window.confirm(`Supprimer l'album "${album.title}" ? Cette action est irréversible.`)) {
            return;
        }

        const updatedAlbums = data.galleryAlbums?.filter((a: GalleryAlbum) => a.id !== album.id) || [];
        await saveData({ ...data, galleryAlbums: updatedAlbums });
        addNotification('Album supprimé avec succès', 'success');
    };

    const handleToggleVisibility = async (album: GalleryAlbum) => {
        if (!data) return;

        const updatedAlbums = data.galleryAlbums?.map((a: GalleryAlbum) =>
            a.id === album.id ? { ...a, isPublic: !a.isPublic } : a
        ) || [];

        await saveData({ ...data, galleryAlbums: updatedAlbums });
        addNotification(
            `Album rendu ${!album.isPublic ? 'public' : 'privé'} avec succès`,
            'success'
        );
    };

    const categories: CategoryFilter[] = ['toutes', 'shooting', 'défilé', 'événement', 'backstage', 'portrait', 'autre'];

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Galerie" noIndex />

            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Retour au Dashboard
                        </Link>
                        <h1 className="text-4xl font-playfair text-pm-gold">Galerie</h1>
                        <p className="text-pm-off-white/70 mt-2">Gérez les albums photo de l'agence</p>
                    </div>
                    <button
                        onClick={handleCreateAlbum}
                        className="flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark rounded-lg font-medium hover:bg-pm-gold/90 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nouvel Album
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-black border border-pm-gold/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-pm-gold">{statistics.total}</div>
                        <div className="text-sm text-pm-off-white/60">Total Albums</div>
                    </div>
                    <div className="bg-black border border-pm-gold/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">{statistics.public}</div>
                        <div className="text-sm text-pm-off-white/60">Publics</div>
                    </div>
                    <div className="bg-black border border-pm-gold/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-400">{statistics.private}</div>
                        <div className="text-sm text-pm-off-white/60">Privés</div>
                    </div>
                    <div className="bg-black border border-pm-gold/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-pm-gold">{statistics.totalPhotos}</div>
                        <div className="text-sm text-pm-off-white/60">Total Photos</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Category Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-all ${category === cat
                                        ? 'bg-pm-gold text-pm-dark'
                                        : 'bg-black border border-pm-gold/30 text-pm-gold hover:bg-pm-gold/10'
                                        }`}
                                >
                                    {cat === 'toutes' ? 'Toutes' : cat}
                                </button>
                            ))}
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            {(['toutes', 'public', 'privé'] as StatusFilter[]).map(stat => (
                                <button
                                    key={stat}
                                    onClick={() => setStatus(stat)}
                                    className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-all ${status === stat
                                        ? 'bg-pm-gold text-pm-dark'
                                        : 'bg-black border border-pm-gold/30 text-pm-gold hover:bg-pm-gold/10'
                                        }`}
                                >
                                    {stat === 'toutes' ? 'Tous statuts' : stat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-md">
                        <input
                            type="text"
                            placeholder="Rechercher un album..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-black border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                        />
                    </div>
                </div>

                {/* Gallery Grid */}
                {albums.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {albums.map((album: GalleryAlbum) => (
                            <div key={album.id} className="relative group">
                                <AlbumCard album={album} />

                                {/* Admin Actions Overlay */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                    <button
                                        onClick={() => handleToggleVisibility(album)}
                                        className={`p-2 rounded-full bg-black/80 border ${album.isPublic
                                            ? 'border-green-500 text-green-400'
                                            : 'border-orange-500 text-orange-400'
                                            } hover:bg-black transition-colors`}
                                        title={album.isPublic ? 'Rendre privé' : 'Rendre public'}
                                    >
                                        {album.isPublic ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleEditAlbum(album)}
                                        className="p-2 rounded-full bg-black/80 border border-pm-gold text-pm-gold hover:bg-pm-gold/20 transition-colors"
                                        title="Modifier"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAlbum(album)}
                                        className="p-2 rounded-full bg-black/80 border border-red-500 text-red-400 hover:bg-red-500/20 transition-colors"
                                        title="Supprimer"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Visibility Badge */}
                                <div className="absolute top-2 left-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${album.isPublic
                                        ? 'bg-green-500/20 text-green-300 border border-green-500'
                                        : 'bg-orange-500/20 text-orange-300 border border-orange-500'
                                        }`}>
                                        {album.isPublic ? 'Public' : 'Privé'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-xl font-semibold text-pm-gold mb-2">Aucun album trouvé</h3>
                            <p className="text-pm-off-white/60 mb-6">
                                {searchTerm || category !== 'toutes' || status !== 'toutes'
                                    ? 'Essayez de modifier vos filtres pour voir plus de résultats.'
                                    : 'Commencez par créer votre premier album photo.'
                                }
                            </p>
                            {(!searchTerm && category === 'toutes' && status === 'toutes') ? (
                                <button
                                    onClick={handleCreateAlbum}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark rounded-full font-medium hover:bg-pm-gold/90 transition-colors"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Créer un album
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setCategory('toutes');
                                        setStatus('toutes');
                                    }}
                                    className="px-6 py-2 bg-pm-gold text-pm-dark rounded-full font-medium hover:bg-pm-gold/90 transition-colors"
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Public Gallery Link */}
                <div className="text-center mt-16 pt-8 border-t border-pm-gold/20">
                    <Link
                        to="/galerie"
                        className="inline-flex items-center gap-2 text-pm-gold hover:underline"
                    >
                        Voir la galerie publique
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Album Editor Modal */}
            {showEditor && editingAlbum && (
                <AlbumEditor
                    album={editingAlbum}
                    onSave={handleSaveAlbum}
                    onCancel={() => {
                        setShowEditor(false);
                        setEditingAlbum(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminGallery;
