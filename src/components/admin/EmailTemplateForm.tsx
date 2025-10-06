import React, { useState } from 'react';
import { EmailTemplate } from '../../types';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface EmailTemplateFormProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<EmailTemplate>(template);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof EmailTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-2">
            Nom du template
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-2">
            Sujet
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className="w-full px-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-2">
            Nom de l'expéditeur
          </label>
          <input
            type="text"
            value={formData.sender.name}
            onChange={(e) => handleChange('sender', { ...formData.sender, name: e.target.value })}
            className="w-full px-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-2">
            Email de l'expéditeur
          </label>
          <input
            type="email"
            value={formData.sender.email}
            onChange={(e) => handleChange('sender', { ...formData.sender, email: e.target.value })}
            className="w-full px-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-pm-off-white mb-2">
          Contenu HTML
        </label>
        <textarea
          value={formData.htmlContent}
          onChange={(e) => handleChange('htmlContent', e.target.value)}
          rows={10}
          className="w-full px-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
          placeholder="Contenu HTML du template..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-pm-off-white mb-2">
          Contenu texte
        </label>
        <textarea
          value={formData.textContent}
          onChange={(e) => handleChange('textContent', e.target.value)}
          rows={6}
          className="w-full px-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
          placeholder="Version texte du template..."
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-pm-gold/20">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-pm-off-white/70 hover:text-pm-off-white border border-pm-gold/30 hover:border-pm-gold rounded-lg transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-semibold rounded-lg hover:from-yellow-400 hover:to-pm-gold transition-all duration-300"
        >
          <DocumentTextIcon className="w-5 h-5" />
          Enregistrer
        </button>
      </div>
    </form>
  );
};

export default EmailTemplateForm;