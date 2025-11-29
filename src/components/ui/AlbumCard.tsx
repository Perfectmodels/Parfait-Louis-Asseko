import React from 'react';
import { GalleryAlbum } from '../types';

interface AlbumCardProps {
    album: GalleryAlbum;
    onClick?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'shooting': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'défilé': return 'bg-purple-500/20 text-purple-300 border-purple-500';
            case 'événement': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'backstage': return 'bg-orange-500/20 text-orange-300 border-orange-500';
            case 'portrait': return 'bg-pink-500/20 text-pink-300 border-pink-500';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
        }
    };

    return (
        <div 
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={onClick}
        >
            <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Cover Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-pm-dark/50">
                    {album.coverImage ? (
                        <img
                            src={album.coverImage}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-pm-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    
                    {/* Photo Count Overlay */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="text-xs font-medium text-pm-off-white">
                            {album.photos?.length || 0} photo{album.photos?.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-pm-gold mb-2 line-clamp-1 group-hover:text-pm-gold/90 transition-colors">
                        {album.title || 'Album sans titre'}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-pm-off-white/70 mb-3 line-clamp-2">
                        {album.description || 'Aucune description'}
                    </p>

                    {/* Meta Information */}
                    <div className="space-y-2">
                        {/* Category Badge */}
                        <div>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(album.category)}`}>
                                {album.category || 'autre'}
                            </span>
                        </div>

                        {/* Tags */}
                        {album.tags && album.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {album.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-0.5 text-xs bg-pm-gold/10 text-pm-gold/70 rounded"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                                {album.tags.length > 3 && (
                                    <span className="px-2 py-0.5 text-xs bg-pm-gold/10 text-pm-gold/70 rounded">
                                        +{album.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Date and Location */}
                        <div className="flex items-center justify-between text-xs text-pm-off-white/50">
                            <span>
                                {new Date(album.date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                            {album.location && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {album.location}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumCard;
