import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Album, Photo } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  StarIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MultipleImageUpload from '../components/MultipleImageUpload';

const AdminGallery: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [localAlbums, setLocalAlbums] = useState<Album[]>([]);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (data?.albums) {
      setLocalAlbums([...data.albums].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [data?.albums, isInitialized]);

  const handleSave = async (album: Album) => {
    if (!data) return;
    
    let updatedAlbums;
    if (isCreating) {
      const newAlbum = {
        ...album,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin' // TODO: Get from current user
      };
      updatedAlbums = [newAlbum, ...localAlbums];
    } else {
      updatedAlbums = localAlbums.map(a => a.id === album.id ? { ...album, updatedAt: new Date().toISOString() } : a);
    }
    
    await saveData({ ...data, albums: updatedAlbums });
    alert("Album enregistré avec succès.");
    
    setEditingAlbum(null);
    setIsCreating(false);
  };

  const handleDelete = async (albumId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ?")) {
      if (!data) return;
      const updatedAlbums = localAlbums.filter(a => a.id !== albumId);
      await saveData({ ...data, albums: updatedAlbums });
      alert("Album supprimé avec succès.");
    }
  };

  const handleToggleFeatured = async (albumId: string) => {
    if (!data) return;
    const updatedAlbums = localAlbums.map(album => ({
      ...album,
      featured: album.id === albumId ? !album.featured : album.featured
    }));
    await saveData({ ...data, albums: updatedAlbums });
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingAlbum({
      id: '',
      title: '',
      description: '',
      theme: '',
      coverImage: '',
      photos: [],
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      isPublic: true,
      featured: false,
      tags: [],
      location: '',
      date: '',
      models: [],
      stylists: [],
      photographers: []
    });
  };

  if (editingAlbum) {
    return (
      <AlbumForm 
        album={editingAlbum} 
        onSave={handleSave} 
        onCancel={() => {setEditingAlbum(null); setIsCreating(false);}} 
        isCreating={isCreating}
      />
    );
  }

  return (
    <>
      <SEO title="Admin - Gérer la Galerie" noIndex />
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="admin-page-header">
            <div>
              <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                <ChevronLeftIcon className="w-5 h-5" />
                Retour au Tableau de Bord
              </Link>
              <h1 className="admin-page-title">Gérer la Galerie</h1>
              <p className="admin-page-subtitle">Créez et organisez vos albums photos par thème.</p>
            </div>
            <button onClick={handleStartCreate} className="action-btn">
              <PlusIcon className="w-5 h-5" />
              Nouvel Album
            </button>
          </div>

          <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-pm-dark/50">
                  <tr className="border-b border-pm-gold/20">
                    <th className="p-4 uppercase text-xs tracking-wider">Album</th>
                    <th className="p-4 uppercase text-xs tracking-wider hidden sm:table-cell">Thème</th>
                    <th className="p-4 uppercase text-xs tracking-wider hidden sm:table-cell">Photos</th>
                    <th className="p-4 uppercase text-xs tracking-wider hidden sm:table-cell">Date</th>
                    <th className="p-4 uppercase text-xs tracking-wider">Statut</th>
                    <th className="p-4 uppercase text-xs tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {localAlbums.map(album => (
                    <tr key={album.id} className="border-b border-pm-dark hover:bg-pm-dark/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={album.coverImage}
                            alt={album.title}
                            className="w-12 h-12 object-cover rounded border border-pm-gold/20"
                          />
                          <div>
                            <p className="font-semibold text-pm-off-white">{album.title}</p>
                            <p className="text-sm text-pm-off-white/60 line-clamp-1">{album.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded">
                          {album.theme}
                        </span>
                      </td>
                      <td className="p-4 hidden sm:table-cell text-pm-off-white/60">
                        {album.photos.length}
                      </td>
                      <td className="p-4 hidden sm:table-cell text-pm-off-white/60">
                        {new Date(album.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            album.isPublic 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {album.isPublic ? 'Public' : 'Privé'}
                          </span>
                          {album.featured && (
                            <StarIconSolid className="w-4 h-4 text-pm-gold" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleFeatured(album.id)}
                            className={`p-2 rounded transition-colors ${
                              album.featured 
                                ? 'text-pm-gold hover:bg-pm-gold/10' 
                                : 'text-pm-off-white/60 hover:text-pm-gold hover:bg-pm-gold/10'
                            }`}
                            title={album.featured ? 'Retirer des favoris' : 'Mettre en favori'}
                          >
                            <StarIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingAlbum(album)}
                            className="p-2 text-pm-gold/80 hover:text-pm-gold hover:bg-pm-gold/10 rounded transition-colors"
                            title="Modifier"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(album.id)}
                            className="p-2 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                            title="Supprimer"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {localAlbums.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-pm-gold/10 rounded-full flex items-center justify-center">
                <EyeIcon className="w-12 h-12 text-pm-gold" />
              </div>
              <h3 className="text-xl font-semibold text-pm-off-white mb-2">
                Aucun album créé
              </h3>
              <p className="text-pm-off-white/60 mb-6">
                Commencez par créer votre premier album photo.
              </p>
              <button onClick={handleStartCreate} className="action-btn">
                <PlusIcon className="w-5 h-5" />
                Créer un Album
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const AlbumForm: React.FC<{
  album: Album;
  onSave: (album: Album) => void;
  onCancel: () => void;
  isCreating: boolean;
}> = ({ album, onSave, onCancel, isCreating }) => {
  const [formData, setFormData] = useState<Album>(album);
  const [photos, setPhotos] = useState<Photo[]>(album.photos || []);

  useEffect(() => {
    setFormData(album);
    setPhotos(album.photos || []);
  }, [album]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleModelsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const models = e.target.value.split(',').map(model => model.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, models }));
  };

  const handlePhotosChange = (imageUrls: string[]) => {
    const newPhotos: Photo[] = imageUrls.map((url, index) => ({
      id: `photo_${Date.now()}_${index}`,
      url,
      title: `Photo ${index + 1}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'admin',
      featured: false
    }));
    setPhotos(newPhotos);
    
    // Set cover image if not already set
    if (!formData.coverImage && newPhotos.length > 0) {
      setFormData(prev => ({ ...prev, coverImage: newPhotos[0].url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, photos });
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="admin-page-header !mb-8">
          <div>
            <h1 className="admin-page-title">
              {isCreating ? 'Nouvel Album' : 'Modifier l\'Album'}
            </h1>
            <p className="admin-page-subtitle">
              Remplissez les informations pour créer ou modifier un album photo.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-section-wrapper space-y-8">
          <div className="space-y-6">
            <h2 className="admin-section-title">Informations Principales</h2>
            <FormInput 
              label="Titre de l'album" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required
            />
            <FormTextArea 
              label="Description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={3}
            />
            <FormInput 
              label="Thème" 
              name="theme" 
              value={formData.theme} 
              onChange={handleChange} 
              placeholder="ex: Mode Élégante, Shooting Nature, etc."
              required
            />
          </div>

          <div className="space-y-6">
            <h2 className="admin-section-title">Photos</h2>
            <div>
              <label className="admin-label">Photos de l'album</label>
              <MultipleImageUpload
                images={photos.map(p => p.url)}
                onImagesChange={handlePhotosChange}
                maxImages={50}
                placeholder="Ajouter des photos à l'album"
              />
            </div>
            <FormInput 
              label="Image de couverture (URL)" 
              name="coverImage" 
              value={formData.coverImage} 
              onChange={handleChange} 
              placeholder="URL de l'image de couverture"
            />
          </div>

          <div className="space-y-6">
            <h2 className="admin-section-title">Détails</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                label="Lieu" 
                name="location" 
                value={formData.location || ''} 
                onChange={handleChange} 
              />
              <FormInput 
                label="Date (AAAA-MM-JJ)" 
                name="date" 
                type="date"
                value={formData.date || ''} 
                onChange={handleChange} 
              />
            </div>
            <FormInput 
              label="Tags (séparés par des virgules)" 
              name="tags" 
              value={(formData.tags || []).join(', ')} 
              onChange={handleTagsChange} 
              placeholder="ex: mode, élégance, nature, studio"
            />
            <FormInput 
              label="Mannequins (IDs séparés par des virgules)" 
              name="models" 
              value={(formData.models || []).join(', ')} 
              onChange={handleModelsChange} 
              placeholder="ex: model1, model2, model3"
            />
          </div>

          <div className="space-y-6">
            <h2 className="admin-section-title">Paramètres</h2>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={!!formData.isPublic}
                onChange={handleChange}
                className="h-5 w-5 rounded bg-pm-dark border-pm-gold text-pm-gold focus:ring-pm-gold"
              />
              <label htmlFor="isPublic" className="admin-label !mb-0">
                Rendre l'album public
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox"
                id="featured"
                name="featured"
                checked={!!formData.featured}
                onChange={handleChange}
                className="h-5 w-5 rounded bg-pm-dark border-pm-gold text-pm-gold focus:ring-pm-gold"
              />
              <label htmlFor="featured" className="admin-label !mb-0">
                Mettre en avant (album vedette)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-pm-gold/20">
            <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">
              Annuler
            </button>
            <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormInput: React.FC<{
  label: string;
  name: string;
  value: any;
  onChange: any;
  type?: string;
  placeholder?: string;
  required?: boolean;
}> = ({ label, name, value, onChange, type = "text", placeholder, required }) => (
  <div>
    <label htmlFor={name} className="admin-label">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input 
      type={type} 
      id={name}
      name={name}
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      className="admin-input" 
    />
  </div>
);

const FormTextArea: React.FC<{
  label: string;
  name: string;
  value: any;
  onChange: any;
  rows?: number;
  placeholder?: string;
}> = ({ label, name, value, onChange, rows = 3, placeholder }) => (
  <div>
    <label htmlFor={name} className="admin-label">{label}</label>
    <textarea 
      id={name}
      name={name}
      value={value} 
      onChange={onChange} 
      rows={rows}
      placeholder={placeholder}
      className="admin-input admin-textarea" 
    />
  </div>
);

export default AdminGallery;
