import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Album, Photo } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MultipleImageUpload from '../../components/MultipleImageUpload';

const AdminGallery: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [localAlbums, setLocalAlbums] = useState<Album[]>([]);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const sortedAlbums = [...(data?.albums || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setLocalAlbums(sortedAlbums);
  }, [data?.albums, isInitialized]);

  const handleSave = async (albumToSave: Album) => {
    if (!data) return;
    
    const finalAlbum = {
      ...albumToSave,
      coverImage: albumToSave.photos.find(p => p.url === albumToSave.coverImage)?.url || albumToSave.photos[0]?.url || '',
      updatedAt: new Date().toISOString()
    };

    let updatedAlbums;
    if (isCreating) {
      const newAlbum = {
        ...finalAlbum,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: 'admin'
      };
      updatedAlbums = [newAlbum, ...localAlbums];
    } else {
      updatedAlbums = localAlbums.map(a => a.id === finalAlbum.id ? finalAlbum : a);
    }
    
    await saveData({ ...data, albums: updatedAlbums });
    alert("Album enregistré avec succès !");
    setEditingAlbum(null);
    setIsCreating(false);
  };

  const handleDelete = async (albumId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ?")) {
      if (!data) return;
      const updatedAlbums = localAlbums.filter(a => a.id !== albumId);
      await saveData({ ...data, albums: updatedAlbums });
      alert("Album supprimé.");
    }
  };

  const handleToggleFeatured = async (albumId: string) => {
    if (!data) return;
    const updatedAlbums = localAlbums.map(album => (
      album.id === albumId ? { ...album, featured: !album.featured } : album
    ));
    await saveData({ ...data, albums: updatedAlbums });
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingAlbum({
      id: '', title: '', description: '', theme: '', coverImage: '',
      photos: [], createdAt: '', updatedAt: '', createdBy: '',
      isPublic: true, featured: false, tags: [],
    });
  };

  if (editingAlbum) {
    return <AlbumForm album={editingAlbum} onSave={handleSave} onCancel={() => {setEditingAlbum(null); setIsCreating(false);}} isCreating={isCreating} />;
  }

  return (
    <>
      <SEO title="Admin - Gérer la Galerie" noIndex />
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="admin-page-header">{/* Header... */}</div>
          <div className="admin-section-wrapper !p-0">
            <table className="w-full text-left">{/* Table... */}</table>
          </div>
          {localAlbums.length === 0 && ( <div className="text-center py-12">{/* Empty state... */}</div> )}
        </div>
      </div>
    </>
  );
};

const AlbumForm: React.FC<{ album: Album; onSave: (album: Album) => void; onCancel: () => void; isCreating: boolean; }> = ({ album, onSave, onCancel, isCreating }) => {
  const [formData, setFormData] = useState<Album>(album);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePhotosChange = (photos: Photo[]) => {
    setFormData(prev => ({ ...prev, photos }));
  };

  const handleSetCover = (url: string) => {
    setFormData(prev => ({ ...prev, coverImage: url }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="admin-page-title">{isCreating ? 'Nouvel Album' : 'Modifier l\'Album'}</h1>
        <form onSubmit={handleSubmit} className="admin-section-wrapper space-y-8 mt-6">
          
          {/* --- Section Infos --- */}
          <div className="space-y-6">
            <h2 className="admin-section-title">Informations</h2>
            <FormInput label="Titre" name="title" value={formData.title} onChange={handleChange} required />
            <FormTextArea label="Description" name="description" value={formData.description} onChange={handleChange} />
            <FormInput label="Thème" name="theme" value={formData.theme} onChange={handleChange} required />
          </div>

          {/* --- Section Photos --- */}
          <div className="space-y-6">
            <h2 className="admin-section-title">Photos</h2>
            <MultipleImageUpload photos={formData.photos} onPhotosChange={handlePhotosChange} />
            
            {/* --- Sélection de la couverture --- */}
            {formData.photos.length > 0 && (
                <div>
                    <label className="admin-label">Image de couverture</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-2">
                        {formData.photos.map(photo => (
                            <button type="button" key={photo.id} onClick={() => handleSetCover(photo.url)} className={`relative aspect-square rounded-md overflow-hidden border-4 transition-colors ${formData.coverImage === photo.url ? 'border-pm-gold' : 'border-transparent hover:border-pm-gold/50'}`}>
                                <img src={photo.url} alt={photo.alt || 'cover candidate'} className="w-full h-full object-cover"/>
                                {formData.coverImage === photo.url && <div className="absolute inset-0 bg-pm-dark/60 flex items-center justify-center"><StarIconSolid className="w-6 h-6 text-pm-gold"/></div>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {/* --- Section Détails & Paramètres (simplifié) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="admin-section-title">Détails</h2>
               <FormInput label="Tags (séparés par virgules)" name="tags" value={(formData.tags || []).join(', ')} onChange={e => setFormData({...formData, tags: e.target.value.split(',').map((t:string) => t.trim())})} />
            </div>
            <div className="space-y-6">
              <h2 className="admin-section-title">Paramètres</h2>
              <FormCheckbox label="Rendre public" name="isPublic" checked={!!formData.isPublic} onChange={handleChange} />
              <FormCheckbox label="Mettre en avant" name="featured" checked={!!formData.featured} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-pm-gold/20">
            <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormInput: React.FC<{ label: string; name: string; value: any; onChange: any; type?: string; required?: boolean; }> = ({ label, name, value, onChange, type = "text", required }) => (<div>...</div>);
const FormTextArea: React.FC<{ label: string; name: string; value: any; onChange: any; }> = ({ label, name, value, onChange }) => (<div>...</div>);
const FormCheckbox: React.FC<{ label: string; name: string; checked: boolean; onChange: any; }> = ({ label, name, checked, onChange }) => (<div>...</div>);

export default AdminGallery;
