import React, { useState } from 'react';
import AIAssistant from '../AIAssistant';
import AIAssistantIcon from '../AIAssistantIcon';

interface EmailTemplateFormProps {
  template?: any;
  onSave: (template: any) => void;
  onCancel: () => void;
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({ 
  template, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    content: template?.content || '',
    type: template?.type || 'welcome',
  });
  const [assistantState, setAssistantState] = useState<{isOpen: boolean; fieldName: string; initialPrompt: string}>({
    isOpen: false,
    fieldName: '',
    initialPrompt: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const openAssistant = (fieldName: string, initialPrompt: string) => {
    setAssistantState({ isOpen: true, fieldName, initialPrompt });
  };

  const handleInsertContent = (content: string) => {
    const field = assistantState.fieldName.toLowerCase();
    if (field.includes('nom')) {
      setFormData(p => ({ ...p, name: content }));
    } else if (field.includes('sujet')) {
      setFormData(p => ({ ...p, subject: content }));
    } else if (field.includes('contenu')) {
      setFormData(p => ({ ...p, content: content }));
    }
    setAssistantState({ isOpen: false, fieldName: '', initialPrompt: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-pm-gold">
            Nom du template
          </label>
          <AIAssistantIcon 
            onClick={() => openAssistant('Nom du template', `Génère un nom descriptif pour un template email de type "${formData.type}"`)}
          />
        </div>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-pm-gold mb-2">
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-4 py-3 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
        >
          <option value="welcome">Bienvenue</option>
          <option value="newsletter">Newsletter</option>
          <option value="notification">Notification</option>
          <option value="reminder">Rappel</option>
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-pm-gold">
            Sujet
          </label>
          <AIAssistantIcon 
            onClick={() => openAssistant('Sujet', `Génère un sujet d'email pour un template de type "${formData.type}" intitulé "${formData.name}"`)}
          />
        </div>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-3 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-pm-gold">
            Contenu
          </label>
          <AIAssistantIcon 
            onClick={() => openAssistant('Contenu', `Rédige le contenu d'un template email de type "${formData.type}" intitulé "${formData.name}" avec le sujet "${formData.subject}". Inclus des variables personnalisables comme {{nom}} et {{email}}.`)}
          />
        </div>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          className="w-full px-4 py-3 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none resize-none"
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-white transition-colors"
        >
          Sauvegarder
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-pm-gold text-pm-gold rounded-lg hover:bg-pm-gold hover:text-pm-dark transition-colors"
        >
          Annuler
        </button>
      </div>

      <AIAssistant 
        isOpen={assistantState.isOpen}
        onClose={() => setAssistantState(p => ({...p, isOpen: false}))}
        onInsertContent={handleInsertContent}
        fieldName={assistantState.fieldName}
        initialPrompt={assistantState.initialPrompt}
      />
    </form>
  );
};

export default EmailTemplateForm;
