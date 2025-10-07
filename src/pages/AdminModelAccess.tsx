import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon, UserIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

const AdminModelAccess: React.FC = () => {
  const { data, saveData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    isActive: true,
    role: 'model' as 'model' | 'admin' | 'beginner',
    lastLogin: '',
    createdAt: ''
  });

  const models = (data?.models as any[]) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newModel: any = {
      id: editingModel?.id || Date.now().toString(),
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      isActive: formData.isActive,
      role: formData.role,
      lastLogin: editingModel?.lastLogin || null,
      createdAt: editingModel?.createdAt || new Date().toISOString()
    };

    let updatedModels;
    if (editingModel) {
      updatedModels = models.map(model => 
        model.id === editingModel.id ? newModel : model
      );
    } else {
      updatedModels = [...models, newModel];
    }

    saveData({ ...data!, models: updatedModels });
    setIsModalOpen(false);
    setEditingModel(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      isActive: true,
      role: 'model',
      lastLogin: '',
      createdAt: ''
    });
  };

  const handleEdit = (model: any) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      username: model.username,
      email: model.email,
      phone: model.phone,
      password: model.password,
      isActive: model.isActive,
      role: model.role,
      lastLogin: model.lastLogin || '',
      createdAt: model.createdAt || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce mannequin ?')) {
      const updatedModels = models.filter(model => model.id !== id);
      saveData({ ...data!, models: updatedModels });
    }
  };

  const handleToggleActive = (id: string) => {
    const updatedModels = models.map(model =>
      model.id === id ? { ...model, isActive: !model.isActive } : model
    );
    saveData({ ...data!, models: updatedModels });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Accès des Mannequins" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Accès des Mannequins</h1>
            <p className="admin-page-subtitle">Gérez les comptes et accès des mannequins.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Nouveau mannequin
          </button>
        </header>

        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Comptes des Mannequins</h2>
          
          {models.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">Aucun mannequin enregistré</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
              >
                Créer le premier mannequin
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map(model => (
                <div key={model.id} className="card-base p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-pm-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-pm-gold">{model.name}</h3>
                      <p className="text-sm text-pm-off-white/70">@{model.username}</p>
                    </div>
                    <button
                      onClick={() => handleToggleActive(model.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        model.isActive 
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                          : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                      }`}
                      title={model.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {model.isActive ? <LockOpenIcon className="w-5 h-5" /> : <LockClosedIcon className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-pm-off-white/70 mb-4">
                    <p><strong>Email:</strong> {model.email}</p>
                    <p><strong>Téléphone:</strong> {model.phone}</p>
                    <p><strong>Rôle:</strong> <span className="capitalize">{model.role}</span></p>
                    <p><strong>Dernière connexion:</strong> {formatDate(model.lastLogin)}</p>
                    <p><strong>Créé le:</strong> {formatDate(model.createdAt)}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(model)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pm-gold/20 text-pm-gold border border-pm-gold/30 rounded hover:bg-pm-gold/30 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(model.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded hover:bg-red-600/30 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-playfair text-pm-gold mb-6">
                {editingModel ? 'Modifier le mannequin' : 'Nouveau mannequin'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Nom complet</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Nom d'utilisateur</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Mot de passe</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Rôle</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                      className="admin-input"
                    >
                      <option value="model">Mannequin</option>
                      <option value="admin">Administrateur</option>
                      <option value="beginner">Débutant</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-pm-gold bg-black border-pm-gold/30 rounded focus:ring-pm-gold focus:ring-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-pm-off-white/80">
                    Compte actif
                  </label>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
                  >
                    {editingModel ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingModel(null);
                      setFormData({
                        name: '',
                        username: '',
                        email: '',
                        phone: '',
                        password: '',
                        isActive: true,
                        role: 'model',
                        lastLogin: '',
                        createdAt: ''
                      });
                    }}
                    className="flex-1 px-6 py-3 border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-pm-gold/10 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModelAccess;