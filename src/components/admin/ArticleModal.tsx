import React, { useState } from 'react';
import { XMarkIcon, DocumentTextIcon, PhotoIcon, EyeIcon } from '@heroicons/react/24/outline';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (articleData: any) => void;
  article?: any;
  isEdit?: boolean;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  article,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'fashion',
    tags: article?.tags || [] as string[],
    featuredImage: article?.featuredImage || '',
    status: article?.status || 'draft',
    author: article?.author || 'Admin',
    publishDate: article?.publishDate || new Date().toISOString().split('T')[0],
    seoTitle: article?.seoTitle || '',
    seoDescription: article?.seoDescription || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    { value: 'fashion', label: 'Mode' },
    { value: 'beauty', label: 'Beauté' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'career', label: 'Carrière' },
    { value: 'events', label: 'Événements' },
    { value: 'tips', label: 'Conseils' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publié' },
    { value: 'archived', label: 'Archivé' }
  ];

  const commonTags = [
    'mode', 'beauté', 'mannequin', 'fashion', 'style', 'tendances',
    'maquillage', 'coiffure', 'photographie', 'casting', 'carrière'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
    
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
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'L\'extrait est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const articleData = {
      ...formData,
      id: article?.id || Date.now().toString(),
      createdAt: article?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(articleData);
    onClose();
  };

  const generatePreview = () => {
    return `
      <div class="article-preview">
        <h1>${formData.title}</h1>
        <div class="meta">
          <span>Par ${formData.author}</span> • 
          <span>${new Date(formData.publishDate).toLocaleDateString('fr-FR')}</span> • 
          <span>${categories.find(c => c.value === formData.category)?.label}</span>
        </div>
        <div class="excerpt">
          ${formData.excerpt}
        </div>
        <div class="content">
          ${formData.content.replace(/\n/g, '<br>')}
        </div>
        <div class="tags">
          ${formData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <DocumentTextIcon className="w-6 h-6" />
              {isEdit ? 'Modifier l\'Article' : 'Nouvel Article'}
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
              {/* Titre et slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Titre de l'article *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                      errors.title ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="Titre de l'article"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                    placeholder="titre-de-l-article"
                  />
                </div>
              </div>

              {/* Catégorie et statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Extrait */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Extrait *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                    errors.excerpt ? 'border-red-500' : 'border-pm-gold/30'
                  }`}
                  placeholder="Résumé de l'article..."
                />
                {errors.excerpt && <p className="text-red-400 text-sm mt-1">{errors.excerpt}</p>}
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
                  rows={12}
                  className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                    errors.content ? 'border-red-500' : 'border-pm-gold/30'
                  }`}
                  placeholder="Contenu de l'article..."
                />
                {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
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

              {/* Image mise en avant */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Image mise en avant
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="url"
                    name="featuredImage"
                    value={formData.featuredImage}
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

              {/* SEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Titre SEO
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                    placeholder="Titre pour le SEO"
                  />
                </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Description SEO
                </label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  placeholder="Description pour le SEO..."
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
                  {isEdit ? 'Mettre à jour' : 'Publier l\'Article'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
