import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { GalleryItem, GalleryAlbum } from '../types';
import SEO from '../components/SEO';
import {
    PencilIcon,
    TrashIcon,
    PhotoIcon,
    FolderIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    CalendarIcon,
    TagIcon
} from '@heroicons/react/24/outline';
import AdminCard from '../admin/components/AdminCard';
import AdminTable from '../admin/components/AdminTable';
import AdminButton from '../admin/components/AdminButton';
import { AdminInput, AdminSelect, AdminTextarea } from '../admin/components/AdminInput';
import AdminModal from '../admin/components/AdminModal';
import AdminPageHeader from '../admin/components/AdminPageHeader';

const AdminGallery: React.FC = () => {
    const { data, saveData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [activeTab, setActiveTab] = useState<'items' | 'albums'>('items');

    const items = useMemo(() => {
        return [...(data?.gallery || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [data?.gallery]);

    const albums = useMemo(() => {
        return [...(data?.galleryAlbums || [])].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [data?.galleryAlbums]);

    // Filtres avancés
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = searchTerm === '' ||
                item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [items, searchTerm, categoryFilter]);

    const filteredAlbums = useMemo(() => {
        return albums.filter(album => {
            const matchesSearch = searchTerm === '' ||
                album.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                album.category?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === '' || album.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [albums, searchTerm, categoryFilter]);

    // Statistiques
    const galleryStats = useMemo(() => {
        const totalItems = items.length;
        const totalAlbums = albums.length;
        const categories = new Set(items.map(item => item.category).filter(Boolean));
        const recentUploads = items.filter(item => {
            const itemDate = new Date(item.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return itemDate >= weekAgo;
        }).length;

        return { totalItems, totalAlbums, categories: categories.size, recentUploads };
    }, [items, albums]);

    // Gestionnaires d'événements
    const handleOpenModal = (item: GalleryItem | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = async (itemData: GalleryItem) => {
        if (!data) return;

        let updated: GalleryItem[];
        if (editingItem) {
            updated = items.map(g => g.id === itemData.id ? itemData : g);
        } else {
            updated = [...items, {
                ...itemData,
                id: `gallery-${Date.now()}`,
                createdAt: new Date().toISOString(),
                order: (items[items.length - 1]?.order || 0) + 1
            }];
        }

        try {
            await saveData({ ...data, gallery: updated });
            setIsModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            alert("Impossible de sauvegarder l'élément.");
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (window.confirm("Supprimer cet élément ?")) {
            if (!data) return;
            const updated = items.filter(g => g.id !== itemId);
            await saveData({ ...data, gallery: updated });
        }
    };

    const handleOpenAlbumModal = (album: GalleryAlbum | null = null) => {
        setEditingAlbum(album);
        setIsAlbumModalOpen(true);
    };

    const handleSaveAlbum = async (albumData: GalleryAlbum) => {
        if (!data) return;

        let updated: GalleryAlbum[];
        if (editingAlbum) {
            updated = albums.map(a => a.id === albumData.id ? albumData : a);
        } else {
            updated = [...albums, {
                ...albumData,
                id: `album-${Date.now()}`,
                createdAt: new Date().toISOString(),
                images: albumData.images || [],
                tags: albumData.tags || []
            }];
        }

        try {
            await saveData({ ...data, galleryAlbums: updated });
            setIsAlbumModalOpen(false);
            setEditingAlbum(null);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de l'album:", error);
            alert("Impossible de sauvegarder l'album.");
        }
    };

    const handleDeleteAlbum = async (albumId: string) => {
        if (window.confirm("Supprimer cet album ?")) {
            if (!data) return;
            const updated = albums.filter(a => a.id !== albumId);
            await saveData({ ...data, galleryAlbums: updated });
        }
    };

    // Export de données
    const exportData = (type: 'csv' | 'json') => {
        const exportData = activeTab === 'items' ? filteredItems : filteredAlbums;

        if (type === 'csv') {
            const csvContent = 'data:text/csv;charset=utf-8,' +
                Object.keys(exportData[0] || {}).join(',') + '\n' +
                exportData.map(row => Object.values(row).join(',')).join('\n');
            const link = document.createElement('a');
            link.href = csvContent;
            link.download = `gallery_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
        } else {
            const jsonContent = 'data:application/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(exportData, null, 2));
            const link = document.createElement('a');
            link.href = jsonContent;
            link.download = `gallery_${activeTab}_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
        }
    };

    return (
        <div className="min-h-screen bg-pm-dark">
            <SEO title="Galerie Premium" noIndex />

            <div className="container mx-auto px-6 py-8">
                {/* Header avec navigation */}
                <AdminPageHeader
                    title="Galerie Premium"
                    subtitle="Gestion avancée des médias, albums et galeries"
                    actions={[
                        <AdminButton
                            key="add-item"
                            variant="primary"
                            icon={PhotoIcon}
                            onClick={() => handleOpenModal()}
                        >
                            Nouvel Élément
                        </AdminButton>,
                        <AdminButton
                            key="add-album"
                            variant="secondary"
                            icon={FolderIcon}
                            onClick={() => handleOpenAlbumModal()}
                        >
                            Nouvel Album
                        </AdminButton>
                    ]}
                />

                {/* Onglets de navigation */}
                <div className="mb-8">
                    <nav className="flex space-x-1 bg-pm-dark/50 p-1 rounded-lg">
                        {[
                            { id: 'items', label: 'Éléments', icon: PhotoIcon },
                            { id: 'albums', label: 'Albums', icon: FolderIcon }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-pm-gold text-black'
                                        : 'text-pm-off-white hover:text-pm-gold'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Filtres et recherche */}
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-64">
                        <AdminInput
                            label=""
                            placeholder="Rechercher par titre, catégorie..."
                            icon={MagnifyingGlassIcon}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <AdminSelect
                        options={[
                            { value: '', label: 'Toutes les catégories' },
                            { value: 'Portrait', label: 'Portrait' },
                            { value: 'Mode', label: 'Mode' },
                            { value: 'Événement', label: 'Événement' },
                            { value: 'Autre', label: 'Autre' }
                        ]}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                    <AdminButton
                        variant="outline"
                        icon={ArrowDownTrayIcon}
                        onClick={() => exportData('csv')}
                    >
                        Exporter CSV
                    </AdminButton>
                </div>

                {/* Contenu des onglets */}
                {activeTab === 'items' && (
                    <div className="space-y-6">
                        {/* Statistiques rapides */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <AdminCard
                                title="Total Éléments"
                                description={`${galleryStats.totalItems} médias`}
                                icon={PhotoIcon}
                                link="#"
                            />
                            <AdminCard
                                title="Albums"
                                description={`${galleryStats.totalAlbums} albums`}
                                icon={FolderIcon}
                                link="#"
                            />
                            <AdminCard
                                title="Catégories"
                                description={`${galleryStats.categories} catégories`}
                                icon={TagIcon}
                                link="#"
                            />
                            <AdminCard
                                title="Ajouts Récents"
                                description={`${galleryStats.recentUploads} cette semaine`}
                                icon={CalendarIcon}
                                link="#"
                            />
                        </div>

                        {/* Table des éléments */}
                        <AdminTable
                            data={filteredItems}
                            columns={[
                                {
                                    key: 'order',
                                    label: 'Ordre',
                                    sortable: true
                                },
                                {
                                    key: 'title',
                                    label: 'Titre',
                                    sortable: true
                                },
                                {
                                    key: 'category',
                                    label: 'Catégorie'
                                },
                                {
                                    key: 'url',
                                    label: 'Image',
                                    render: (value) => (
                                        <img
                                            src={value}
                                            alt="Preview"
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )
                                },
                                {
                                    key: 'createdAt',
                                    label: 'Date',
                                    render: (value) => value ? new Date(value).toLocaleDateString('fr-FR') : '-',
                                    sortable: true
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    render: (_, item) => (
                                        <div className="flex items-center gap-2">
                                            <AdminButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenModal(item)}
                                                icon={PencilIcon}
                                            >
                                                Modifier
                                            </AdminButton>
                                            <AdminButton
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteItem(item.id)}
                                                icon={TrashIcon}
                                            >
                                                Supprimer
                                            </AdminButton>
                                        </div>
                                    )
                                }
                            ]}
                            onRowClick={(item) => handleOpenModal(item)}
                            emptyMessage="Aucun élément trouvé"
                        />
                    </div>
                )}

                {activeTab === 'albums' && (
                    <div className="space-y-6">
                        <AdminTable
                            data={filteredAlbums}
                            columns={[
                                {
                                    key: 'title',
                                    label: 'Titre',
                                    sortable: true
                                },
                                {
                                    key: 'category',
                                    label: 'Catégorie'
                                },
                                {
                                    key: 'coverUrl',
                                    label: 'Couverture',
                                    render: (value) => (
                                        <img
                                            src={value}
                                            alt="Cover"
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )
                                },
                                {
                                    key: 'images',
                                    label: 'Images',
                                    render: (value) => `${value?.length || 0} images`
                                },
                                {
                                    key: 'tags',
                                    label: 'Tags',
                                    render: (value) => value?.join(', ') || '-'
                                },
                                {
                                    key: 'createdAt',
                                    label: 'Créé le',
                                    render: (value) => value ? new Date(value).toLocaleDateString('fr-FR') : '-',
                                    sortable: true
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    render: (_, item) => (
                                        <div className="flex items-center gap-2">
                                            <AdminButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenAlbumModal(item)}
                                                icon={PencilIcon}
                                            >
                                                Modifier
                                            </AdminButton>
                                            <AdminButton
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteAlbum(item.id)}
                                                icon={TrashIcon}
                                            >
                                                Supprimer
                                            </AdminButton>
                                        </div>
                                    )
                                }
                            ]}
                            onRowClick={(album) => handleOpenAlbumModal(album)}
                            emptyMessage="Aucun album trouvé"
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            {isModalOpen && (
                <ItemModal
                    item={editingItem}
                    onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
                    onSave={handleSaveItem}
                />
            )}
            {isAlbumModalOpen && (
                <AlbumModal
                    album={editingAlbum}
                    onClose={() => { setIsAlbumModalOpen(false); setEditingAlbum(null); }}
                    onSave={handleSaveAlbum}
                />
            )}
        </div>
    );
};

// Modal pour les éléments de galerie
interface ItemModalProps {
    item: GalleryItem | null;
    onClose: () => void;
    onSave: (item: GalleryItem) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: item?.title || '',
        url: item?.url || '',
        category: item?.category || 'Autre',
        order: item?.order || 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'order' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.url) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        onSave({
            ...formData,
            id: item?.id || '',
            createdAt: item?.createdAt || new Date().toISOString()
        } as GalleryItem);
    };

    return (
        <AdminModal
            isOpen={true}
            onClose={onClose}
            title={item ? 'Modifier Élément' : 'Nouvel Élément'}
            size="lg"
            actions={
                <>
                    <AdminButton variant="secondary" onClick={onClose}>
                        Annuler
                    </AdminButton>
                    <AdminButton variant="primary" onClick={handleSubmit}>
                        Sauvegarder
                    </AdminButton>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <AdminInput
                    label="Titre"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <AdminInput
                    label="URL de l'image"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <AdminSelect
                        label="Catégorie"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        options={[
                            { value: 'Portrait', label: 'Portrait' },
                            { value: 'Mode', label: 'Mode' },
                            { value: 'Événement', label: 'Événement' },
                            { value: 'Autre', label: 'Autre' }
                        ]}
                    />
                    <AdminInput
                        label="Ordre d'affichage"
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                    />
                </div>
            </form>
        </AdminModal>
    );
};

// Modal pour les albums
interface AlbumModalProps {
    album: GalleryAlbum | null;
    onClose: () => void;
    onSave: (album: GalleryAlbum) => void;
}

const AlbumModal: React.FC<AlbumModalProps> = ({ album, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: album?.title || '',
        description: album?.description || '',
        category: album?.category || 'Autre',
        coverUrl: album?.coverUrl || '',
        tags: album?.tags || []
    });

    const [newTag, setNewTag] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadedImages, setUploadedImages] = useState<string[]>(album?.images || []);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
    const [uploadErrors, setUploadErrors] = useState<{[key: string]: string}>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag]
            }));
            setNewTag('');
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        // Get ImgBB API key from environment or use a default
        const API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'your-imgbb-api-key-here';
        const UPLOAD_URL = 'https://api.imgbb.com/1/upload';

        if (API_KEY === 'your-imgbb-api-key-here') {
            throw new Error('ImgBB API key not configured. Please add VITE_IMGBB_API_KEY to your environment variables.');
        }

        try {
            setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

            const response = await fetch(`${UPLOAD_URL}?key=${encodeURIComponent(API_KEY)}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.data && result.data.url) {
                setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
                return result.data.url;
            } else {
                throw new Error('Invalid response from ImgBB');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadErrors(prev => ({ ...prev, [file.name]: error instanceof Error ? error.message : 'Upload failed' }));
            throw error;
        }
    };

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file =>
            file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
        );

        if (validFiles.length !== fileArray.length) {
            alert('Certains fichiers ont été ignorés. Seules les images de moins de 10MB sont acceptées.');
        }

        setSelectedFiles(prev => [...prev, ...validFiles]);
        setUploadErrors({});
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileSelect(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadAllImages = async () => {
        if (selectedFiles.length === 0) return [];

        setIsUploading(true);
        setUploadErrors({});

        try {
            const uploadPromises = selectedFiles.map(async (file, index) => {
                try {
                    const url = await uploadImage(file);
                    setUploadedImages(prev => [...prev, url]);
                    return url;
                } catch (error) {
                    console.error(`Failed to upload ${file.name}:`, error);
                    return null;
                }
            });

            const results = await Promise.allSettled(uploadPromises);
            const successfulUploads = results
                .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled' && result.value !== null)
                .map(result => result.value);

            setSelectedFiles([]);
            return successfulUploads;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        try {
            // Upload any pending images first
            let allImages = [...uploadedImages];
            if (selectedFiles.length > 0) {
                const newUploads = await uploadAllImages();
                allImages = [...allImages, ...newUploads];
            }

            // Use first uploaded image as cover if no cover URL is set
            const finalCoverUrl = formData.coverUrl || allImages[0] || '';

            onSave({
                ...formData,
                id: album?.id || '',
                createdAt: album?.createdAt || new Date().toISOString(),
                images: allImages,
                coverUrl: finalCoverUrl
            } as GalleryAlbum);
        } catch (error) {
            console.error('Error saving album:', error);
            alert('Erreur lors de la sauvegarde de l\'album. Veuillez réessayer.');
        }
    };

    return (
        <AdminModal
            isOpen={true}
            onClose={onClose}
            title={album ? 'Modifier Album' : 'Nouvel Album'}
            size="lg"
            actions={
                <>
                    <AdminButton variant="secondary" onClick={onClose} disabled={isUploading}>
                        Annuler
                    </AdminButton>
                    <AdminButton variant="primary" onClick={handleSubmit} disabled={isUploading}>
                        {isUploading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </AdminButton>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <AdminInput
                    label="Titre de l'album"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <AdminTextarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <AdminSelect
                        label="Catégorie"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        options={[
                            { value: 'Portrait', label: 'Portrait' },
                            { value: 'Mode', label: 'Mode' },
                            { value: 'Événement', label: 'Événement' },
                            { value: 'Autre', label: 'Autre' }
                        ]}
                    />
                    <AdminInput
                        label="URL de couverture"
                        name="coverUrl"
                        value={formData.coverUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/cover.jpg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-pm-off-white mb-2">Images de l'album</label>

                    {/* Upload Area */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            isUploading
                                ? 'border-pm-gold bg-pm-gold/10'
                                : 'border-pm-gold/30 hover:border-pm-gold hover:bg-pm-gold/5'
                        }`}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDrop={handleDrop}
                    >
                        <PhotoIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                        <p className="text-pm-off-white mb-2">
                            {isUploading ? 'Téléchargement en cours...' : 'Glissez et déposez vos images ici'}
                        </p>
                        <p className="text-pm-off-white/60 text-sm mb-4">ou</p>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files)}
                            className="hidden"
                            id="image-upload"
                            disabled={isUploading}
                        />
                        <label
                            htmlFor="image-upload"
                            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                isUploading
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-pm-gold text-black hover:bg-pm-gold/90'
                            }`}
                        >
                            Sélectionner des fichiers
                        </label>
                    </div>

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium text-pm-off-white">Fichiers sélectionnés:</h4>
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-pm-gold/20 rounded-lg flex items-center justify-center">
                                            <PhotoIcon className="w-5 h-5 text-pm-gold" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-pm-off-white font-medium">{file.name}</p>
                                            <p className="text-xs text-pm-off-white/60">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {uploadProgress[file.name] !== undefined && (
                                            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-pm-gold transition-all duration-300"
                                                    style={{ width: `${uploadProgress[file.name]}%` }}
                                                />
                                            </div>
                                        )}
                                        {uploadErrors[file.name] && (
                                            <span className="text-red-400 text-xs">Erreur</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-pm-off-white/60 hover:text-red-400 transition-colors"
                                            disabled={isUploading}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Uploaded Images */}
                    {uploadedImages.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-pm-off-white mb-2">
                                Images téléchargées ({uploadedImages.length}):
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {uploadedImages.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            className="w-full h-20 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-700"
                                            title="Supprimer cette image"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedFiles.length === 0 && uploadedImages.length === 0 && (
                        <p className="text-pm-off-white/60 text-sm mt-2 text-center">
                            Aucune image sélectionnée
                        </p>
                    )}
                </div>
            </form>
        </AdminModal>
    );
};

export default AdminGallery;
