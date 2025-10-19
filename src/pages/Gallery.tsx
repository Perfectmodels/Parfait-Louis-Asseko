import React, { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { GalleryAlbum } from '../types';
import {
    XMarkIcon,
    PhotoIcon,
    EyeIcon,
    CalendarIcon,
    ShareIcon,
    ClipboardDocumentIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

const Gallery: React.FC = () => {
    const { data, isInitialized } = useData();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [shareOpen, setShareOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    const albums: GalleryAlbum[] = useMemo(() => {
        if (!data?.galleryAlbums) return [];
        return (data.galleryAlbums as GalleryAlbum[]).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [data]);

    const categories: string[] = useMemo(() => {
        const cats = new Set<string>();
        albums.forEach(album => {
            if (album.category) cats.add(album.category);
        });
        return Array.from(cats).sort();
    }, [albums]);

    const images: string[] = useMemo(() => {
        const acc = new Set<string>();
        if (!data) return [];

        // Albums curated first (if any album has images)
        if (albums && albums.length > 0) {
            albums.forEach(alb => (alb.images || []).forEach(u => { if (u) acc.add(u); }));
        } else {
            // Site images
            Object.values(data.siteImages || {}).forEach((url) => { if (url) acc.add(url as string); });

            // News
            (data.newsItems || []).forEach((n) => { if (n.imageUrl) acc.add(n.imageUrl); });
        }

        return Array.from(acc);
    }, [data, albums]);

    const filteredAlbums = useMemo(() => {
        return albums.filter(album => {
            const matchesSearch = searchTerm === '' ||
                album.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                album.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                album.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = !selectedCategory || album.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [albums, searchTerm, selectedCategory]);

    const handleShare = (url: string) => {
        setShareUrl(url);
        setShareOpen(true);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const shareOnSocial = (platform: string) => {
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        };
        window.open(urls[platform as keyof typeof urls], '_blank');
    };

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pm-dark via-black to-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto mb-4"></div>
                    <p className="text-pm-off-white">Chargement de la galerie...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pm-dark via-black to-pm-dark">
            <SEO title="Galerie - Perfect Models Management" />

            {/* Header de la galerie */}
            <div className="relative py-20">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-playfair text-pm-gold mb-6">
                        Galerie
                    </h1>
                    <p className="text-xl text-pm-off-white/80 max-w-2xl mx-auto">
                        Découvrez notre collection de photographies professionnelles et nos albums thématiques
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Contrôles de la galerie */}
                <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Recherche */}
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-off-white/50" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-black/50 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold"
                            />
                        </div>

                        {/* Filtres par catégorie */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                    selectedCategory === null
                                        ? 'bg-pm-gold text-black'
                                        : 'bg-black/50 text-pm-off-white hover:bg-pm-gold/20'
                                }`}
                            >
                                Tous
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                        selectedCategory === category
                                            ? 'bg-pm-gold text-black'
                                            : 'bg-black/50 text-pm-off-white hover:bg-pm-gold/20'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Modes d'affichage */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-pm-gold text-black'
                                    : 'bg-black/50 text-pm-off-white hover:bg-pm-gold/20'
                            }`}
                        >
                            <PhotoIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('masonry')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'masonry'
                                    ? 'bg-pm-gold text-black'
                                    : 'bg-black/50 text-pm-off-white hover:bg-pm-gold/20'
                            }`}
                        >
                            <FunnelIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Albums */}
                {filteredAlbums.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-playfair text-pm-gold mb-8">Albums</h2>
                        <div className={`grid gap-6 ${
                            viewMode === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                        }`}>
                            {filteredAlbums.map(album => (
                                <div
                                    key={album.id}
                                    className="group relative bg-black/50 rounded-lg overflow-hidden border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 cursor-pointer"
                                    onClick={() => setSelectedAlbum(album)}
                                >
                                    <div className="aspect-video relative">
                                        <img
                                            src={album.coverUrl || album.images?.[0]}
                                            alt={album.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Tags overlay */}
                                        {album.tags && album.tags.length > 0 && (
                                            <div className="absolute top-2 right-2 flex gap-1 flex-wrap">
                                                {album.tags.slice(0, 2).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-pm-gold/90 text-black text-xs rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-pm-off-white group-hover:text-pm-gold transition-colors mb-2">
                                            {album.title}
                                        </h3>
                                        <p className="text-sm text-pm-off-white/70 mb-3 line-clamp-2">
                                            {album.description}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-pm-off-white/60">
                                            <span className="flex items-center gap-1">
                                                <PhotoIcon className="w-4 h-4" />
                                                {album.images?.length || 0} photos
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="w-4 h-4" />
                                                {new Date(album.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Images individuelles */}
                <div>
                    <h2 className="text-3xl font-playfair text-pm-gold mb-8">
                        {filteredAlbums.length > 0 ? 'Images' : 'Galerie'}
                    </h2>

                    {images.length > 0 ? (
                        <div className={`grid gap-4 ${
                            viewMode === 'grid'
                                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        }`}>
                            {images.map((imageUrl, index) => (
                                <div
                                    key={index}
                                    className={`group relative bg-black/50 rounded-lg overflow-hidden border border-pm-gold/20 hover:border-pm-gold transition-all duration-300 cursor-pointer ${
                                        viewMode === 'masonry' ? 'aspect-auto' : 'aspect-square'
                                    }`}
                                    onClick={() => setSelectedImage(imageUrl)}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Image ${index + 1}`}
                                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                                            viewMode === 'masonry' ? 'h-auto' : ''
                                        }`}
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="text-center">
                                            <EyeIcon className="w-8 h-8 text-pm-gold mx-auto mb-2" />
                                            <p className="text-pm-off-white text-sm">Voir l'image</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <PhotoIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
                            <p className="text-pm-off-white/60 text-lg">Aucune image disponible pour le moment</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal d'image sélectionnée */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <img
                            src={selectedImage}
                            alt="Image sélectionnée"
                            className="max-w-full max-h-full object-contain"
                        />

                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button
                                onClick={() => handleShare(selectedImage)}
                                className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ShareIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'album sélectionné */}
            {selectedAlbum && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-6xl max-h-full bg-black rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-pm-gold/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-playfair text-pm-gold mb-2">
                                        {selectedAlbum.title}
                                    </h2>
                                    <p className="text-pm-off-white/80">
                                        {selectedAlbum.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedAlbum(null)}
                                    className="p-2 text-pm-off-white hover:text-pm-gold transition-colors"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            {selectedAlbum.tags && selectedAlbum.tags.length > 0 && (
                                <div className="flex gap-2 mt-4 flex-wrap">
                                    {selectedAlbum.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-pm-gold/20 text-pm-gold rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            {selectedAlbum.images && selectedAlbum.images.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {selectedAlbum.images.map((imageUrl, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square bg-black/50 rounded-lg overflow-hidden cursor-pointer group"
                                            onClick={() => setSelectedImage(imageUrl)}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={`${selectedAlbum.title} - Image ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <PhotoIcon className="w-12 h-12 text-pm-off-white/30 mx-auto mb-4" />
                                    <p className="text-pm-off-white/60">Aucune image dans cet album</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de partage */}
            {shareOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-black rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-pm-off-white">Partager</h3>
                            <button
                                onClick={() => setShareOpen(false)}
                                className="text-pm-off-white/70 hover:text-white"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 p-3 bg-pm-dark/50 rounded-lg">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 bg-transparent text-pm-off-white text-sm"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className={`p-2 rounded transition-colors ${
                                        copied
                                            ? 'bg-green-600 text-white'
                                            : 'bg-pm-gold text-black hover:bg-pm-gold/90'
                                    }`}
                                >
                                    {copied ? <CheckIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => shareOnSocial('facebook')}
                                    className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Facebook
                                </button>
                                <button
                                    onClick={() => shareOnSocial('twitter')}
                                    className="flex-1 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                                >
                                    Twitter
                                </button>
                                <button
                                    onClick={() => shareOnSocial('linkedin')}
                                    className="flex-1 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                                >
                                    LinkedIn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
