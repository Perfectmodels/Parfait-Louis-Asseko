import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/admin/AdminTable';
import ImageUpload from '../components/admin/ImageUpload';
import { 
    PhotoIcon, PlusIcon, TrashIcon, EyeIcon, 
    MagnifyingGlassIcon, FunnelIcon, CloudArrowUpIcon,
    DocumentIcon, CalendarIcon, FolderIcon
} from '@heroicons/react/24/outline';
import imageUploadService, { ImageUploadResult } from '../services/imageUploadService';
import { isImgBBConfigured } from '../config/imgbbConfig';

interface MediaItem {
    id: string;
    url: string;
    thumbnail: string;
    filename: string;
    size: number;
    type: string;
    folder: string;
    uploadedAt: string;
    deleteUrl?: string;
}

const AdminMedia: React.FC = () => {
    const { data, saveData } = useData();
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [folderFilter, setFolderFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Charger les médias depuis le contexte
    useEffect(() => {
        if (data?.mediaItems) {
            setMediaItems(data.mediaItems);
        }
    }, [data?.mediaItems]);

    // Filtrage des médias
    const filteredMedia = mediaItems.filter(item => {
        const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.folder.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFolder = folderFilter === 'all' || item.folder === folderFilter;
        const matchesType = typeFilter === 'all' || item.type.startsWith(typeFilter);
        
        return matchesSearch && matchesFolder && matchesType;
    });

    // Obtenir les dossiers uniques
    const folders = Array.from(new Set(mediaItems.map(item => item.folder))).sort();

    // Obtenir les types uniques
    const types = Array.from(new Set(mediaItems.map(item => item.type.split('/')[0]))).sort();

    // Colonnes pour le tableau
    const columns = [
        {
            key: 'thumbnail',
            label: 'Aperçu',
            render: (value: any, item: MediaItem) => (
                <div className="w-16 h-16 bg-pm-off-white/5 rounded-lg overflow-hidden border border-pm-gold/20">
                    {item.type.startsWith('image/') ? (
                        <img 
                            src={item.thumbnail || item.url} 
                            alt={item.filename}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <DocumentIcon className="w-8 h-8 text-pm-gold/50" />
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'filename',
            label: 'Nom du fichier',
            render: (value: any, item: MediaItem) => (
                <div>
                    <div className="font-semibold text-pm-off-white truncate max-w-xs" title={item.filename}>
                        {item.filename}
                    </div>
                    <div className="text-sm text-pm-off-white/60">
                        {item.folder}
                    </div>
                </div>
            )
        },
        {
            key: 'type',
            label: 'Type',
            render: (value: any, item: MediaItem) => (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-pm-gold/20 text-pm-gold border border-pm-gold/30">
                    {item.type.split('/')[0].toUpperCase()}
                </span>
            )
        },
        {
            key: 'size',
            label: 'Taille',
            render: (value: any, item: MediaItem) => (
                <span className="text-sm text-pm-off-white/70">
                    {(item.size / 1024 / 1024).toFixed(2)} MB
                </span>
            )
        },
        {
            key: 'uploadedAt',
            label: 'Uploadé le',
            render: (value: any, item: MediaItem) => (
                <span className="text-sm text-pm-off-white/70">
                    {new Date(item.uploadedAt).toLocaleDateString('fr-FR')}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, item: MediaItem) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.open(item.url, '_blank')}
                        className="p-2 text-blue-400/70 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                        title="Ouvrir"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title="Supprimer"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Handlers
    const handleUpload = async (result: ImageUploadResult) => {
        if (!result.success || !result.data) return;

        const newItem: MediaItem = {
            id: result.data.id,
            url: result.data.url,
            thumbnail: result.data.medium?.url || result.data.url,
            filename: result.data.image.filename,
            size: parseInt(result.data.size),
            type: result.data.image.mime,
            folder: result.data.folder || 'general',
            uploadedAt: new Date().toISOString(),
            deleteUrl: result.data.delete_url
        };

        const updatedItems = [...mediaItems, newItem];
        setMediaItems(updatedItems);

        if (data) {
            await saveData({ ...data, mediaItems: updatedItems });
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            const item = mediaItems.find(i => i.id === itemId);
            
            // Supprimer de ImgBB si possible
            if (item?.deleteUrl) {
                try {
                    await imageUploadService.deleteImage(item.deleteUrl);
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                }
            }

            const updatedItems = mediaItems.filter(i => i.id !== itemId);
            setMediaItems(updatedItems);

            if (data) {
                await saveData({ ...data, mediaItems: updatedItems });
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) return;
        
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedItems.length} élément(s) ?`)) {
            const itemsToDelete = mediaItems.filter(item => selectedItems.includes(item.id));
            
            // Supprimer de ImgBB
            for (const item of itemsToDelete) {
                if (item.deleteUrl) {
                    try {
                        await imageUploadService.deleteImage(item.deleteUrl);
                    } catch (error) {
                        console.error('Erreur lors de la suppression:', error);
                    }
                }
            }

            const updatedItems = mediaItems.filter(item => !selectedItems.includes(item.id));
            setMediaItems(updatedItems);
            setSelectedItems([]);

            if (data) {
                await saveData({ ...data, mediaItems: updatedItems });
            }
        }
    };

    const handleSelectItem = (itemId: string) => {
        setSelectedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === filteredMedia.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredMedia.map(item => item.id));
        }
    };

    const stats = imageUploadService.getUsageStats();

    return (
        <AdminLayout 
            title="Gestion des Médias" 
            description="Gérez vos images et fichiers multimédias"
            breadcrumbs={[
                { label: "Médias" }
            ]}
            showSearch={true}
            onSearch={setSearchQuery}
        >
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-pm-gold/10 to-pm-gold/5 border border-pm-gold/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-pm-gold/20 rounded-lg flex items-center justify-center">
                            <PhotoIcon className="w-6 h-6 text-pm-gold" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-pm-gold">{mediaItems.length}</p>
                            <p className="text-sm text-pm-off-white/70">Total fichiers</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <FolderIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-400">{folders.length}</p>
                            <p className="text-sm text-pm-off-white/70">Dossiers</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <DocumentIcon className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-400">
                                {mediaItems.filter(item => item.type.startsWith('image/')).length}
                            </p>
                            <p className="text-sm text-pm-off-white/70">Images</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <CloudArrowUpIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-400">
                                {(mediaItems.reduce((sum, item) => sum + item.size, 0) / 1024 / 1024).toFixed(1)} MB
                            </p>
                            <p className="text-sm text-pm-off-white/70">Stockage utilisé</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres et actions */}
            <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Filtre par dossier */}
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-5 h-5 text-pm-gold" />
                            <select
                                value={folderFilter}
                                onChange={(e) => setFolderFilter(e.target.value)}
                                className="bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white text-sm focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            >
                                <option value="all">Tous les dossiers</option>
                                {folders.map(folder => (
                                    <option key={folder} value={folder}>{folder}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre par type */}
                        <div className="flex items-center gap-2">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white text-sm focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            >
                                <option value="all">Tous les types</option>
                                {types.map(type => (
                                    <option key={type} value={type}>{type.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Actions en lot */}
                        {selectedItems.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                                Supprimer ({selectedItems.length})
                            </button>
                        )}

                        {/* Upload */}
                        <ImageUpload
                            onUpload={handleUpload}
                            folder="admin"
                            multiple={true}
                            maxFiles={10}
                        />
                    </div>
                </div>
            </div>

            {/* Tableau des médias */}
            <AdminTable
                columns={columns}
                data={filteredMedia}
                emptyMessage="Aucun fichier trouvé"
            />

            {/* Informations sur le service */}
            {!isImgBBConfigured() && (
                <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                    <h3 className="text-yellow-400 font-semibold mb-2">Configuration requise</h3>
                    <p className="text-yellow-300 text-sm">
                        Le service d'upload d'images n'est pas configuré. Veuillez définir la variable d'environnement VITE_IMGBB_API_KEY.
                    </p>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminMedia;
