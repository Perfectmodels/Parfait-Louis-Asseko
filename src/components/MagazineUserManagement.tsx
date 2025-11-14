import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { MagazineUser, MagazineRole, MagazinePermission } from '../../types';
import SEO from './SEO';
import { 
  UserPlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import ImageUploader from './ImageUploader';

const MagazineUserManagement: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [localUsers, setLocalUsers] = useState<MagazineUser[]>([]);
  const [editingUser, setEditingUser] = useState<MagazineUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<MagazineRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (data?.magazineUsers) {
      setLocalUsers([...data.magazineUsers]);
    }
  }, [data?.magazineUsers, isInitialized]);

  const rolePermissions: Record<MagazineRole, MagazinePermission[]> = {
    'editor-in-chief': [
      'create-article', 'edit-own-article', 'edit-any-article', 'publish-article', 
      'schedule-article', 'delete-article', 'manage-users', 'approve-article', 
      'feature-article', 'manage-calendar', 'access-analytics', 'manage-gallery', 'translate-article'
    ],
    'senior-editor': [
      'create-article', 'edit-own-article', 'edit-any-article', 'publish-article', 
      'schedule-article', 'approve-article', 'feature-article', 'manage-calendar', 
      'access-analytics', 'manage-gallery', 'translate-article'
    ],
    'editor': [
      'create-article', 'edit-own-article', 'edit-any-article', 'schedule-article', 
      'manage-gallery', 'translate-article'
    ],
    'junior-editor': [
      'create-article', 'edit-own-article', 'manage-gallery'
    ],
    'photographer': [
      'manage-gallery', 'create-article'
    ],
    'journalist': [
      'create-article', 'edit-own-article'
    ],
    'contributor': [
      'create-article', 'edit-own-article'
    ],
    'translator': [
      'translate-article'
    ],
    'social-media-manager': [
      'access-analytics', 'feature-article'
    ]
  };

  const filteredUsers = localUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleFormSave = async (userToSave: MagazineUser) => {
    if (!data) return;
    let updatedUsers;

    if (isCreating) {
      userToSave.id = Date.now().toString();
      userToSave.createdAt = new Date().toISOString();
      userToSave.articlesCount = 0;
      userToSave.publishedArticlesCount = 0;
      updatedUsers = [userToSave, ...localUsers];
    } else {
      updatedUsers = localUsers.map(u => u.id === userToSave.id ? userToSave : u);
    }

    await saveData({ ...data, magazineUsers: updatedUsers });
    alert("Utilisateur enregistré avec succès.");

    setEditingUser(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      if (!data) return;
      const updatedUsers = localUsers.filter(u => u.id !== id);
      await saveData({ ...data, magazineUsers: updatedUsers });
      alert("Utilisateur supprimé avec succès.");
    }
  };

  const handleStatusToggle = async (id: string) => {
    if (!data) return;
    const updatedUsers = localUsers.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive } : u
    );
    await saveData({ ...data, magazineUsers: updatedUsers });
  };

  const getRoleLabel = (role: MagazineRole) => {
    const labels: Record<MagazineRole, string> = {
      'editor-in-chief': 'Rédacteur en chef',
      'senior-editor': 'Rédacteur senior',
      'editor': 'Rédacteur',
      'junior-editor': 'Rédacteur junior',
      'photographer': 'Photographe',
      'journalist': 'Journaliste',
      'contributor': 'Contributeur',
      'translator': 'Traducteur',
      'social-media-manager': 'Manager réseaux sociaux'
    };
    return labels[role];
  };

  const getPermissionLabel = (permission: MagazinePermission) => {
    const labels: Record<MagazinePermission, string> = {
      'create-article': 'Créer des articles',
      'edit-own-article': 'Modifier ses articles',
      'edit-any-article': 'Modifier tous les articles',
      'publish-article': 'Publier des articles',
      'schedule-article': 'Programmer des articles',
      'delete-article': 'Supprimer des articles',
      'manage-users': 'Gérer les utilisateurs',
      'approve-article': 'Approuver des articles',
      'feature-article': 'Mettre en avant',
      'manage-calendar': 'Gérer le calendrier',
      'access-analytics': 'Accéder aux analytics',
      'manage-gallery': 'Gérer les galeries',
      'translate-article': 'Traduire des articles'
    };
    return labels[permission];
  };

  const UserForm: React.FC<{ user?: MagazineUser; onSave: (user: MagazineUser) => void; onCancel: () => void }> = ({ 
    user, onSave, onCancel 
  }) => {
    const [formData, setFormData] = useState<MagazineUser>(
      user || {
        id: '',
        name: '',
        email: '',
        username: '',
        role: 'contributor',
        avatar: '',
        bio: '',
        specializations: [],
        isActive: true,
        permissions: rolePermissions['contributor'],
        createdAt: '',
        articlesCount: 0,
        publishedArticlesCount: 0,
        socialLinks: {}
      }
    );

    const [selectedPermissions, setSelectedPermissions] = useState<MagazinePermission[]>(
      user?.permissions || rolePermissions['contributor']
    );

    const handleRoleChange = (role: MagazineRole) => {
      setFormData({ ...formData, role });
      setSelectedPermissions(rolePermissions[role]);
    };

    const handlePermissionToggle = (permission: MagazinePermission) => {
      const newPermissions = selectedPermissions.includes(permission)
        ? selectedPermissions.filter(p => p !== permission)
        : [...selectedPermissions, permission];
      setSelectedPermissions(newPermissions);
      setFormData({ ...formData, permissions: newPermissions });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ ...formData, permissions: selectedPermissions });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-black border border-pm-gold/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold text-pm-gold mb-6">
            {user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-pm-off-white text-sm font-medium mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-pm-off-white text-sm font-medium mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-pm-off-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-pm-off-white text-sm font-medium mb-2">
                  Rôle
                </label>
                <select
                  className="w-full px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as MagazineRole)}
                >
                  {Object.keys(rolePermissions).map((role) => (
                    <option key={role} value={role}>
                      {getRoleLabel(role as MagazineRole)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-pm-off-white text-sm font-medium mb-2">
                Biographie
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-pm-off-white text-sm font-medium mb-2">
                Spécialisations
              </label>
              <input
                type="text"
                placeholder="Mode, Beauté, Photographie..."
                className="w-full px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                value={formData.specializations?.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  specializations: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
              />
            </div>
            
            <div>
              <label className="block text-pm-off-white text-sm font-medium mb-2">
                Avatar
              </label>
              <ImageUploader
                onImageSelect={(url) => setFormData({ ...formData, avatar: url })}
                currentImage={formData.avatar}
                aspectRatio="1:1"
              />
            </div>
            
            <div>
              <label className="block text-pm-off-white text-sm font-medium mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {Object.keys(rolePermissions).map((role) => (
                  <div key={role} className="space-y-1">
                    <h4 className="text-pm-gold font-medium">{getRoleLabel(role as MagazineRole)}</h4>
                    {rolePermissions[role as MagazineRole].map((permission) => (
                      <label key={permission} className="flex items-center text-xs text-pm-off-white/70">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                          className="mr-2"
                        />
                        {getPermissionLabel(permission)}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-pm-off-white">
                Compte actif
              </label>
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-pm-gold text-black font-medium rounded-lg hover:bg-pm-gold/80 transition-colors"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-pm-dark border border-pm-gold/20 text-pm-off-white rounded-lg hover:border-pm-gold transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO 
        title="Gestion des utilisateurs du magazine" 
        description="Gérez les utilisateurs et permissions du magazine Perfect Models" 
      />
      
      <div className="min-h-screen bg-black text-pm-off-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-pm-gold mb-2">
                Gestion des utilisateurs
              </h1>
              <p className="text-pm-off-white/70">
                Gérez les comptes et permissions des contributeurs du magazine
              </p>
            </div>
            
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingUser(null);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-pm-gold text-black font-medium rounded-lg hover:bg-pm-gold/80 transition-colors"
            >
              <UserPlusIcon className="w-5 h-5" />
              Ajouter un utilisateur
            </button>
          </div>
          
          <div className="bg-black border border-pm-gold/20 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-off-white/50" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as MagazineRole | 'all')}
              >
                <option value="all">Tous les rôles</option>
                {Object.keys(rolePermissions).map((role) => (
                  <option key={role} value={role}>
                    {getRoleLabel(role as MagazineRole)}
                  </option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-black border border-pm-gold/20 rounded-xl p-6 hover:border-pm-gold/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="w-6 h-6 text-pm-gold" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-pm-off-white">{user.name}</h3>
                      <p className="text-sm text-pm-gold">@{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user.isActive ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-pm-off-white/70">
                    <EnvelopeIcon className="w-4 h-4" />
                    {user.email}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheckIcon className="w-4 h-4 text-pm-gold" />
                    {getRoleLabel(user.role)}
                  </div>
                  
                  {user.specializations && user.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.specializations.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-pm-off-white/50 mb-4">
                  <div>Articles: {user.articlesCount}</div>
                  <div>Publiés: {user.publishedArticlesCount}</div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setIsCreating(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-pm-gold/20 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Modifier
                  </button>
                  
                  <button
                    onClick={() => handleStatusToggle(user.id)}
                    className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                      user.isActive 
                        ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                        : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                    }`}
                  >
                    {user.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 text-pm-gold/20 mx-auto mb-4" />
              <p className="text-pm-off-white/50">
                Aucun utilisateur trouvé pour les filtres actuels
              </p>
            </div>
          )}
        </div>
        
        {(isCreating || editingUser) && (
          <UserForm
            user={editingUser || undefined}
            onSave={handleFormSave}
            onCancel={() => {
              setIsCreating(false);
              setEditingUser(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default MagazineUserManagement;
