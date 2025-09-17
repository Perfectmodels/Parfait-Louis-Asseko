import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, PlusIcon, PencilIcon, TrashIcon, 
    UserIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon,
    KeyIcon, MailIcon, PhoneIcon
} from '@heroicons/react/24/outline';
import { AdminUser, AdminPermission } from '../types';

const AdminUserManagement: React.FC = () => {
    const { data, saveData } = useData();
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [newUser, setNewUser] = useState<Partial<AdminUser>>({
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'staff',
        permissions: [],
        isActive: true
    });

    const adminUsers = data?.adminUsers || [];
    const permissions = data?.adminPermissions || [];

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !newUser.username || !newUser.password || !newUser.name) return;

        const user: AdminUser = {
            id: editingUser?.id || `admin-${Date.now()}`,
            username: newUser.username,
            password: newUser.password,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role || 'staff',
            permissions: newUser.permissions || [],
            isActive: newUser.isActive ?? true,
            createdAt: editingUser?.createdAt || new Date().toISOString(),
            createdBy: editingUser?.createdBy || 'admin'
        };

        try {
            let updatedUsers;
            if (editingUser) {
                updatedUsers = adminUsers.map(u => u.id === user.id ? user : u);
            } else {
                updatedUsers = [...adminUsers, user];
            }

            await saveData({ ...data, adminUsers: updatedUsers });
            
            // Reset form
            setNewUser({
                username: '',
                password: '',
                name: '',
                email: '',
                role: 'staff',
                permissions: [],
                isActive: true
            });
            setEditingUser(null);
            setShowUserForm(false);
            
            alert(`Utilisateur ${editingUser ? 'modifié' : 'créé'} avec succès !`);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!data || !window.confirm('Supprimer cet utilisateur ?')) return;
        
        try {
            const updatedUsers = adminUsers.filter(u => u.id !== userId);
            await saveData({ ...data, adminUsers: updatedUsers });
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleEditUser = (user: AdminUser) => {
        setEditingUser(user);
        setNewUser({
            username: user.username,
            password: user.password,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            isActive: user.isActive
        });
        setShowUserForm(true);
    };

    const handlePermissionChange = (permissionId: string, checked: boolean) => {
        if (checked) {
            const permission = permissions.find(p => p.id === permissionId);
            if (permission) {
                setNewUser({
                    ...newUser,
                    permissions: [...(newUser.permissions || []), permission]
                });
            }
        } else {
            setNewUser({
                ...newUser,
                permissions: (newUser.permissions || []).filter(p => p.id !== permissionId)
            });
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/20 text-red-300';
            case 'manager': return 'bg-blue-500/20 text-blue-300';
            case 'staff': return 'bg-green-500/20 text-green-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrateur';
            case 'manager': return 'Gestionnaire';
            case 'staff': return 'Staff';
            default: return role;
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Gestion des Utilisateurs - Perfect Models Management" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Gestion des Utilisateurs</h1>
                        <p className="admin-page-subtitle">Créer et gérer les comptes administrateurs avec permissions personnalisées</p>
                    </div>
                    <button
                        onClick={() => setShowUserForm(true)}
                        className="action-btn bg-pm-gold text-pm-dark hover:bg-white"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nouvel Utilisateur
                    </button>
                </div>

                {/* Liste des utilisateurs */}
                <div className="admin-section-wrapper">
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Utilisateur</th>
                                    <th>Rôle</th>
                                    <th>Permissions</th>
                                    <th>Statut</th>
                                    <th>Dernière connexion</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-pm-gold/20 rounded-full flex items-center justify-center">
                                                    <UserIcon className="w-5 h-5 text-pm-gold" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-pm-off-white">{user.name}</p>
                                                    <p className="text-sm text-pm-off-white/60">@{user.username}</p>
                                                    {user.email && (
                                                        <p className="text-xs text-pm-off-white/50">{user.email}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {user.permissions.slice(0, 3).map(permission => (
                                                    <span key={permission.id} className="px-2 py-1 bg-pm-gold/10 text-pm-gold text-xs rounded">
                                                        {permission.name}
                                                    </span>
                                                ))}
                                                {user.permissions.length > 3 && (
                                                    <span className="px-2 py-1 bg-pm-off-white/10 text-pm-off-white/60 text-xs rounded">
                                                        +{user.permissions.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.isActive 
                                                    ? 'bg-green-500/20 text-green-300' 
                                                    : 'bg-red-500/20 text-red-300'
                                            }`}>
                                                {user.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm text-pm-off-white/60">
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Jamais'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="p-2 text-pm-gold/70 hover:text-pm-gold"
                                                    title="Modifier"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-red-500/70 hover:text-red-500"
                                                    title="Supprimer"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Formulaire de création/modification */}
                {showUserForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold text-pm-gold mb-6">
                                {editingUser ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
                            </h3>
                            
                            <form onSubmit={handleUserSubmit} className="space-y-6">
                                {/* Informations de base */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label">Nom complet</label>
                                        <input
                                            type="text"
                                            value={newUser.name || ''}
                                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                            className="admin-input"
                                            placeholder="Nom complet"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="admin-label">Nom d'utilisateur</label>
                                        <input
                                            type="text"
                                            value={newUser.username || ''}
                                            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                            className="admin-input"
                                            placeholder="nom_utilisateur"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label">Mot de passe</label>
                                        <input
                                            type="password"
                                            value={newUser.password || ''}
                                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                            className="admin-input"
                                            placeholder="Mot de passe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="admin-label">Email (optionnel)</label>
                                        <input
                                            type="email"
                                            value={newUser.email || ''}
                                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                            className="admin-input"
                                            placeholder="email@exemple.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="admin-label">Rôle</label>
                                    <select
                                        value={newUser.role || 'staff'}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'manager' | 'staff'})}
                                        className="admin-input"
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="manager">Gestionnaire</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>

                                {/* Permissions */}
                                <div>
                                    <label className="admin-label">Permissions</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                        {permissions.map(permission => (
                                            <label key={permission.id} className="flex items-start gap-3 p-3 bg-pm-dark/30 rounded-lg border border-pm-gold/10 hover:border-pm-gold/30 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={newUser.permissions?.some(p => p.id === permission.id) || false}
                                                    onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                    className="mt-1 w-4 h-4 text-pm-gold bg-pm-dark border-pm-gold/30 rounded focus:ring-pm-gold focus:ring-2"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-pm-off-white text-sm">{permission.name}</p>
                                                    <p className="text-xs text-pm-off-white/60">{permission.description}</p>
                                                    <div className="flex gap-1 mt-1">
                                                        {permission.actions.map(action => (
                                                            <span key={action} className="px-1 py-0.5 bg-pm-gold/10 text-pm-gold text-xs rounded">
                                                                {action}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUserForm(false);
                                            setEditingUser(null);
                                            setNewUser({
                                                username: '',
                                                password: '',
                                                name: '',
                                                email: '',
                                                role: 'staff',
                                                permissions: [],
                                                isActive: true
                                            });
                                        }}
                                        className="px-6 py-2 border border-pm-gold/50 text-pm-gold rounded-lg hover:bg-pm-gold/10 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-white transition-colors"
                                    >
                                        {editingUser ? 'Modifier' : 'Créer'}
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

export default AdminUserManagement;
