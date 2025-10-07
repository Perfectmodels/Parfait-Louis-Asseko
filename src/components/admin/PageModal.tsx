import React, { useState } from 'react';
import { XMarkIcon, DocumentTextIcon, EyeIcon, LinkIcon } from '@heroicons/react/24/outline';

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pageData: any) => void;
  page?: any;
  isEdit?: boolean;
}

const PageModal: React.FC<PageModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  page,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    description: page?.description || '',
    template: page?.template || 'default',
    status: page?.status || 'published',
    isHomePage: page?.isHomePage || false,
    showInMenu: page?.showInMenu || true,
    menuOrder: page?.menuOrder || 0,
    seoTitle: page?.seoTitle || '',
    seoDescription: page?.seoDescription || '',
    seoKeywords: page?.seoKeywords || '',
    customCss: page?.customCss || '',
    customJs: page?.customJs || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const templates = [
    { value: 'default', label: 'Page Standard' },
    { value: 'landing', label: 'Page d\'Accueil' },
    { value: 'about', label: 'À Propos' },
    { value: 'contact', label: 'Contact' },
    { value: 'gallery', label: 'Galerie' },
    { value: 'blog', label: 'Blog' },
    { value: 'custom', label: 'Personnalisée' }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Le slug est requis';
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

    const pageData = {
      ...formData,
      id: page?.id || Date.now().toString(),
      createdAt: page?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(pageData);
    onClose();
  };

  const generatePreview = () => {
    return `
      <div class="page-preview">
        <header class="page-header">
          <h1>${formData.title}</h1>
          <p class="page-description">${formData.description}</p>
        </header>
        <main class="page-content">
          ${formData.content.replace(/\n/g, '<br>')}
        </main>
        <footer class="page-footer">
          <p>URL: /${formData.slug}</p>
          <p>Template: ${templates.find(t => t.value === formData.template)?.label}</p>
        </footer>
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
              {isEdit ? 'Modifier la Page' : 'Nouvelle Page'}
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
                    Titre de la page *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                      errors.title ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="Titre de la page"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Slug (URL) *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-pm-off-white/70">/</span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={`flex-1 px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                        errors.slug ? 'border-red-500' : 'border-pm-gold/30'
                      }`}
                      placeholder="slug-de-la-page"
                    />
                  </div>
                  {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  placeholder="Description de la page..."
                />
              </div>

              {/* Template et statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Template
                  </label>
                  <select
                    name="template"
                    value={formData.template}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  >
                    {templates.map(template => (
                      <option key={template.value} value={template.value}>{template.label}</option>
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

              {/* Options de navigation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isHomePage"
                      checked={formData.isHomePage}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                    />
                    <span className="text-pm-off-white">Page d'accueil</span>
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="showInMenu"
                      checked={formData.showInMenu}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                    />
                    <span className="text-pm-off-white">Afficher dans le menu</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Ordre dans le menu
                  </label>
                  <input
                    type="number"
                    name="menuOrder"
                    value={formData.menuOrder}
                    onChange={handleInputChange}
                    min="0"
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
                  rows={12}
                  className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                    errors.content ? 'border-red-500' : 'border-pm-gold/30'
                  }`}
                  placeholder="Contenu de la page..."
                />
                {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
              </div>

              {/* SEO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pm-gold">Optimisation SEO</h3>
                
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

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Mots-clés SEO
                  </label>
                  <input
                    type="text"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                    placeholder="mot-clé1, mot-clé2, mot-clé3"
                  />
                </div>
              </div>

              {/* Code personnalisé */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pm-gold">Code Personnalisé</h3>
                
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    CSS personnalisé
                  </label>
                  <textarea
                    name="customCss"
                    value={formData.customCss}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 font-mono text-sm"
                    placeholder="/* CSS personnalisé */"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    JavaScript personnalisé
                  </label>
                  <textarea
                    name="customJs"
                    value={formData.customJs}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 font-mono text-sm"
                    placeholder="// JavaScript personnalisé"
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
                  {isEdit ? 'Mettre à jour' : 'Créer la Page'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageModal;
