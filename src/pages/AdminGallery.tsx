import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    PhotoIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { GalleryAlbum, GalleryPhoto } from '../types';
import { Link } from 'react-router-dom';

const AdminGallery: React.FC = () => {
    const { data, reloadData } = useData();
    const albums = data?.galleryAlbums || [];
    
    const [showModal, setShowModal] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
    const [formData, setFormData] = useState<Partial<GalleryAlbum>>({
        title: '',
        description: '',
        category: 'shooting',
        coverImage: '',
        photos: [],
        date: new Date().toISOString().split('T')[0],
        location: '',
        isPublic: true
    });

    const [newPhoto, setNewPhoto] = useState<Partial<GalleryPhoto>>({
        url: '',
        caption: '',
        photographer: ''
    });

    const handleOpenModal = (album?: GalleryAlbum) => {
        if (album) {
            setEditingAlbum(album);
            setFormData(album);
        } else {
            setEditingAlbum(null);
            setFormData({
                title: '',
                description: '',
                category: 'shooting',
                coverImage: '',
                photos: [],
                date: new Date().toISOString().split('T')[0],
                location: '',
                isPublic: true
            });
        }
        setShowModal(true);
    };

    const handleAddPhoto = () => {
        if (newPhoto.url) {
            const photo: GalleryPhoto = {
                id: Date.now().toString(),
                url: newPhoto.url,
                caption: newPhoto.caption,
                photographer: newPhoto.photographer,
                date: new Date().toISOString()
            };
            setFormData({
                ...formData,
                photos: [...(formData.photos || []), photo]
            });
            setNewPhoto({ url: '', caption: '', photographer: '' });
        }
    };

    const handleRemovePhoto = (photoId: string) => {
        setFormData({
            ...formData,
            photos: (formData.photos || []).filter(p => p.id !== photoId)
        });
    };

    const handleSave = async () => {
        try {
            const albumData: GalleryAlbum = {
                id: editingAlbum?.id || `album-${Date.now()}`,
                title: formData.title || '',
                description: formData.description || '',
                category: formData.category || 'shooting',
                coverImage: formData.coverImage || (formData.photos && formData.photos[0]?.url) || '',
                photos: formData.photos || [],
                date: formData.date || new Date().toISOString().split('T')[0],
                location: formData.location || '',
                isPublic: formData.isPublic !== undefined ? formData.isPublic : true,
                createdAt: editingAlbum?.createdAt || new Date().toISOString()
            };

            const updatedAlbums = editingAlbum
                ? albums.map((a: GalleryAlbum) => a.id === editingAlbum.id ? albumData : a)
                : [...albums, albumData];

            await set(ref(db, 'galleryAlbums'), updatedAlbums);
            await reloadData();
            setShowModal(false);
            alert('Album enregistré avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            alert('Erreur lors de l\'enregistrement de l\'album');
        }
    };

    const handleDelete = async (albumId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
            try {
                const updatedAlbums = albums.filter((a: GalleryAlbum) => a.id !== albumId);
                await set(ref(db, 'galleryAlbums'), updatedAlbums);
                await reloadData();
                alert('Album supprimé avec succès !');
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression de l\'album');
            }
        }
    };

    return (
        <div className="min-h-screen bg-pm-dark p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="admin-page-header">
                    <div>
                        <h1 className="admin-page-title">Gestion de la Galerie</h1>
                        <p className="admin-page-subtitle">Gérez vos albums de défilés, shootings et événements</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-black font-bold rounded-lg hover:bg-pm-gold/90 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nouvel Album
                    </button>
                </div>

                {/* Albums Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album: GalleryAlbum) => (
                        <div
                            key={album.id}
                            className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden hover:border-pm-gold transition-all"
                        >
                            <div className="relative h-48">
                                <img
                                    src={album.coverImage}
                                    alt={album.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 px-3 py-1 bg-black/80 rounded-full text-xs text-pm-gold">
                                    {album.photos.length} photos
                                </div>
                                {!album.isPublic && (
                                    <div className="absolute top-2 left-2 px-3 py-1 bg-red-500/80 rounded-full text-xs text-white">
                                        Privé
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 space-y-3">
                                <div>
                                    <span className="inline-block px-2 py-1 bg-pm-gold/20 rounded text-xs text-pm-gold mb-2">
                                        {album.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-pm-gold line-clamp-1">
                                        {album.title}
                                    </h3>
                                    <p className="text-sm text-pm-off-white/70 line-clamp-2">
                                        {album.description}
                                    </p>
                                </div>

                                <div className="text-xs text-pm-off-white/60">
                                    {new Date(album.date).toLocaleDateString('fr-FR')}
                                    {album.location && ` • ${album.location}`}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Link
                                        to={`/gallery/${album.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pm-off-white/10 hover:bg-pm-off-white/20 rounded text-sm text-pm-off-white transition-colors"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        Voir
                                    </Link>
                                    <button
                                        onClick={() => handleOpenModal(album)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pm-gold/20 hover:bg-pm-gold/30 rounded text-sm text-pm-gold transition-colors"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(album.id)}
                                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {albums.length === 0 && (
                    <div className="text-center py-20">
                        <PhotoIcon className="w-24 h-24 text-pm-off-white/20 mx-auto mb-4" />
                        <p className="text-pm-off-white/60">Aucun album pour le moment</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-pm-dark border border-pm-gold/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-pm-dark border-b border-pm-gold/30 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-playfair text-pm-gold">
                                {editingAlbum ? 'Modifier l\'album' : 'Nouvel album'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-pm-off-white/60 hover:text-pm-gold transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label">Titre</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="admin-input"
                                        placeholder="Nom de l'album"
                                    />
                                </div>

                                <div>
                                    <label className="admin-label">Catégorie</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                        className="admin-input"
                                    >
                                        <option value="défilé">Défilé</option>
                                        <option value="shooting">Shooting</option>
                                        <option value="événement">Événement</option>
                                        <option value="casting">Casting</option>
                                        <option value="backstage">Backstage</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="admin-label">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="admin-label">Lieu</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="admin-input"
                                        placeholder="Ex: Libreville, Gabon"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="admin-label">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="admin-textarea"
                                    rows={3}
                                    placeholder="Description de l'album"
                                ></textarea>
                            </div>

                            <div>
                                <label className="admin-label">Image de couverture (URL)</label>
                                <input
                                    type="url"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                    className="admin-input"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isPublic" className="text-pm-off-white">
                                    Album public (visible sur le site)
                                </label>
                            </div>

                            {/* Photos Section */}
                            <div className="border-t border-pm-gold/20 pt-6">
                                <h3 className="text-xl font-playfair text-pm-gold mb-4">Photos de l'album</h3>
                                
                                {/* Add Photo Form */}
                                <div className="bg-black/50 p-4 rounded-lg mb-4 space-y-3">
                                    <input
                                        type="url"
                                        value={newPhoto.url}
                                        onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                                        className="admin-input"
                                        placeholder="URL de la photo"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={newPhoto.caption}
                                            onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                                            className="admin-input"
                                            placeholder="Légende (optionnel)"
                                        />
                                        <input
                                            type="text"
                                            value={newPhoto.photographer}
                                            onChange={(e) => setNewPhoto({ ...newPhoto, photographer: e.target.value })}
                                            className="admin-input"
                                            placeholder="Photographe (optionnel)"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddPhoto}
                                        className="w-full px-4 py-2 bg-pm-gold text-black font-bold rounded hover:bg-pm-gold/90 transition-colors"
                                    >
                                        Ajouter la photo
                                    </button>
                                </div>

                                {/* Photos List */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(formData.photos || []).map((photo: GalleryPhoto) => (
                                        <div key={photo.id} className="relative group">
                                            <img
                                                src={photo.url}
                                                alt={photo.caption || ''}
                                                className="w-full h-32 object-cover rounded"
                                            />
                                            <button
                                                onClick={() => handleRemovePhoto(photo.id)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <TrashIcon className="w-4 h-4 text-white" />
                                            </button>
                                            {photo.caption && (
                                                <p className="text-xs text-pm-off-white/70 mt-1 truncate">
                                                    {photo.caption}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-pm-dark border-t border-pm-gold/30 p-6 flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 bg-pm-off-white/10 hover:bg-pm-off-white/20 rounded-lg text-pm-off-white transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-pm-gold text-black font-bold rounded-lg hover:bg-pm-gold/90 transition-colors"
                            >
                                {editingAlbum ? 'Mettre à jour' : 'Créer l\'album'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGallery;

