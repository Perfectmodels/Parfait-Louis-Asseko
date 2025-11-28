import React, { useState, useRef } from 'react';
import { GalleryAlbum, Photo } from '../types';
import { XMarkIcon, PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface AlbumEditorProps {
    album: GalleryAlbum;
    onSave: (album: GalleryAlbum) => void;
    onCancel: () => void;
}

const AlbumEditor: React.FC<AlbumEditorProps> = ({ album, onSave, onCancel }) => {
    const [editedAlbum, setEditedAlbum] = useState<GalleryAlbum>(album);
    const [newTag, setNewTag] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = ['shooting', 'défilé', 'événement', 'backstage', 'portrait', 'autre'];

    const handleInputChange = (field: keyof GalleryAlbum, value: any) => {
        setEditedAlbum(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !editedAlbum.tags.includes(newTag.trim())) {
            setEditedAlbum(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditedAlbum(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPhoto: Photo = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    url: event.target?.result as string,
                    caption: '',
                    date: new Date().toISOString(),
                    photographer: '',
                    tags: []
                };
                
                setEditedAlbum(prev => ({
                    ...prev,
                    photos: [...prev.photos, newPhoto]
                }));
            };
            reader.readAsDataURL(file);
        });

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemovePhoto = (photoId: string) => {
        setEditedAlbum(prev => ({
            ...prev,
            photos: prev.photos.filter(photo => photo.id !== photoId)
        }));
    };

    const handleReorderPhoto = (index: number, direction: 'up' | 'down') => {
        const newPhotos = [...editedAlbum.photos];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newPhotos.length) {
            [newPhotos[index], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[index]];
            setEditedAlbum(prev => ({ ...prev, photos: newPhotos }));
        }
    };

    const handleUpdatePhoto = (photoId: string, updates: Partial<Photo>) => {
        setEditedAlbum(prev => ({
            ...prev,
            photos: prev.photos.map(photo => 
                photo.id === photoId ? { ...photo, ...updates } : photo
            )
        }));
    };

    const handleSetCoverImage = (photoUrl: string) => {
        setEditedAlbum(prev => ({ ...prev, coverImage: photoUrl }));
    };

    const handleSave = () => {
        if (!editedAlbum.title.trim()) {
            alert('Veuillez ajouter un titre à l\'album');
            return;
        }
        
        onSave(editedAlbum);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-pm-dark border-b border-pm-gold/20 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-playfair text-pm-gold">
                        {album.id ? 'Modifier l\'album' : 'Nouvel album'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 text-pm-off-white/60 hover:text-pm-off-white transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-pm-off-white mb-2">
                                Titre *
                            </label>
                            <input
                                type="text"
                                value={editedAlbum.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-4 py-2 bg-black border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                                placeholder="Titre de l'album"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-pm-off-white mb-2">
                                Catégorie
                            </label>
                            <select
                                value={editedAlbum.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full px-4 py-2 bg-black border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold transition-colors"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-pm-off-white mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={editedAlbum.date ? new Date(editedAlbum.date).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleInputChange('date', new Date(e.target.value).toISOString())}
                                className="w-full px-4 py-2 bg-black border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-pm-off-white mb-2">
                                Lieu
                            </label>
                            <input
                                type="text"
                                value={editedAlbum.location || ''}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="w-full px-4 py-2 bg-black border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                                placeholder="Lieu de l'événement"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-pm-off-white mb-2">
                            Description
                        </label>
                        <textarea
                            value={editedAlbum.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 bg-black border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors resize-none"
                            placeholder="Description de l'album..."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-pm-off-white mb-2">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {editedAlbum.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-pm-gold/10 text-pm-gold rounded-full text-sm"
                                >
                                    #{tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-pm-off-white transition-colors"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                className="flex-1 px-4 py-2 bg-black border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                                placeholder="Ajouter un tag..."
                            />
                            <button
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-pm-gold text-pm-dark rounded-lg font-medium hover:bg-pm-gold/90 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={editedAlbum.isPublic}
                                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                                className="w-4 h-4 text-pm-gold border-pm-gold/30 rounded focus:ring-pm-gold focus:ring-offset-pm-dark bg-black"
                            />
                            <span className="text-sm text-pm-off-white">
                                Album public (visible sur la galerie publique)
                            </span>
                        </label>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-pm-off-white mb-2">
                            Image de couverture
                        </label>
                        {editedAlbum.coverImage ? (
                            <div className="relative inline-block">
                                <img
                                    src={editedAlbum.coverImage}
                                    alt="Cover"
                                    className="w-32 h-32 object-cover rounded-lg border border-pm-gold/30"
                                />
                                <button
                                    onClick={() => handleInputChange('coverImage', '')}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-pm-off-white/50 text-sm">
                                La première photo de l'album sera utilisée comme couverture
                            </p>
                        )}
                    </div>

                    {/* Photos */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-pm-off-white">
                                Photos ({editedAlbum.photos.length})
                            </label>
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleAddPhoto}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark rounded-lg font-medium hover:bg-pm-gold/90 transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Ajouter des photos
                                </button>
                            </div>
                        </div>

                        {editedAlbum.photos.length > 0 && (
                            <div className="space-y-4">
                                {editedAlbum.photos.map((photo, index) => (
                                    <div key={photo.id} className="bg-black border border-pm-gold/20 rounded-lg p-4">
                                        <div className="flex gap-4">
                                            {/* Thumbnail */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={photo.url}
                                                    alt={photo.caption || `Photo ${index + 1}`}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                            </div>

                                            {/* Photo Details */}
                                            <div className="flex-1 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        value={photo.caption}
                                                        onChange={(e) => handleUpdatePhoto(photo.id, { caption: e.target.value })}
                                                        className="px-3 py-1.5 bg-black border border-pm-gold/30 rounded text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors text-sm"
                                                        placeholder="Légende de la photo"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={photo.photographer}
                                                        onChange={(e) => handleUpdatePhoto(photo.id, { photographer: e.target.value })}
                                                        className="px-3 py-1.5 bg-black border border-pm-gold/30 rounded text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors text-sm"
                                                        placeholder="Photographe"
                                                    />
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleSetCoverImage(photo.url)}
                                                        className={`px-3 py-1 text-xs rounded border transition-colors ${
                                                            editedAlbum.coverImage === photo.url
                                                                ? 'bg-pm-gold text-pm-dark border-pm-gold'
                                                                : 'bg-black border-pm-gold/30 text-pm-gold hover:bg-pm-gold/10'
                                                        }`}
                                                    >
                                                        {editedAlbum.coverImage === photo.url ? 'Couverture' : 'Définir comme couverture'}
                                                    </button>
                                                    
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleReorderPhoto(index, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1 text-pm-off-white/50 hover:text-pm-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <ArrowUpIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReorderPhoto(index, 'down')}
                                                            disabled={index === editedAlbum.photos.length - 1}
                                                            className="p-1 text-pm-off-white/50 hover:text-pm-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <ArrowDownIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemovePhoto(photo.id)}
                                                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-pm-dark border-t border-pm-gold/20 p-6 flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-black border border-pm-gold/30 text-pm-gold rounded-lg font-medium hover:bg-pm-gold/10 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-pm-gold text-pm-dark rounded-lg font-medium hover:bg-pm-gold/90 transition-colors"
                    >
                        {album.id ? 'Mettre à jour' : 'Créer'} l'album
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlbumEditor;
