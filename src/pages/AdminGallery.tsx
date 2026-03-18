import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, PhotoIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { GalleryCategory, GalleryItem, GalleryMediaType } from '../types';
import { uploadToCloudinary, validateFile } from '../utils/cloudinaryService';

const CATEGORIES: GalleryCategory[] = [
  'Défilés',
  'Shootings Photo',
  'Campagnes Publicitaires',
  'Fashion Day',
  'Collaborations',
  'Entraînements',
  'Backstage',
  'Lookbook',
  'Événements',
  'Presse & Médias',
  'Autres',
];

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

const AdminGallery: React.FC = () => {
  const { data, saveData } = useData();
  const [activeTab, setActiveTab] = useState<GalleryCategory | 'Tout'>('Tout');
  const [uploadCategory, setUploadCategory] = useState<GalleryCategory>('Prestations');
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [captionMap, setCaptionMap] = useState<Record<string, string>>({});
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gallery = data?.gallery ?? [];
  const filtered = activeTab === 'Tout' ? gallery : gallery.filter(i => i.category === activeTab);

  const handleFiles = async (files: FileList) => {
    const arr = Array.from(files);
    for (const file of arr) {
      const error = validateFile(file, 'auto');
      const uid = `${Date.now()}-${file.name}`;
      if (error) {
        setUploading(p => [...p, { id: uid, name: file.name, progress: 0, error }]);
        continue;
      }
      setUploading(p => [...p, { id: uid, name: file.name, progress: 0 }]);
      try {
        const mediaType: GalleryMediaType = file.type.startsWith('video/') ? 'video' : 'image';
        const result = await uploadToCloudinary(file, mediaType === 'video' ? 'video' : 'image', 'gallery', (pct) => {
          setUploading(p => p.map(u => u.id === uid ? { ...u, progress: pct } : u));
        });
        const newItem: GalleryItem = {
          id: `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url: result.secure_url,
          publicId: result.public_id,
          mediaType,
          category: uploadCategory,
          thumbnailUrl: mediaType === 'video'
            ? result.secure_url.replace('/upload/', '/upload/so_0,w_400/').replace(/\.\w+$/, '.jpg')
            : undefined,
          createdAt: new Date().toISOString(),
        };
        if (data) {
          await saveData({ ...data, gallery: [newItem, ...(data.gallery ?? [])] });
        }
        setUploading(p => p.filter(u => u.id !== uid));
      } catch (e: any) {
        setUploading(p => p.map(u => u.id === uid ? { ...u, error: e.message ?? 'Erreur upload' } : u));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    if (!data || !window.confirm('Supprimer ce média ?')) return;
    await saveData({ ...data, gallery: data.gallery.filter(i => i.id !== id) });
  };

  const handleSaveCaption = async (item: GalleryItem) => {
    if (!data) return;
    const caption = captionMap[item.id] ?? item.caption ?? '';
    await saveData({
      ...data,
      gallery: data.gallery.map(i => i.id === item.id ? { ...i, caption } : i),
    });
    setCaptionMap(p => { const n = { ...p }; delete n[item.id]; return n; });
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Galerie" noIndex />
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Header */}
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
              <ChevronLeftIcon className="w-5 h-5" /> Retour au Tableau de Bord
            </Link>
            <h1 className="admin-page-title">Galerie Média</h1>
            <p className="admin-page-subtitle">Gérez les photos et vidéos de vos prestations, collaborations et entraînements.</p>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="action-btn !flex !items-center !gap-2">
            <PlusIcon className="w-5 h-5" /> Ajouter des médias
          </button>
        </div>

        {/* Upload zone */}
        <div className="admin-section-wrapper mb-8 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
            <div>
              <label className="admin-label">Catégorie d'upload</label>
              <select
                value={uploadCategory}
                onChange={e => setUploadCategory(e.target.value as GalleryCategory)}
                className="admin-input !w-auto"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div
            className="border-2 border-dashed border-white/10 hover:border-pm-gold/40 rounded-sm p-10 text-center cursor-pointer transition-colors"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <PhotoIcon className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Glissez vos photos/vidéos ici ou cliquez pour sélectionner</p>
            <p className="text-white/20 text-xs mt-1">JPG, PNG, WEBP (max 10 Mo) · MP4, MOV (max 100 Mo)</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)}
          />

          {/* Upload progress */}
          {uploading.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploading.map(u => (
                <div key={u.id} className="flex items-center gap-3">
                  <span className="text-xs text-white/50 truncate flex-1">{u.name}</span>
                  {u.error ? (
                    <span className="text-xs text-red-400">{u.error}</span>
                  ) : (
                    <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-pm-gold transition-all" style={{ width: `${u.progress}%` }} />
                    </div>
                  )}
                  <button onClick={() => setUploading(p => p.filter(x => x.id !== u.id))}>
                    <XMarkIcon className="w-4 h-4 text-white/30 hover:text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/5 mb-8 overflow-x-auto">
          {(['Tout', ...CATEGORIES] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 -mb-px transition-all ${
                activeTab === tab ? 'border-pm-gold text-pm-gold' : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              {tab}
              <span className="ml-2 text-white/20">
                {tab === 'Tout' ? gallery.length : gallery.filter(i => i.category === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-white/20 text-sm">Aucun média dans cette catégorie.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map(item => (
              <div key={item.id} className="group relative bg-white/5 rounded-sm overflow-hidden">
                {/* Thumbnail */}
                <div className="aspect-square cursor-pointer" onClick={() => setLightbox(item)}>
                  {item.mediaType === 'video' ? (
                    <div className="w-full h-full relative bg-black/40">
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PlayIcon className="w-8 h-8 text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-9 h-9 rounded-full bg-pm-gold/80 flex items-center justify-center">
                          <PlayIcon className="w-4 h-4 text-pm-dark ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.caption ?? ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>

                {/* Caption input */}
                <div className="p-2 space-y-1">
                  <input
                    type="text"
                    placeholder="Légende..."
                    value={captionMap[item.id] ?? item.caption ?? ''}
                    onChange={e => setCaptionMap(p => ({ ...p, [item.id]: e.target.value }))}
                    onBlur={() => handleSaveCaption(item)}
                    className="w-full bg-transparent text-xs text-white/50 placeholder-white/20 border-b border-white/10 focus:border-pm-gold/50 outline-none py-1"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase tracking-widest text-pm-gold/40">{item.category}</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500/40 hover:text-red-500 transition-colors"
                      aria-label="Supprimer"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white" onClick={() => setLightbox(null)}>
            <XMarkIcon className="w-8 h-8" />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
            {lightbox.mediaType === 'video' ? (
              <video src={lightbox.url} controls autoPlay className="w-full max-h-[85vh] rounded-sm" />
            ) : (
              <img src={lightbox.url} alt={lightbox.caption ?? ''} className="w-full max-h-[85vh] object-contain rounded-sm" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
