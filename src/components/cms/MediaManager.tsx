import React, { useState, useRef, useCallback } from 'react';
import {
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ViewListIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  TagIcon,
  CalendarIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  thumbnail?: string;
  size: number;
  dimensions?: { width: number; height: number };
  alt?: string;
  caption?: string;
  tags: string[];
  uploadedAt: string;
  folder?: string;
  metadata?: Record<string, any>;
}

interface MediaManagerProps {
  onSelect?: (item: MediaItem) => void;
  onInsert?: (item: MediaItem) => void;
  multiple?: boolean;
  acceptedTypes?: string[];
  maxSize?: number;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  onSelect,
  onInsert,
  multiple = false,
  acceptedTypes = ['image/*', 'video/*'],
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFolder, setFilterFolder] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - replace with actual API calls
  const mockMediaItems: MediaItem[] = [
    {
      id: '1',
      name: 'hero-image.jpg',
      type: 'image',
      url: '/api/media/hero-image.jpg',
      thumbnail: '/api/media/thumbnails/hero-image.jpg',
      size: 2048000,
      dimensions: { width: 1920, height: 1080 },
      alt: 'Image principale du site',
      caption: 'Belle image de mannequin',
      tags: ['hero', 'mannequin', 'fashion'],
      uploadedAt: '2024-01-15T10:30:00Z',
      folder: 'images'
    },
    {
      id: '2',
      name: 'video-presentation.mp4',
      type: 'video',
      url: '/api/media/video-presentation.mp4',
      thumbnail: '/api/media/thumbnails/video-presentation.jpg',
      size: 15728640,
      dimensions: { width: 1280, height: 720 },
      alt: 'Vidéo de présentation',
      caption: 'Présentation de l\'agence',
      tags: ['video', 'presentation', 'agency'],
      uploadedAt: '2024-01-14T15:45:00Z',
      folder: 'videos'
    }
  ];

  const folders = ['images', 'videos', 'documents', 'audio'];

  const filteredItems = mediaItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesFolder = filterFolder === 'all' || item.folder === filterFolder;
      return matchesSearch && matchesType && matchesFolder;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file
      if (maxSize && file.size > maxSize) {
        alert(`Le fichier ${file.name} est trop volumineux (max: ${maxSize / 1024 / 1024}MB)`);
        continue;
      }

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create media item
      const newItem: MediaItem = {
        id: `media-${Date.now()}-${i}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 
              file.type.startsWith('audio/') ? 'audio' : 'document',
        url: URL.createObjectURL(file),
        size: file.size,
        tags: [],
        uploadedAt: new Date().toISOString(),
        folder: 'uploads'
      };

      setMediaItems(prev => [...prev, newItem]);
    }

    setIsUploading(false);
    setUploadProgress(0);
    setShowUploadModal(false);
  }, [maxSize]);

  const handleItemSelect = (item: MediaItem) => {
    if (multiple) {
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      setSelectedItems([item.id]);
      onSelect?.(item);
    }
  };

  const handleItemInsert = (item: MediaItem) => {
    onInsert?.(item);
  };

  const handleItemEdit = (item: MediaItem) => {
    setEditingItem(item);
  };

  const handleItemDelete = (itemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="media-manager">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pm-gold">Gestionnaire de Médias</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 bg-pm-gold/20 text-pm-gold rounded hover:bg-pm-gold/30"
          >
            {viewMode === 'grid' ? <ViewListIcon className="w-5 h-5" /> : <ViewColumnsIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black rounded hover:bg-pm-gold/90"
          >
            <CloudArrowUpIcon className="w-5 h-5" />
            Upload
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-off-white/50" />
          <input
            type="text"
            placeholder="Rechercher des médias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded-lg focus:border-pm-gold focus:outline-none"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded-lg focus:border-pm-gold focus:outline-none"
        >
          <option value="all">Tous les types</option>
          <option value="image">Images</option>
          <option value="video">Vidéos</option>
          <option value="document">Documents</option>
          <option value="audio">Audio</option>
        </select>

        <select
          value={filterFolder}
          onChange={(e) => setFilterFolder(e.target.value)}
          className="px-4 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded-lg focus:border-pm-gold focus:outline-none"
        >
          <option value="all">Tous les dossiers</option>
          {folders.map(folder => (
            <option key={folder} value={folder}>{folder}</option>
          ))}
        </select>

        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split('-');
            setSortBy(sort as any);
            setSortOrder(order as any);
          }}
          className="px-4 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded-lg focus:border-pm-gold focus:outline-none"
        >
          <option value="date-desc">Plus récent</option>
          <option value="date-asc">Plus ancien</option>
          <option value="name-asc">Nom A-Z</option>
          <option value="name-desc">Nom Z-A</option>
          <option value="size-desc">Plus volumineux</option>
          <option value="size-asc">Moins volumineux</option>
        </select>
      </div>

      {/* Media Grid/List */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}`}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
              selectedItems.includes(item.id) 
                ? 'ring-2 ring-pm-gold bg-pm-gold/10' 
                : 'hover:bg-black/20'
            }`}
            onClick={() => handleItemSelect(item)}
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-black/30 flex items-center justify-center">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.alt || item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-pm-off-white/50">
                  {item.type === 'image' && <PhotoIcon className="w-8 h-8" />}
                  {item.type === 'video' && <VideoCameraIcon className="w-8 h-8" />}
                  {item.type === 'document' && <DocumentIcon className="w-8 h-8" />}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2">
              <p className="text-sm text-pm-off-white truncate" title={item.name}>
                {item.name}
              </p>
              <p className="text-xs text-pm-off-white/50">
                {formatFileSize(item.size)}
              </p>
              {item.dimensions && (
                <p className="text-xs text-pm-off-white/50">
                  {item.dimensions.width}×{item.dimensions.height}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemInsert(item);
                }}
                className="p-1 bg-pm-gold/20 text-pm-gold rounded hover:bg-pm-gold/30"
                title="Insérer"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemEdit(item);
                }}
                className="p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                title="Éditer"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemDelete(item.id);
                }}
                className="p-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                title="Supprimer"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-pm-dark p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-pm-gold mb-4">Upload de fichiers</h3>
            
            <div className="border-2 border-dashed border-pm-gold/30 rounded-lg p-8 text-center">
              <CloudArrowUpIcon className="w-12 h-12 text-pm-gold/50 mx-auto mb-4" />
              <p className="text-pm-off-white/70 mb-4">
                Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-pm-gold text-black rounded hover:bg-pm-gold/90"
              >
                Sélectionner des fichiers
              </button>
            </div>

            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className="bg-pm-gold h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-pm-off-white/70 mt-2">
                  Upload en cours... {uploadProgress}%
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded hover:bg-gray-500/30"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-pm-dark p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-pm-gold mb-4">Éditer le média</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-pm-off-white/70 mb-1">Nom</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-pm-off-white/70 mb-1">Texte alternatif</label>
                <input
                  type="text"
                  value={editingItem.alt || ''}
                  onChange={(e) => setEditingItem({...editingItem, alt: e.target.value})}
                  className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-pm-off-white/70 mb-1">Légende</label>
                <input
                  type="text"
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({...editingItem, caption: e.target.value})}
                  className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-pm-off-white/70 mb-1">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={editingItem.tags.join(', ')}
                  onChange={(e) => setEditingItem({...editingItem, tags: e.target.value.split(',').map(tag => tag.trim())})}
                  className="w-full px-3 py-2 bg-black/50 text-pm-off-white border border-pm-gold/30 rounded focus:border-pm-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded hover:bg-gray-500/30"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setMediaItems(prev => prev.map(item => 
                    item.id === editingItem.id ? editingItem : item
                  ));
                  setEditingItem(null);
                }}
                className="px-4 py-2 bg-pm-gold text-black rounded hover:bg-pm-gold/90"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager;