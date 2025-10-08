import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { 
    XMarkIcon, 
    ChevronLeftIcon, 
    ChevronRightIcon,
    ArrowLeftIcon,
    CalendarIcon,
    MapPinIcon,
    CameraIcon,
    ShareIcon
} from '@heroicons/react/24/outline';
import { GalleryAlbum, GalleryPhoto } from '../types';

const GalleryAlbumDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data } = useData();
    
    const album = (data?.galleryAlbums || []).find((a: GalleryAlbum) => a.id === id);
    
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    if (!album) {
        return (
            <div className="min-h-screen bg-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-playfair text-pm-gold mb-4">Album non trouvé</h2>
                    <Link to="/gallery" className="text-pm-gold hover:underline">
                        Retour à la galerie
                    </Link>
                </div>
            </div>
        );
    }

    const openLightbox = (index: number) => {
        setCurrentPhotoIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev + 1) % album.photos.length);
    };

    const prevPhoto = () => {
        setCurrentPhotoIndex((prev) => (prev - 1 + album.photos.length) % album.photos.length);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: album.title,
                text: album.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Lien copié dans le presse-papiers !');
        }
    };

    return (
        <>
            <SEO 
                title={album.title}
                description={album.description}
                keywords={`galerie, ${album.category}, photos, Perfect Models`}
                image={album.coverImage}
                type="article"
            />

            <div className="min-h-screen bg-pm-dark">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${album.coverImage})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-pm-dark"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6">
                        <div className="container mx-auto">
                            {/* Back Button */}
                            <button
                                onClick={() => navigate('/gallery')}
                                className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-pm-gold/30 text-pm-off-white hover:bg-pm-gold hover:text-black transition-all"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                Retour à la galerie
                            </button>

                            <div className="space-y-4">
                                <div className="inline-block px-4 py-2 bg-pm-gold/20 backdrop-blur-sm rounded-full border border-pm-gold/50">
                                    <span className="text-sm uppercase tracking-wider text-pm-gold font-bold">
                                        {album.category}
                                    </span>
                                </div>
                                
                                <h1 className="text-5xl md:text-6xl font-playfair font-extrabold text-pm-gold max-w-4xl">
                                    {album.title}
                                </h1>
                                
                                <p className="text-xl text-pm-off-white/80 max-w-3xl leading-relaxed">
                                    {album.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 text-sm text-pm-off-white/70 pt-2">
                                    <span className="flex items-center gap-2">
                                        <CalendarIcon className="w-5 h-5 text-pm-gold" />
                                        {new Date(album.date).toLocaleDateString('fr-FR', { 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}
                                    </span>
                                    {album.location && (
                                        <span className="flex items-center gap-2">
                                            <MapPinIcon className="w-5 h-5 text-pm-gold" />
                                            {album.location}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-2">
                                        <CameraIcon className="w-5 h-5 text-pm-gold" />
                                        {album.photos.length} {album.photos.length > 1 ? 'Photos' : 'Photo'}
                                    </span>
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold/10 hover:bg-pm-gold hover:text-black rounded-full border border-pm-gold/30 hover:border-pm-gold transition-all"
                                    >
                                        <ShareIcon className="w-5 h-5" />
                                        Partager
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photos Grid */}
                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {album.photos.map((photo: GalleryPhoto, index: number) => (
                            <div
                                key={photo.id}
                                className="group relative aspect-square overflow-hidden rounded-xl bg-black border border-pm-gold/20 hover:border-pm-gold cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-pm-gold/20"
                                onClick={() => openLightbox(index)}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.caption || `Photo ${index + 1}`}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        {photo.caption && (
                                            <p className="text-sm text-pm-off-white font-semibold mb-1">
                                                {photo.caption}
                                            </p>
                                        )}
                                        {photo.photographer && (
                                            <p className="text-xs text-pm-off-white/70">
                                                📷 {photo.photographer}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lightbox */}
                {lightboxOpen && (
                    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 p-3 bg-black/50 rounded-full border border-pm-gold/30 text-pm-off-white hover:bg-pm-gold hover:text-black transition-all z-50"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        {/* Previous Button */}
                        <button
                            onClick={prevPhoto}
                            className="absolute left-6 p-3 bg-black/50 rounded-full border border-pm-gold/30 text-pm-off-white hover:bg-pm-gold hover:text-black transition-all z-50"
                        >
                            <ChevronLeftIcon className="w-8 h-8" />
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={nextPhoto}
                            className="absolute right-6 p-3 bg-black/50 rounded-full border border-pm-gold/30 text-pm-off-white hover:bg-pm-gold hover:text-black transition-all z-50"
                        >
                            <ChevronRightIcon className="w-8 h-8" />
                        </button>

                        {/* Image */}
                        <div className="max-w-7xl max-h-[90vh] px-20">
                            <img
                                src={album.photos[currentPhotoIndex].url}
                                alt={album.photos[currentPhotoIndex].caption || `Photo ${currentPhotoIndex + 1}`}
                                className="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg shadow-2xl"
                            />
                            
                            {/* Photo Info */}
                            <div className="mt-6 text-center space-y-2">
                                {album.photos[currentPhotoIndex].caption && (
                                    <p className="text-lg text-pm-gold font-semibold">
                                        {album.photos[currentPhotoIndex].caption}
                                    </p>
                                )}
                                {album.photos[currentPhotoIndex].photographer && (
                                    <p className="text-sm text-pm-off-white/70">
                                        Photographe : {album.photos[currentPhotoIndex].photographer}
                                    </p>
                                )}
                                <p className="text-xs text-pm-off-white/50">
                                    Photo {currentPhotoIndex + 1} sur {album.photos.length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GalleryAlbumDetail;

