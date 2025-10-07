import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (userId: string, userName: string, userRole: string) => void;
  currentUserId: string;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartConversation,
  currentUserId 
}) => {
  const { data } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'models' | 'students' | 'admins'>('all');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  // Récupérer tous les utilisateurs depuis le DataContext
  const allUsers = React.useMemo(() => {
    if (!data) return [];
    
    const users: any[] = [];
    
    // Ajouter les mannequins professionnels
    if (data.models) {
      data.models.forEach((model: any) => {
        users.push({
          id: model.id,
          name: model.name || model.fullName || 'Mannequin',
          email: model.email || '',
          role: 'model',
          status: model.status || 'Pro',
          avatar: model.photo || '',
          category: 'models'
        });
      });
    }
    
    // Ajouter les étudiants débutants
    if (data.beginnerStudents) {
      data.beginnerStudents.forEach((student: any) => {
        users.push({
          id: student.id,
          name: student.name || student.fullName || 'Étudiant',
          email: student.email || '',
          role: 'beginner',
          status: 'Débutant',
          avatar: student.photo || '',
          category: 'students'
        });
      });
    }
    
    // Ajouter les administrateurs (simulé)
    users.push({
      id: 'admin-1',
      name: 'Administrateur Principal',
      email: 'admin@perfectmodels.ga',
      role: 'admin',
      status: 'Admin',
      avatar: '',
      category: 'admins'
    });
    
    // Filtrer l'utilisateur actuel
    return users.filter(user => user.id !== currentUserId);
  }, [data, currentUserId]);

  // Filtrer les utilisateurs selon la recherche et la catégorie
  useEffect(() => {
    let filtered = allUsers;
    
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(user => user.category === selectedCategory);
    }
    
    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(filtered);
  }, [allUsers, searchQuery, selectedCategory]);

  const handleStartConversation = (user: any) => {
    onStartConversation(user.id, user.name, user.role);
    onClose();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'model': return 'bg-pm-gold/20 text-pm-gold';
      case 'beginner': return 'bg-blue-500/20 text-blue-400';
      case 'admin': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'model': return 'Mannequin Pro';
      case 'beginner': return 'Étudiant';
      case 'admin': return 'Administrateur';
      default: return 'Utilisateur';
    }
  };

  const categories = [
    { id: 'all', label: 'Tous', count: allUsers.length },
    { id: 'models', label: 'Mannequins', count: allUsers.filter(u => u.category === 'models').length },
    { id: 'students', label: 'Étudiants', count: allUsers.filter(u => u.category === 'students').length },
    { id: 'admins', label: 'Admins', count: allUsers.filter(u => u.category === 'admins').length }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <PlusIcon className="w-6 h-6" />
              Nouvelle Conversation
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Recherche */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-off-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
            />
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/30'
                    : 'bg-pm-off-white/5 text-pm-off-white/70 border border-pm-off-white/10 hover:bg-pm-off-white/10'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          {/* Liste des utilisateurs */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-pm-off-white/50">
                <UserIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun utilisateur trouvé</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleStartConversation(user)}
                  className="flex items-center space-x-4 p-4 bg-pm-off-white/5 border border-pm-off-white/10 rounded-lg hover:bg-pm-off-white/10 hover:border-pm-gold/30 transition-all cursor-pointer group"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-6 h-6 text-pm-gold" />
                      )}
                    </div>
                    {/* Indicateur de statut en ligne (simulé) */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-pm-dark"></div>
                  </div>

                  {/* Informations utilisateur */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-pm-off-white truncate group-hover:text-pm-gold transition-colors">
                        {user.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <p className="text-sm text-pm-off-white/60 truncate">{user.email}</p>
                    <p className="text-xs text-pm-off-white/40">{user.status}</p>
                  </div>

                  {/* Bouton de conversation */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-pm-gold/20 rounded-full flex items-center justify-center">
                      <PlusIcon className="w-4 h-4 text-pm-gold" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-pm-gold/20 bg-pm-off-white/5">
          <div className="flex items-center justify-between text-sm text-pm-off-white/60">
            <span>{filteredUsers.length} utilisateur(s) trouvé(s)</span>
            <span>Cliquez sur un utilisateur pour démarrer une conversation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
