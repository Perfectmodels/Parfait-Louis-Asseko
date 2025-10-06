import React, { useState } from 'react';
import { XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (moduleData: any) => void;
  module?: any;
  isEdit?: boolean;
}

const ModuleModal: React.FC<ModuleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  module,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    title: module?.title || '',
    description: module?.description || '',
    category: module?.category || 'basics',
    level: module?.level || 'beginner',
    duration: module?.duration || '',
    content: module?.content || '',
    objectives: module?.objectives || [] as string[],
    prerequisites: module?.prerequisites || [] as string[],
    resources: module?.resources || [] as string[],
    status: module?.status || 'draft',
    isFree: module?.isFree || false,
    price: module?.price || '',
    instructor: module?.instructor || 'Admin',
    videoUrl: module?.videoUrl || '',
    thumbnail: module?.thumbnail || '',
    order: module?.order || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newObjective, setNewObjective] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newResource, setNewResource] = useState('');

  const categories = [
    { value: 'basics', label: 'Bases du Mannequinat' },
    { value: 'pose', label: 'Pose et Expression' },
    { value: 'runway', label: 'Défilé' },
    { value: 'photography', label: 'Photographie' },
    { value: 'business', label: 'Aspects Business' },
    { value: 'wellness', label: 'Bien-être' },
    { value: 'advanced', label: 'Techniques Avancées' }
  ];

  const levels = [
    { value: 'beginner', label: 'Débutant', color: 'text-green-400' },
    { value: 'intermediate', label: 'Intermédiaire', color: 'text-yellow-400' },
    { value: 'advanced', label: 'Avancé', color: 'text-red-400' },
    { value: 'expert', label: 'Expert', color: 'text-purple-400' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publié' },
    { value: 'archived', label: 'Archivé' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddObjective = () => {
    if (newObjective.trim() && !formData.objectives.includes(newObjective.trim())) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (objective: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((o: string) => o !== objective)
    }));
  };

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const handleRemovePrerequisite = (prerequisite: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((p: string) => p !== prerequisite)
    }));
  };

  const handleAddResource = () => {
    if (newResource.trim() && !formData.resources.includes(newResource.trim())) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource('');
    }
  };

  const handleRemoveResource = (resource: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((r: string) => r !== resource)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est requis';
    }
    if (!formData.duration.trim()) {
      newErrors.duration = 'La durée est requise';
    }
    if (!formData.isFree && !formData.price) {
      newErrors.price = 'Le prix est requis pour les modules payants';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const moduleData = {
      ...formData,
      id: module?.id || Date.now().toString(),
      createdAt: module?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(moduleData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <BookOpenIcon className="w-6 h-6" />
              {isEdit ? 'Modifier le Module' : 'Nouveau Module de Formation'}
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
          {/* Titre et catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Titre du module *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.title ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="Titre du module"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                errors.description ? 'border-red-500' : 'border-pm-gold/30'
              }`}
              placeholder="Description du module..."
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Niveau, durée et statut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Niveau
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                {levels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Durée *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.duration ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="Ex: 2h 30min"
              />
              {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
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

          {/* Prix et options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                />
                <span className="text-pm-off-white">Module gratuit</span>
              </label>
            </div>

            {!formData.isFree && (
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                    errors.price ? 'border-red-500' : 'border-pm-gold/30'
                  }`}
                  placeholder="0"
                />
                {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
              </div>
            )}
          </div>

          {/* Objectifs d'apprentissage */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Objectifs d'apprentissage
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
                  className="flex-1 px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  placeholder="Ajouter un objectif..."
                />
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="px-4 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.objectives.map((objective: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold text-sm rounded-full flex items-center gap-2"
                  >
                    {objective}
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(objective)}
                      className="text-pm-gold/70 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Prérequis */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Prérequis
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPrerequisite())}
                  className="flex-1 px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  placeholder="Ajouter un prérequis..."
                />
                <button
                  type="button"
                  onClick={handleAddPrerequisite}
                  className="px-4 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.prerequisites.map((prerequisite: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm rounded-full flex items-center gap-2"
                  >
                    {prerequisite}
                    <button
                      type="button"
                      onClick={() => handleRemovePrerequisite(prerequisite)}
                      className="text-blue-400/70 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ressources */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Ressources
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newResource}
                  onChange={(e) => setNewResource(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResource())}
                  className="flex-1 px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  placeholder="Ajouter une ressource..."
                />
                <button
                  type="button"
                  onClick={handleAddResource}
                  className="px-4 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.resources.map((resource: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm rounded-full flex items-center gap-2"
                  >
                    {resource}
                    <button
                      type="button"
                      onClick={() => handleRemoveResource(resource)}
                      className="text-green-400/70 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu du module */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Contenu du module *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                errors.content ? 'border-red-500' : 'border-pm-gold/30'
              }`}
              placeholder="Contenu détaillé du module..."
            />
            {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
          </div>

          {/* Médias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                URL de la vidéo
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Image de couverture
              </label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                placeholder="https://..."
              />
            </div>
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
              {isEdit ? 'Mettre à jour' : 'Créer le Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleModal;
