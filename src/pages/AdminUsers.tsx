import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import AdminPageWrapper from '../components/AdminPageWrapper';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import { 
    UserIcon, 
    PencilIcon, 
    TrashIcon,
    PlusIcon,
    EyeIcon,
    KeyIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Model, BeginnerStudent, UserRole } from '../types';

interface UserFormData {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
    isActive: boolean;
    profileImage?: string;
    bio?: string;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

const AdminUsers: React.FC = () => {
    const { data, saveData } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserFormData | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        id: '',
        name: '',
        email: '',
        phone: '',
        role: 'student',
        password: '',
        isActive: true,
        profileImage: '',
        bio: '',
        socialLinks: {}
    });

    // Combiner tous les utilisateurs
    const allUsers = [
        ...(data?.models || []).map(model => ({
            ...model,
            type: 'model' as const,
            role: 'student' as UserRole,
            email: model.email || '',
            phone: model.phone || '',
            isActive: model.isPublic
        })),
        ...(data?.beginnerStudents || []).map(student => ({
            ...student,
            type: 'beginner' as const,
            role: 'beginner' as UserRole,
            email: student.email || '',
            phone: student.phone || '',
            isActive: true
        }))
    ];

    const filteredUsers = allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({
            id: '',
            name: '',
            email: '',
            phone: '',
            role: 'student',
            password: '',
            isActive: true,
            profileImage: '',
            bio: '',
            socialLinks: {}
        });
        setIsModalOpen(true);
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setFormData({
            id: user.id,
            name: user.name,
            email: user.email || '',
            phone: user.phone || '',
            role: user.role,
            password: '',
            isActive: user.isActive,
            profileImage: user.imageUrl || user.profileImage || '',
            bio: user.bio || user.description || '',
            socialLinks: user.socialLinks || {}
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!data) return;

        const userData = {
            id: formData.id || `user_${Date.now()}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            isActive: formData.isActive,
            imageUrl: formData.profileImage,
            bio: formData.bio,
            socialLinks: formData.socialLinks,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        if (formData.role === 'student') {
            // Créer un modèle
            const newModel: Model = {
                ...userData,
                id: userData.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                imageUrl: userData.imageUrl,
                bio: userData.bio,
                isPublic: userData.isActive,
                level: 'débutant',
                measurements: { height: 0, bust: 0, waist: 0, hips: 0 },
                experience: [],
                achievements: [],
                socialLinks: userData.socialLinks,
                createdAt: userData.createdAt,
                lastLogin: userData.lastLogin
            };

            const updatedModels = editingUser 
                ? data.models.map(m => m.id === editingUser.id ? newModel : m)
                : [...(data.models || []), newModel];

            await saveData({ ...data, models: updatedModels });
        } else if (formData.role === 'beginner') {
            // Créer un étudiant débutant
            const newStudent: BeginnerStudent = {
                ...userData,
                id: userData.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                profileImage: userData.imageUrl,
                bio: userData.bio,
                isActive: userData.isActive,
                progress: 0,
                completedModules: [],
                socialLinks: userData.socialLinks,
                createdAt: userData.createdAt,
                lastLogin: userData.lastLogin
            };

            const updatedStudents = editingUser 
                ? data.beginnerStudents.map(s => s.id === editingUser.id ? newStudent : s)
                : [...(data.beginnerStudents || []), newStudent];

            await saveData({ ...data, beginnerStudents: updatedStudents });
        }

        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleDelete = async (userId: string, userType: string) => {
        if (!data) return;
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            if (userType === 'model') {
                const updatedModels = data.models.filter(m => m.id !== userId);
                await saveData({ ...data, models: updatedModels });
            } else if (userType === 'beginner') {
                const updatedStudents = data.beginnerStudents.filter(s => s.id !== userId);
                await saveData({ ...data, beginnerStudents: updatedStudents });
            }
        }
    };

    const columns = [
        {
            key: 'user',
            label: 'Utilisateur',
            render: (value: any, user: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pm-gold/20 flex items-center justify-center">
                        {user.imageUrl ? (
                            <img 
                                src={user.imageUrl} 
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <UserIcon className="w-6 h-6 text-pm-gold" />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-pm-off-white">{user.name}</div>
                        <div className="text-sm text-pm-off-white/60">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Rôle',
            render: (value: any, user: any) => (
                <div className="flex items-center gap-2">
                    {user.role === 'admin' && <ShieldCheckIcon className="w-4 h-4 text-red-400" />}
                    {user.role === 'student' && <UserIcon className="w-4 h-4 text-blue-400" />}
                    {user.role === 'beginner' && <KeyIcon className="w-4 h-4 text-green-400" />}
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        user.role === 'student' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                        {user.role === 'admin' ? 'Administrateur' :
                         user.role === 'student' ? 'Mannequin' : 'Débutant'}
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Statut',
            render: (value: any, user: any) => (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    user.isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}>
                    {user.isActive ? 'Actif' : 'Inactif'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, user: any) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors duration-200"
                        title="Modifier"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => window.open(`/mannequins/${user.id}`, '_blank')}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors duration-200"
                        title="Voir le profil"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AdminPageWrapper>
            <div className="space-y-6">
                {/* Actions et Filtres */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-playfair text-pm-gold">Utilisateurs</h2>
                    <div className="flex items-center gap-4">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                            className="px-3 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                        >
                            <option value="all">Tous les rôles</option>
                            <option value="admin">Administrateurs</option>
                            <option value="student">Mannequins</option>
                            <option value="beginner">Débutants</option>
                        </select>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nouvel Utilisateur
                        </button>
                    </div>
                </div>

                {/* Table */}
                <AdminTable
                    data={filteredUsers}
                    columns={columns}
                    onDelete={(user) => handleDelete(user.id, user.type)}
                />

                {/* Modal */}
                <AdminModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingUser ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
                    size="lg"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Nom Complet</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="admin-input"
                                    placeholder="Ex: Marie Nguema"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="admin-input"
                                    placeholder="Ex: marie@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Téléphone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="admin-input"
                                    placeholder="Ex: +241 XX XX XX XX"
                                />
                            </div>
                            <div>
                                <label className="admin-label">Rôle</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                                    className="admin-input"
                                >
                                    <option value="student">Mannequin</option>
                                    <option value="beginner">Débutant</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="admin-label">Mot de Passe</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="admin-input"
                                placeholder="Nouveau mot de passe"
                            />
                        </div>

                        <div>
                            <label className="admin-label">Image de Profil</label>
                            <input
                                type="url"
                                value={formData.profileImage}
                                onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.value }))}
                                className="admin-input"
                                placeholder="URL de l'image"
                            />
                            {formData.profileImage && (
                                <div className="mt-2">
                                    <img 
                                        src={formData.profileImage} 
                                        alt="Aperçu" 
                                        className="w-20 h-20 object-cover rounded-lg border border-pm-gold/20"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="admin-label">Biographie</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                className="admin-textarea"
                                rows={3}
                                placeholder="Description de l'utilisateur..."
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="w-4 h-4 text-pm-gold bg-pm-dark border-pm-gold/30 rounded focus:ring-pm-gold/50"
                                />
                                <span className="text-pm-off-white">Utilisateur actif</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors duration-200"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                            >
                                {editingUser ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </AdminModal>
            </div>
        </AdminPageWrapper>
    );
};

export default AdminUsers;
