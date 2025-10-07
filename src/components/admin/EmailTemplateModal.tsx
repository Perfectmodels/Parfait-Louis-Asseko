import React, { useState } from 'react';
import { XMarkIcon, EnvelopeIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline';

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: any) => void;
  template?: any;
  isEdit?: boolean;
}

const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  template,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    category: template?.category || 'general',
    content: template?.content || '',
    variables: template?.variables || [] as string[],
    isActive: template?.isActive ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    { value: 'general', label: 'Général' },
    { value: 'welcome', label: 'Bienvenue' },
    { value: 'notification', label: 'Notification' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'reminder', label: 'Rappel' },
    { value: 'newsletter', label: 'Newsletter' }
  ];

  const commonVariables = [
    '{{name}}', '{{email}}', '{{company}}', '{{date}}', '{{time}}',
    '{{model_name}}', '{{casting_title}}', '{{event_date}}', '{{location}}'
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

  const handleVariableAdd = (variable: string) => {
    if (!formData.variables.includes(variable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, variable]
      }));
    }
  };

  const handleVariableRemove = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom du template est requis';
    if (!formData.subject.trim()) newErrors.subject = 'Le sujet est requis';
    if (!formData.content.trim()) newErrors.content = 'Le contenu est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const templateData = {
      ...formData,
      id: template?.id || Date.now().toString(),
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(templateData);
    onClose();
  };

  const generatePreview = () => {
    let previewContent = formData.content;
    
    // Remplacer les variables par des exemples
    const exampleData = {
      '{{name}}': 'Marie Dubois',
      '{{email}}': 'marie.dubois@example.com',
      '{{company}}': 'Perfect Models Management',
      '{{date}}': new Date().toLocaleDateString('fr-FR'),
      '{{time}}': new Date().toLocaleTimeString('fr-FR'),
      '{{model_name}}': 'Sophie Martin',
      '{{casting_title}}': 'Casting Mode Printemps 2024',
      '{{event_date}}': '15 Mars 2024',
      '{{location}}': 'Libreville, Gabon'
    };

    Object.entries(exampleData).forEach(([variable, value]) => {
      previewContent = previewContent.replace(new RegExp(variable, 'g'), value);
    });

    return previewContent;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <EnvelopeIcon className="w-6 h-6" />
              {isEdit ? 'Modifier le Template' : 'Nouveau Template Email'}
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
                <div className="border-b pb-4 mb-4">
                  <h3 className="text-lg font-semibold">{formData.subject}</h3>
                  <p className="text-sm text-gray-600">De: Perfect Models Management</p>
                </div>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: generatePreview().replace(/\n/g, '<br>') }}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Nom du Template *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                      errors.name ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="Template de bienvenue"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
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

              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Sujet de l'Email *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                    errors.subject ? 'border-red-500' : 'border-pm-gold/30'
                  }`}
                  placeholder="Bienvenue chez Perfect Models Management"
                />
                {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Contenu de l'Email *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                    errors.content ? 'border-red-500' : 'border-pm-gold/30'
                  }`}
                  placeholder="Bonjour {{name}},\n\nBienvenue chez Perfect Models Management..."
                />
                {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
              </div>

              {/* Variables disponibles */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Variables Disponibles
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {commonVariables.map(variable => (
                    <button
                      key={variable}
                      type="button"
                      onClick={() => handleVariableAdd(variable)}
                      className="px-3 py-1 bg-pm-gold/10 border border-pm-gold/30 text-pm-gold text-sm rounded hover:bg-pm-gold/20 transition-colors"
                    >
                      {variable}
                    </button>
                  ))}
                </div>
                
                {formData.variables.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-pm-gold mb-2">Variables utilisées:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.variables.map(variable => (
                        <span
                          key={variable}
                          className="px-2 py-1 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold text-sm rounded flex items-center gap-1"
                        >
                          {variable}
                          <button
                            type="button"
                            onClick={() => handleVariableRemove(variable)}
                            className="text-pm-gold/70 hover:text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                />
                <label className="ml-2 text-sm text-pm-off-white">
                  Template actif
                </label>
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
                  {isEdit ? 'Mettre à jour' : 'Créer le Template'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateModal;
