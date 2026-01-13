
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { GalleryAlbum, Photo } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import {
    ChevronLeftIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    PhotoIcon,
    CalendarDaysIcon,
    XMarkIcon,
    ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import OptimizedImage from '../../components/OptimizedImage';

const AdminGallery: React.FC = () => {
    const { data, saveData } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const albums = useMemo(() => {
        return (data?.galleryAlbums || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [data?.galleryAlbums]);

    const filteredAlbums = useMemo(() => {
        return albums.filter(album =>
            album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            album.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [albums, searchTerm]);

    const handleCreate = () => {
        const newAlbum: GalleryAlbum = {
            id: `album-${Date.now()}`,
            title: '',
            description: '',
            category: 'événement',
            coverImage: '',
            date: new Date().toISOString(),
            location: '',
            isPublic: false,
            tags: [],
            photos: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setEditingAlbum(newAlbum);
        setIsEditing(true);
    };

    const handleEdit = (album: GalleryAlbum) => {
        setEditingAlbum({ ...album }); // Deep copy might be safer for nested photos but shallow is ok for now
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet album ?")) return;
        if (!data) return;

        const updatedAlbums = data.galleryAlbums.filter(a => a.id !== id);
        await saveData({ ...data, galleryAlbums: updatedAlbums });
    };

    const handleSave = async (album: GalleryAlbum) => {
        if (!data) return;

        let updatedAlbums: GalleryAlbum[];
        const existingIndex = data.galleryAlbums.findIndex(a => a.id === album.id);

        if (existingIndex >= 0) {
            updatedAlbums = [...data.galleryAlbums];
            updatedAlbums[existingIndex] = { ...album, updatedAt: new Date().toISOString() };
        } else {
            updatedAlbums = [...data.galleryAlbums, { ...album, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
        }

        await saveData({ ...data, galleryAlbums: updatedAlbums });
        setIsEditing(false);
        setEditingAlbum(null);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Galerie" noIndex />
            <div className="container mx-auto px-6">
                {!isEditing ? (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                                    <ChevronLeftIcon className="w-5 h-5" />
                                    Retour au Tableau de Bord
                                </Link>
                                <h1 className="text-4xl font-playfair text-pm-gold">Gestion Galerie</h1>
                            </div>
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 bg-pm-gold text-pm-dark px-6 py-3 rounded-full font-bold hover:bg-white transition-colors shadow-lg shadow-pm-gold/20"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Nouvel Album
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-8">
                             <input
                                type="text"
                                placeholder="Rechercher un album..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-1/3 bg-black border border-pm-gold/20 rounded-lg p-3 text-pm-off-white focus:outline-none focus:border-pm-gold"
                            />
                        </div>

                        {/* Albums List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAlbums.map(album => (
                                <div key={album.id} className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden group hover:border-pm-gold/50 transition-colors">
                                    <div className="relative aspect-video">
                                        <OptimizedImage src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button onClick={() => handleEdit(album)} className="p-2 bg-pm-gold text-pm-dark rounded-full hover:bg-white"><PencilSquareIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(album.id)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${album.isPublic ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                                            {album.isPublic ? 'Public' : 'Privé'}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold text-pm-gold truncate">{album.title}</h3>
                                        <p className="text-sm text-pm-off-white/60 mb-2 truncate">{album.category} • {new Date(album.date).toLocaleDateString()}</p>
                                        <div className="flex items-center gap-1 text-xs text-pm-off-white/40">
                                            <PhotoIcon className="w-4 h-4" />
                                            {album.photos.length} photos
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <AlbumEditor
                        album={editingAlbum!}
                        onSave={handleSave}
                        onCancel={() => { setIsEditing(false); setEditingAlbum(null); }}
                    />
                )}
            </div>
        </div>
    );
};

interface AlbumEditorProps {
    album: GalleryAlbum;
    onSave: (album: GalleryAlbum) => void;
    onCancel: () => void;
}

const AlbumEditor: React.FC<AlbumEditorProps> = ({ album: initialAlbum, onSave, onCancel }) => {
    const [album, setAlbum] = useState<GalleryAlbum>(initialAlbum);
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [newPhotoCaption, setNewPhotoCaption] = useState('');

    const categories = ['shooting', 'défilé', 'événement', 'backstage', 'portrait', 'autre'];

    const handleAddPhoto = () => {
        if (!newPhotoUrl) return;
        const newPhoto: Photo = {
            id: `photo-${Date.now()}`,
            url: newPhotoUrl,
            caption: newPhotoCaption,
            date: new Date().toISOString(), // Default to now, can be edited if needed
            photographer: '',
            tags: []
        };
        setAlbum({ ...album, photos: [...album.photos, newPhoto] });
        setNewPhotoUrl('');
        setNewPhotoCaption('');
    };

    const removePhoto = (photoId: string) => {
        setAlbum({ ...album, photos: album.photos.filter(p => p.id !== photoId) });
    };

    return (
        <div className="bg-black border border-pm-gold/20 rounded-xl p-8">
            <div className="flex justify-between items-center mb-8 border-b border-pm-gold/20 pb-4">
                <h2 className="text-3xl font-playfair text-pm-gold">{album.id.startsWith('album-') && album.createdAt === album.updatedAt ? 'Créer un Album' : 'Modifier l\'Album'}</h2>
                <button onClick={onCancel} className="text-pm-off-white/60 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                    <div>
                        <label className="admin-label">Titre</label>
                        <input
                            type="text"
                            value={album.title}
                            onChange={e => setAlbum({...album, title: e.target.value})}
                            className="admin-input"
                        />
                    </div>
                    <div>
                        <label className="admin-label">Description</label>
                        <textarea
                            value={album.description}
                            onChange={e => setAlbum({...album, description: e.target.value})}
                            className="admin-textarea"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="admin-label">Catégorie</label>
                            <select
                                value={album.category}
                                onChange={e => setAlbum({...album, category: e.target.value as any})}
                                className="admin-select"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="admin-label">Date</label>
                            <input
                                type="date"
                                value={album.date.split('T')[0]}
                                onChange={e => setAlbum({...album, date: e.target.value})}
                                className="admin-input"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="admin-label">Lieu</label>
                        <input
                            type="text"
                            value={album.location || ''}
                            onChange={e => setAlbum({...album, location: e.target.value})}
                            className="admin-input"
                        />
                    </div>
                     <div>
                        <label className="admin-label">Image de Couverture (URL)</label>
                        <input
                            type="text"
                            value={album.coverImage}
                            onChange={e => setAlbum({...album, coverImage: e.target.value})}
                            className="admin-input"
                        />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={album.isPublic}
                            onChange={e => setAlbum({...album, isPublic: e.target.checked})}
                            className="w-5 h-5 rounded border-pm-gold text-pm-gold focus:ring-pm-gold"
                        />
                        <label htmlFor="isPublic" className="text-pm-off-white cursor-pointer select-none">Rendre cet album public</label>
                    </div>
                </div>

                <div className="bg-pm-dark/50 p-6 rounded-lg border border-pm-gold/10">
                    <h3 className="font-bold text-pm-gold mb-4 flex items-center gap-2">
                        <PhotoIcon className="w-5 h-5" />
                        Photos de l'album
                    </h3>

                    {/* Add Photo Form */}
                    <div className="bg-black/40 p-4 rounded mb-6 border border-pm-off-white/10">
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="URL de l'image"
                                value={newPhotoUrl}
                                onChange={e => setNewPhotoUrl(e.target.value)}
                                className="admin-input text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Légende (optionnel)"
                                value={newPhotoCaption}
                                onChange={e => setNewPhotoCaption(e.target.value)}
                                className="admin-input text-sm"
                            />
                            <button
                                onClick={handleAddPhoto}
                                disabled={!newPhotoUrl}
                                className="w-full bg-pm-gold/20 text-pm-gold border border-pm-gold/50 py-2 rounded text-sm font-bold hover:bg-pm-gold hover:text-pm-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Ajouter la photo
                            </button>
                        </div>
                    </div>

                    {/* Photos List */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {album.photos.map((photo, index) => (
                            <div key={photo.id} className="flex items-center gap-3 bg-black p-2 rounded border border-pm-gold/10 group hover:border-pm-gold/30">
                                <img src={photo.url} alt="" className="w-12 h-12 object-cover rounded" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{photo.caption || `Photo ${index + 1}`}</p>
                                    <p className="text-xs text-pm-off-white/40 truncate">{photo.url}</p>
                                </div>
                                <button onClick={() => removePhoto(photo.id)} className="p-1 text-red-500/60 hover:text-red-500">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                         {album.photos.length === 0 && <p className="text-center text-sm text-pm-off-white/40 py-4">Aucune photo ajoutée.</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-pm-gold/20 pt-6">
                <button
                    onClick={onCancel}
                    className="px-6 py-2 border border-pm-gold/30 text-pm-off-white rounded hover:bg-pm-gold/10"
                >
                    Annuler
                </button>
                <button
                    onClick={() => onSave(album)}
                    className="px-8 py-2 bg-pm-gold text-pm-dark font-bold rounded hover:bg-white transition-colors"
                >
                    Enregistrer l'album
                </button>
            </div>
        </div>
    );
};

export default AdminGallery;
