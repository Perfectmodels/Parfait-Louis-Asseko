import React, { useState } from 'react';
import { XMarkIcon, NewspaperIcon, PhotoIcon, EyeIcon } from '@heroicons/react/24/outline';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newsData: any) => void;
  news?: any;
  isEdit?: boolean;
}

const NewsModal: React.FC<NewsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  news,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    title: news?.title || '',
    content: news?.content || '',
    image: news?.image || '',
    priority: news?.priority || 'normal',
    status: news?.status || 'draft',
    publishDate: news?.publishDate || new Date().toISOString().split('T')[0],
    expireDate: news?.expireDate || '',
    author: news?.author || 'Admin',
    tags: news?.tags || [] as string[],
    isBreaking: news?.isBreaking || false,
    isFeatured: news?.isFeatured || false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const priorityOptions = [
    { value: 'low', label: 'Faible', color: 'text-gray-400' },
    { value: 'normal', label: 'Normal', color: 'text-blue-400' },
    { value: 'high', label: 'Élevée', color: 'text-orange-400' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-400' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publié' },
    { value: 'archived', label: 'Archivé' }
  ];

  const commonTags = [
    'actualité', 'mode', 'mannequin', 'casting', 'événement', 'formation',
    'concours', 'partenariat', 'nouvelle', 'annonce', 'important'
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

  const handleTagAdd = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleCustomTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const tag = input.value.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        input.value = '';
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newsData = {
      ...formData,
      id: news?.id || Date.now().toString(),
      createdAt: news?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(newsData);
    onClose();
  };

  const generatePreview = () => {
    return `
      <div class="news-preview">
        <div class="news-header">
          ${formData.isBreaking ? '<div class="breaking-news">URGENT</div>' : ''}
          ${formData.isFeatured ? '<div class="featured-news">EN VEDETTE</div>' : ''}
          <h1>${formData.title}</h1>
          <div class="meta">
            <span>Par ${formData.author}</span> • 
            <span>${new Date(formData.publishDate).toLocaleDateString('fr-FR')}</span>
            ${formData.expireDate ? ` • Expire le ${new Date(formData.expireDate).toLocaleDateString('fr-FR')}` : ''}
          </div>
        </div>
        ${formData.image ? `<img src="${formData.image}" alt="${formData.title}" class="news-image" />` : ''}
        <div class="news-content">
          ${formData.content.replace(/\n/g, '<br>')}
        </div>
        <div class="news-tags">
          ${formData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <NewspaperIcon className="w-6 h-6" />
              {isEdit ? 'Modifier l\'Actualité' : 'Nouvelle Actualité'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
                title="Aperçu"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {previewMode ? (
            // Mode aperçu
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 text-gray-900">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: generatePreview() }}
                />
              </div>
              <button
                onClick={() => setPreviewMode(false)}
                className="px-4 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
              >
                Retour à l'édition
              </button>
            </div>
          ) : (
            // Mode édition
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Titre de l'actualité *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                    errors.title ? 'border-red-500' : 'border-pm-gold/30'
                  }`}
                  placeholder="Titre de l'actualité"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Priorité et statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Priorité
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
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

              {/* Options spéciales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isBreaking"
                      checked={formData.isBreaking}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                    />
                    <span className="text-pm-off-white">Actualité urgente</span>
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                    />
                    <span className="text-pm-off-white">Mettre en vedette</span>
                  </label>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Date d'expiration (optionnel)
                  </label>
                  <input
                    type="date"
                    name="expireDate"
                    value={formData.expireDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  />
                </div>
              </div>

              {/* Contenu */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Contenu *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={8}
                  className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                    errors.content ? 'border-red-500' : 'border-pm-gold/30'
                  }`}
                  placeholder="Contenu de l'actualité..."
                />
                {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                    placeholder="URL de l'image"
                  />
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-pm-gold/10 border border-pm-gold/30 rounded-lg text-pm-gold hover:bg-pm-gold/20 cursor-pointer transition-colors"
                  >
                    <PhotoIcon className="w-5 h-5" />
                    Choisir
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold text-sm rounded-full flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="text-pm-gold/70 hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagAdd(tag)}
                        disabled={formData.tags.includes(tag)}
                        className={`px-3 py-1 text-sm rounded border transition-colors ${
                          formData.tags.includes(tag)
                            ? 'bg-pm-gold/20 border-pm-gold/30 text-pm-gold cursor-not-allowed'
                            : 'bg-pm-gold/10 border-pm-gold/20 text-pm-gold hover:bg-pm-gold/20'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Ajouter un tag personnalisé (Entrée pour valider)"
                    onKeyDown={handleCustomTagAdd}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
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
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className="px-6 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Aperçu
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
                >
                  {isEdit ? 'Mettre à jour' : 'Publier l\'Actualité'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
