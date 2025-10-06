import React, { useState } from 'react';
import SEO from '../../components/SEO';
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
    accessLevel: 'full' as 'full' | 'limited' | 'readonly'
  });

  const models = data?.models || [];
  const beginnerStudents = data?.beginnerStudents || [];

  const allUsers = [
    ...models.map((model: any) => ({ ...model, type: 'model' })),
    ...beginnerStudents.map((student: any) => ({ ...student, type: 'beginner' }))
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: any = {
      id: editingModel?.id || Date.now().toString(),
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      isActive: formData.isActive,
      role: formData.role,
      accessLevel: formData.accessLevel,
      lastLogin: formData.lastLogin || new Date().toISOString(),
      createdAt: editingModel?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedUsers;
    if (editingModel) {
      if (editingModel.type === 'model') {
        updatedUsers = models.map((model: any) => 
          model.id === editingModel.id ? { ...newUser, type: 'model' } : model
        );
        saveData({ ...data!, models: updatedUsers });
      } else {
        updatedUsers = beginnerStudents.map((student: any) => 
          student.id === editingModel.id ? { ...newUser, type: 'beginner' } : student
        );
        saveData({ ...data!, beginnerStudents: updatedUsers });
      }
    } else {
      // Créer un nouvel utilisateur
      if (formData.role === 'model') {
        const updatedModels = [...models, { ...newUser, type: 'model' }];
        saveData({ ...data!, models: updatedModels });
      } else {
        const updatedStudents = [...beginnerStudents, { ...newUser, type: 'beginner' }];
        saveData({ ...data!, beginnerStudents: updatedStudents });
      }
    }

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
      accessLevel: 'full'
    });
  };

  const handleEdit = (user: any) => {
    setEditingModel(user);
    setFormData({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '', // Ne pas afficher le mot de passe
      isActive: user.isActive !== false,
      role: user.role || 'model',
      lastLogin: user.lastLogin || '',
      accessLevel: user.accessLevel || 'full'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, type: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      if (type === 'model') {
        const updatedModels = models.filter((model: any) => model.id !== id);
        saveData({ ...data!, models: updatedModels });
      } else {
        const updatedStudents = beginnerStudents.filter((student: any) => student.id !== id);
        saveData({ ...data!, beginnerStudents: updatedStudents });
      }
    }
  };

  const toggleUserStatus = (id: string, type: string, currentStatus: boolean) => {
    if (type === 'model') {
      const updatedModels = models.map((model: any) =>
        model.id === id ? { ...model, isActive: !currentStatus } : model
      );
      saveData({ ...data!, models: updatedModels });
    } else {
      const updatedStudents = beginnerStudents.map((student: any) =>
        student.id === id ? { ...student, isActive: !currentStatus } : student
      );
      saveData({ ...data!, beginnerStudents: updatedStudents });
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'limited': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'readonly': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const getAccessLevelLabel = (level: string) => {
    switch (level) {
      case 'full': return 'Accès complet';
      case 'limited': return 'Accès limité';
      case 'readonly': return 'Lecture seule';
      default: return 'Non défini';
    }
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
      <SEO title="Accès Mannequins" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Accès Mannequins</h1>
            <p className="admin-page-subtitle">Gérer les accès et identifiants des mannequins et étudiants.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Nouvel utilisateur
          </button>
        </header>

        {/* Statistiques */}
        <div className="admin-section-wrapper mb-8">
          <h2 className="admin-section-title">Statistiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-base p-6 text-center">
              <UserIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">{allUsers.length}</h3>
              <p className="text-pm-off-white/70">Total Utilisateurs</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <LockOpenIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">
                {allUsers.filter((user: any) => user.isActive !== false).length}
              </h3>
              <p className="text-pm-off-white/70">Actifs</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <LockClosedIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">
                {allUsers.filter((user: any) => user.isActive === false).length}
              </h3>
              <p className="text-pm-off-white/70">Inactifs</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <KeyIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">
                {allUsers.filter((user: any) => user.accessLevel === 'full').length}
              </h3>
              <p className="text-pm-off-white/70">Accès Complet</p>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Utilisateurs</h2>
          
          {allUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">Aucun utilisateur</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
              >
                Créer le premier utilisateur
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {allUsers.map((user: any, index) => (
                <div key={user.id || index} className="card-base p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-pm-gold">{user.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getAccessLevelColor(user.accessLevel || 'full')}`}>
                          {getAccessLevelLabel(user.accessLevel || 'full')}
                        </span>
                        {user.isActive === false && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/30">
                            Inactif
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Nom d'utilisateur:</strong> {user.username}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Email:</strong> {user.email || 'Non renseigné'}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Téléphone:</strong> {user.phone || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Type:</strong> {user.type === 'model' ? 'Mannequin' : 'Étudiant Débutant'}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Rôle:</strong> {user.role || 'model'}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Dernière connexion:</strong> {formatDate(user.lastLogin)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.type, user.isActive !== false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          user.isActive !== false
                            ? 'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30'
                            : 'bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30'
                        }`}
                      >
                        {user.isActive !== false ? (
                          <>
                            <LockClosedIcon className="w-4 h-4" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <LockOpenIcon className="w-4 h-4" />
                            Activer
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold/20 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/30 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.type)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
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
                {editingModel ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
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
                
                <div>
                  <label className="admin-label">Mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="admin-input"
                    placeholder={editingModel ? "Laisser vide pour ne pas changer" : "Mot de passe"}
                    required={!editingModel}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="admin-label">Type d'utilisateur</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                      className="admin-input"
                    >
                      <option value="model">Mannequin</option>
                      <option value="beginner">Étudiant Débutant</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="admin-label">Niveau d'accès</label>
                    <select
                      value={formData.accessLevel}
                      onChange={(e) => setFormData({...formData, accessLevel: e.target.value as any})}
                      className="admin-input"
                    >
                      <option value="full">Accès complet</option>
                      <option value="limited">Accès limité</option>
                      <option value="readonly">Lecture seule</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="w-4 h-4 text-pm-gold bg-pm-dark border-pm-gold rounded focus:ring-pm-gold focus:ring-2"
                      />
                      <span className="text-pm-off-white">Utilisateur actif</span>
                    </label>
                  </div>
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
                        accessLevel: 'full'
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
