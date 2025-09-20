import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  PhotoIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';
import { TeamMember } from '../../types';
import ImageUpload from '../../components/ImageUpload';

const AdminTeam: React.FC = () => {
  const { data, saveData } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    position: '',
    role: 'other',
    description: '',
    imageUrl: '',
    email: '',
    phone: '',
    socialLinks: {
      linkedin: '',
      instagram: '',
      facebook: ''
    },
    isPublic: true,
    order: 0
  });

  const teamMembers = data?.teamMembers || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data) return;

    const newMember: TeamMember = {
      id: editingMember?.id || `team-${Date.now()}`,
      name: formData.name || '',
      position: formData.position || '',
      role: formData.role || 'other',
      description: formData.description || '',
      imageUrl: formData.imageUrl || '',
      email: formData.email || '',
      phone: formData.phone || '',
      socialLinks: formData.socialLinks || {},
      isPublic: formData.isPublic || true,
      order: formData.order || teamMembers.length + 1,
      createdAt: editingMember?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      let updatedMembers;
      if (editingMember) {
        updatedMembers = teamMembers.map(member => 
          member.id === editingMember.id ? newMember : member
        );
      } else {
        updatedMembers = [...teamMembers, newMember];
      }

      await saveData({ ...data, teamMembers: updatedMembers });
      
      setShowForm(false);
      setEditingMember(null);
      setFormData({
        name: '',
        position: '',
        role: 'other',
        description: '',
        imageUrl: '',
        email: '',
        phone: '',
        socialLinks: {
          linkedin: '',
          instagram: '',
          facebook: ''
        },
        isPublic: true,
        order: 0
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setShowForm(true);
  };

  const handleDelete = async (memberId: string) => {
    if (!data || !confirm('Êtes-vous sûr de vouloir supprimer ce membre de l\'équipe ?')) return;

    try {
      const updatedMembers = teamMembers.filter(member => member.id !== memberId);
      await saveData({ ...data, teamMembers: updatedMembers });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleToggleVisibility = async (member: TeamMember) => {
    if (!data) return;

    try {
      const updatedMembers = teamMembers.map(m => 
        m.id === member.id ? { ...m, isPublic: !m.isPublic, updatedAt: new Date().toISOString() } : m
      );
      await saveData({ ...data, teamMembers: updatedMembers });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      founder: 'Fondateur',
      director: 'Directeur',
      trainer: 'Formateur',
      stylist: 'Styliste',
      photographer: 'Photographe',
      coordinator: 'Coordinateur',
      other: 'Autre'
    };
    return roleLabels[role] || 'Autre';
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gestion de l'Équipe</h1>
          <p className="admin-page-subtitle">Gérez les membres de votre équipe et leur visibilité</p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setFormData({
              name: '',
              position: '',
              role: 'other',
              description: '',
              imageUrl: '',
              email: '',
              phone: '',
              socialLinks: {
                linkedin: '',
                instagram: '',
                facebook: ''
              },
              isPublic: true,
              order: teamMembers.length + 1
            });
            setShowForm(true);
          }}
          className="admin-button-primary"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Ajouter un membre
        </button>
      </div>

      {/* Team Members List */}
      <div className="admin-section-wrapper">
        <h2 className="admin-section-title">Membres de l'Équipe ({teamMembers.length})</h2>
        
        {teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
            <p className="text-pm-off-white/60 text-lg">Aucun membre d'équipe ajouté</p>
            <p className="text-pm-off-white/40 text-sm mt-2">Commencez par ajouter le premier membre de votre équipe</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers
              .sort((a, b) => a.order - b.order)
              .map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-6 hover:border-pm-gold transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-pm-gold" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-pm-gold">{member.name}</h3>
                        <p className="text-sm text-pm-off-white/80">{member.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVisibility(member)}
                        className={`p-2 rounded-lg transition-colors ${
                          member.isPublic 
                            ? 'text-green-400 hover:bg-green-400/20' 
                            : 'text-red-400 hover:bg-red-400/20'
                        }`}
                        title={member.isPublic ? 'Masquer' : 'Afficher'}
                      >
                        {member.isPublic ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-pm-off-white/70">
                      <span className="px-2 py-1 bg-pm-gold/20 text-pm-gold rounded text-xs">
                        {getRoleLabel(member.role)}
                      </span>
                      <span className="text-xs">Ordre: {member.order}</span>
                    </div>
                    
                    {member.email && (
                      <div className="flex items-center gap-2 text-sm text-pm-off-white/70">
                        <EnvelopeIcon className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm text-pm-off-white/70">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-pm-off-white/80 mb-4 line-clamp-3">
                    {member.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 text-pm-gold hover:bg-pm-gold/20 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex gap-1">
                      {member.socialLinks?.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-blue-400 hover:bg-blue-400/20 rounded transition-colors"
                          title="LinkedIn"
                        >
                          <LinkIcon className="w-3 h-3" />
                        </a>
                      )}
                      {member.socialLinks?.instagram && (
                        <a
                          href={member.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-pink-400 hover:bg-pink-400/20 rounded transition-colors"
                          title="Instagram"
                        >
                          <LinkIcon className="w-3 h-3" />
                        </a>
                      )}
                      {member.socialLinks?.facebook && (
                        <a
                          href={member.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-blue-500 hover:bg-blue-500/20 rounded transition-colors"
                          title="Facebook"
                        >
                          <LinkIcon className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-pm-dark border border-pm-gold/20 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-playfair text-pm-gold mb-6">
              {editingMember ? 'Modifier le membre' : 'Ajouter un membre'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="admin-label">Nom complet *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
                <div>
                  <label className="admin-label">Poste *</label>
                  <input
                    type="text"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="admin-label">Rôle *</label>
                  <select
                    value={formData.role || 'other'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="admin-input"
                    required
                  >
                    <option value="founder">Fondateur</option>
                    <option value="director">Directeur</option>
                    <option value="trainer">Formateur</option>
                    <option value="stylist">Styliste</option>
                    <option value="photographer">Photographe</option>
                    <option value="coordinator">Coordinateur</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="admin-input"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-textarea"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="admin-label">Photo de profil</label>
                <ImageUpload
                  currentImage={formData.imageUrl || ''}
                  onImageUploaded={(imageUrl) => setFormData({ ...formData, imageUrl })}
                  placeholder="Cliquez pour uploader une photo de profil"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="admin-label">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Liens sociaux</label>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-pm-off-white/70">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.socialLinks?.linkedin || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                      })}
                      className="admin-input"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-pm-off-white/70">Instagram</label>
                    <input
                      type="url"
                      value={formData.socialLinks?.instagram || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                      })}
                      className="admin-input"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-pm-off-white/70">Facebook</label>
                    <input
                      type="url"
                      value={formData.socialLinks?.facebook || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                      })}
                      className="admin-input"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic || false}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-pm-gold bg-pm-dark border-pm-gold/20 rounded focus:ring-pm-gold focus:ring-2"
                />
                <label htmlFor="isPublic" className="text-sm text-pm-off-white/80">
                  Afficher publiquement sur le site
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="admin-button-primary flex-1"
                >
                  {editingMember ? 'Mettre à jour' : 'Ajouter le membre'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMember(null);
                  }}
                  className="admin-button-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
