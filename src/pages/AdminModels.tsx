import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import AdminFilterBar from '../components/admin/AdminFilterBar';
import { UserIcon, PlusIcon, TrashIcon, PencilIcon, EyeIcon, EyeSlashIcon, KeyIcon, CameraIcon } from '@heroicons/react/24/outline';

interface ModelFormData {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  age: number;
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hips: number;
  shoeSize: number;
  category: string;
  experience: string;
  photos: string[];
  portfolio: string[];
  isPublic: boolean;
  eyeColor?: string;
  hairColor?: string;
  skinTone?: string;
  languages?: string[];
  skills?: string[];
}

const AdminModels: React.FC = () => {
  const { data, saveData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingModel, setViewingModel] = useState<any | null>(null);
  const [formData, setFormData] = useState<Partial<ModelFormData>>({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    birthDate: '',
    age: 0,
    height: 0,
    weight: 0,
    bust: 0,
    waist: 0,
    hips: 0,
    shoeSize: 0,
    category: '',
    experience: '',
    photos: [],
    portfolio: [],
    isPublic: true,
    eyeColor: '',
    hairColor: '',
    skinTone: '',
    languages: [],
    skills: []
  });

  const models = data?.models || [];

  const filteredModels = models.filter(model => {
    const matchesSearch = searchTerm === '' || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || model.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    const modelData = {
      ...formData,
      id: editingId || Date.now().toString(),
      createdAt: editingId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      const updated = models.map(m => 
        m.id === editingId ? { ...m, ...modelData } : m
      );
      saveData({ ...data, models: updated });
    } else {
      saveData({ ...data, models: [...models, modelData] });
    }
    resetForm();
  };

  const handleEdit = (model: any) => {
    setFormData(model);
    setEditingId(model.id);
    setShowAddForm(true);
    setViewingModel(null);
  };

  const handleView = (model: any) => {
    setViewingModel(model);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (!data) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce mannequin ? Cette action est irréversible.')) {
      const updated = models.filter(m => m.id !== id);
      saveData({ ...data, models: updated });
    }
  };

  const togglePublic = (id: string) => {
    if (!data) return;
    const updated = models.map(m => 
      m.id === id ? { ...m, isPublic: !m.isPublic } : m
    );
    saveData({ ...data, models: updated });
  };

  const generateCredentials = () => {
    const username = formData.name?.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
    const password = Math.random().toString(36).slice(-8);
    setFormData({ ...formData, username, password });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      birthDate: '',
      age: 0,
      height: 0,
      weight: 0,
      bust: 0,
      waist: 0,
      hips: 0,
      shoeSize: 0,
      category: '',
      experience: '',
      photos: [],
      portfolio: [],
      isPublic: true,
      eyeColor: '',
      hairColor: '',
      skinTone: '',
      languages: [],
      skills: []
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const addPhoto = () => {
    const url = prompt('URL de la photo:');
    if (url) {
      setFormData({ ...formData, photos: [...(formData.photos || []), url] });
    }
  };

  const removePhoto = (index: number) => {
    setFormData({ ...formData, photos: formData.photos?.filter((_, i) => i !== index) });
  };

  const CATEGORIES = ['Fashion', 'Commercial', 'Editorial', 'Runway', 'Fitness', 'Plus Size', 'Petite'];
  const EYE_COLORS = ['Marron', 'Vert', 'Bleu', 'Noisette', 'Noir', 'Gris'];
  const HAIR_COLORS = ['Noir', 'Brun', 'Blond', 'Roux', 'Gris', 'Blanc', 'Autre'];
  const SKIN_TONES = ['Très claire', 'Claire', 'Moyenne', 'Mate', 'Foncée', 'Très foncée'];

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Gestion des Mannequins" 
        subtitle="Base de données complète des mannequins professionnels"
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <AdminCard>
          <div className="flex items-center gap-3">
            <UserIcon className="w-8 h-8 text-pm-gold" />
            <div>
              <p className="text-sm text-gray-600">Total Mannequins</p>
              <p className="text-2xl font-bold">{models.length}</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center gap-3">
            <EyeIcon className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Profils Publics</p>
              <p className="text-2xl font-bold">{models.filter(m => m.isPublic).length}</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center gap-3">
            <EyeSlashIcon className="w-8 h-8 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Profils Privés</p>
              <p className="text-2xl font-bold">{models.filter(m => !m.isPublic).length}</p>
            </div>
          </div>
        </AdminCard>
        <AdminCard>
          <div className="flex items-center gap-3">
            <CameraIcon className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Fashion</p>
              <p className="text-2xl font-bold">{models.filter(m => m.category === 'Fashion').length}</p>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminFilterBar
        filters={[
          { label: 'Tous', value: 'all' },
          ...CATEGORIES.map(cat => ({ label: cat, value: cat }))
        ]}
        activeFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher un mannequin..."
      />

      <AdminSection 
        title={`${filteredModels.length} mannequin(s)`}
        action={
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setViewingModel(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
          >
            <PlusIcon className="w-5 h-5" />
            {showAddForm ? 'Annuler' : 'Nouveau Mannequin'}
          </button>
        }
      >
        {/* Formulaire d'ajout/édition */}
        {showAddForm && (
          <AdminCard className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de base */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Informations Personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom Complet *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de Naissance</label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Identifiants */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
                  <KeyIcon className="w-5 h-5" />
                  Identifiants de Connexion
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mot de passe</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={generateCredentials}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Générer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensurations */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Mensurations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Âge</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Taille (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Poids (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pointure</label>
                    <input
                      type="number"
                      value={formData.shoeSize}
                      onChange={(e) => setFormData({ ...formData, shoeSize: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Poitrine (cm)</label>
                    <input
                      type="number"
                      value={formData.bust}
                      onChange={(e) => setFormData({ ...formData, bust: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Taille (cm)</label>
                    <input
                      type="number"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hanches (cm)</label>
                    <input
                      type="number"
                      value={formData.hips}
                      onChange={(e) => setFormData({ ...formData, hips: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Caractéristiques */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Caractéristiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Catégorie *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Couleur des Yeux</label>
                    <select
                      value={formData.eyeColor}
                      onChange={(e) => setFormData({ ...formData, eyeColor: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="">Sélectionner...</option>
                      {EYE_COLORS.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Couleur des Cheveux</label>
                    <select
                      value={formData.hairColor}
                      onChange={(e) => setFormData({ ...formData, hairColor: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="">Sélectionner...</option>
                      {HAIR_COLORS.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teinte de Peau</label>
                    <select
                      value={formData.skinTone}
                      onChange={(e) => setFormData({ ...formData, skinTone: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="">Sélectionner...</option>
                      {SKIN_TONES.map(tone => (
                        <option key={tone} value={tone}>{tone}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
                  <CameraIcon className="w-5 h-5" />
                  Photos
                </h3>
                <div className="space-y-2">
                  {formData.photos?.map((photo, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={photo}
                        onChange={(e) => {
                          const newPhotos = [...(formData.photos || [])];
                          newPhotos[index] = e.target.value;
                          setFormData({ ...formData, photos: newPhotos });
                        }}
                        className="flex-1 px-3 py-2 border rounded"
                        placeholder="URL de la photo"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPhoto}
                    className="px-4 py-2 border border-dashed rounded hover:bg-gray-50"
                  >
                    + Ajouter une photo
                  </button>
                </div>
              </div>

              {/* Expérience */}
              <div>
                <label className="block text-sm font-medium mb-1">Expérience Professionnelle</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                  placeholder="Décrire l'expérience, les collaborations, les marques..."
                />
              </div>

              {/* Visibilité */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Profil visible publiquement</label>
              </div>

              {/* Boutons */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="submit"
                  className="px-6 py-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
                >
                  {editingId ? 'Mettre à jour' : 'Créer le Profil'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </AdminCard>
        )}

        {/* Vue détaillée */}
        {viewingModel && (
          <AdminCard className="mb-6">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{viewingModel.name}</h2>
                  <p className="text-gray-600">{viewingModel.category}</p>
                </div>
                <button
                  onClick={() => setViewingModel(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>

              {viewingModel.photos && viewingModel.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {viewingModel.photos.map((photo: string, index: number) => (
                    <img key={index} src={photo} alt={`Photo ${index + 1}`} className="w-full h-48 object-cover rounded" />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Contact</h3>
                  <p className="text-sm"><span className="text-gray-600">Email:</span> {viewingModel.email}</p>
                  <p className="text-sm"><span className="text-gray-600">Téléphone:</span> {viewingModel.phone || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Identifiants</h3>
                  <p className="text-sm"><span className="text-gray-600">Username:</span> {viewingModel.username || 'N/A'}</p>
                  <p className="text-sm"><span className="text-gray-600">Password:</span> {viewingModel.password || '********'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Mensurations</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <p><span className="text-gray-600">Taille:</span> {viewingModel.height} cm</p>
                  <p><span className="text-gray-600">Poids:</span> {viewingModel.weight} kg</p>
                  <p><span className="text-gray-600">Poitrine:</span> {viewingModel.bust} cm</p>
                  <p><span className="text-gray-600">Taille:</span> {viewingModel.waist} cm</p>
                  <p><span className="text-gray-600">Hanches:</span> {viewingModel.hips} cm</p>
                  <p><span className="text-gray-600">Pointure:</span> {viewingModel.shoeSize}</p>
                </div>
              </div>

              {viewingModel.experience && (
                <div>
                  <h3 className="font-semibold mb-2">Expérience</h3>
                  <p className="text-sm text-gray-700">{viewingModel.experience}</p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(viewingModel)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(viewingModel.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </AdminCard>
        )}

        {/* Liste des mannequins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <AdminCard key={model.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                {model.photos && model.photos[0] && (
                  <img src={model.photos[0]} alt={model.name} className="w-full h-48 object-cover rounded" />
                )}
                
                <div>
                  <h3 className="font-semibold text-lg">{model.name}</h3>
                  <p className="text-sm text-gray-600">{model.category || 'Non catégorisé'}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-600">Taille:</span> {model.height} cm</p>
                  <p><span className="text-gray-600">Âge:</span> {model.age} ans</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className={`px-2 py-1 rounded text-xs ${
                    model.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {model.isPublic ? 'Public' : 'Privé'}
                  </span>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleView(model)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      title="Voir les détails"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => togglePublic(model.id)}
                      className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      title={model.isPublic ? 'Masquer' : 'Publier'}
                    >
                      {model.isPublic ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(model)}
                      className="p-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
                      title="Modifier"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(model.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucun mannequin trouvé</p>
          </div>
        )}
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminModels;
