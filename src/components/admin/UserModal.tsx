import React, { useState } from 'react';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  user?: any;
  isEdit?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  user,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    status: user?.status || 'active',
    permissions: user?.permissions || [],
    department: user?.department || '',
    phone: user?.phone || '',
    notes: user?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: 'admin', label: 'Administrateur', color: 'text-red-400' },
    { value: 'manager', label: 'Manager', color: 'text-orange-400' },
    { value: 'user', label: 'Utilisateur', color: 'text-blue-400' },
    { value: 'viewer', label: 'Observateur', color: 'text-gray-400' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Actif', color: 'text-green-400' },
    { value: 'inactive', label: 'Inactif', color: 'text-gray-400' },
    { value: 'suspended', label: 'Suspendu', color: 'text-red-400' }
  ];

  const availablePermissions = [
    { key: 'read_models', label: 'Lire les mannequins' },
    { key: 'write_models', label: 'Modifier les mannequins' },
    { key: 'delete_models', label: 'Supprimer les mannequins' },
    { key: 'read_content', label: 'Lire le contenu' },
    { key: 'write_content', label: 'Modifier le contenu' },
    { key: 'delete_content', label: 'Supprimer le contenu' },
    { key: 'manage_users', label: 'Gérer les utilisateurs' },
    { key: 'view_analytics', label: 'Voir les analytics' },
    { key: 'manage_finance', label: 'Gérer les finances' },
    { key: 'manage_settings', label: 'Gérer les paramètres' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const userData = {
      ...formData,
      id: user?.id || Date.now().toString(),
      createdAt: user?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <UserIcon className="w-6 h-6" />
              {isEdit ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.name ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="Nom complet"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.email ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                placeholder="+241 XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Département
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                placeholder="Département"
              />
            </div>
          </div>

          {/* Rôle et statut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Rôle
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-3">
              Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePermissions.map(permission => (
                <label key={permission.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.key)}
                    onChange={() => handlePermissionChange(permission.key)}
                    className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                  />
                  <span className="text-sm text-pm-off-white">{permission.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              placeholder="Notes sur l'utilisateur..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-pm-gold/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
            >
              {isEdit ? 'Mettre à jour' : 'Créer l\'Utilisateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
