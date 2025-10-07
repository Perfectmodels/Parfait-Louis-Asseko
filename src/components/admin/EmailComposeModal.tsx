import React, { useState, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';

interface EmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (emailData: any) => void;
  recipients?: Array<{ id: string; name: string; email: string; type: 'model' | 'student' | 'admin' }>;
  template?: any;
}

const EmailComposeModal: React.FC<EmailComposeModalProps> = ({
  isOpen,
  onClose,
  onSend,
  recipients = [],
  template
}) => {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    content: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
    type: 'text' as 'text' | 'html',
    attachments: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  // Initialiser avec le template si fourni
  useEffect(() => {
    if (template) {
      setFormData(prev => ({
        ...prev,
        subject: template.subject || '',
        content: template.content || '',
        type: template.type || 'text'
      }));
    }
  }, [template]);

  // Grouper les destinataires par type
  const groupedRecipients = recipients.reduce((acc, recipient) => {
    if (!acc[recipient.type]) {
      acc[recipient.type] = [];
    }
    acc[recipient.type].push(recipient);
    return acc;
  }, {} as Record<string, typeof recipients>);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const toggleRecipient = (email: string) => {
    setSelectedRecipients(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const addSelectedRecipients = () => {
    const recipientEmails = selectedRecipients.join(', ');
    setFormData(prev => ({
      ...prev,
      to: prev.to ? `${prev.to}, ${recipientEmails}` : recipientEmails
    }));
    setSelectedRecipients([]);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.to.trim()) {
      newErrors.to = 'Le destinataire est requis';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est requis';
    }

    // Validation des emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const toEmails = formData.to.split(',').map(e => e.trim());
    const invalidEmails = toEmails.filter(email => email && !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      newErrors.to = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSending(true);
    
    try {
      const emailData = {
        id: `email_${Date.now()}`,
        ...formData,
        to: formData.to.split(',').map(e => e.trim()).filter(Boolean),
        cc: formData.cc ? formData.cc.split(',').map(e => e.trim()).filter(Boolean) : [],
        bcc: formData.bcc ? formData.bcc.split(',').map(e => e.trim()).filter(Boolean) : [],
        status: 'sent',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      await onSend(emailData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <PaperAirplaneIcon className="w-6 h-6" />
              Nouvel Email
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
          {/* Destinataires */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                À *
              </label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.to ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="email@exemple.com, email2@exemple.com"
              />
              {errors.to && <p className="text-red-400 text-sm mt-1">{errors.to}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                CC
              </label>
              <input
                type="text"
                name="cc"
                value={formData.cc}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                placeholder="email@exemple.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              BCC
            </label>
            <input
              type="text"
              name="bcc"
              value={formData.bcc}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              placeholder="email@exemple.com"
            />
          </div>

          {/* Sélection de destinataires */}
          {recipients.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-3">
                Sélectionner des destinataires
              </label>
              <div className="space-y-4">
                {Object.entries(groupedRecipients).map(([type, typeRecipients]) => (
                  <div key={type}>
                    <h4 className="text-sm font-semibold text-pm-gold/80 mb-2 capitalize">
                      {type === 'model' ? 'Mannequins' : 
                       type === 'student' ? 'Étudiants' : 
                       'Administrateurs'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {typeRecipients.map(recipient => (
                        <label
                          key={recipient.id}
                          className="flex items-center gap-2 p-2 bg-black/20 border border-pm-gold/20 rounded-lg hover:bg-pm-gold/10 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedRecipients.includes(recipient.email)}
                            onChange={() => toggleRecipient(recipient.email)}
                            className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-pm-off-white truncate">{recipient.name}</p>
                            <p className="text-xs text-pm-off-white/60 truncate">{recipient.email}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {selectedRecipients.length > 0 && (
                  <button
                    type="button"
                    onClick={addSelectedRecipients}
                    className="px-4 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
                  >
                    Ajouter les destinataires sélectionnés
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Sujet et priorité */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Sujet *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.subject ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="Sujet de l'email"
              />
              {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
            </div>

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
                <option value="low">Faible</option>
                <option value="normal">Normale</option>
                <option value="high">Élevée</option>
              </select>
            </div>
          </div>

          {/* Type de contenu */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Type de contenu
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="text"
                  checked={formData.type === 'text'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 focus:ring-pm-gold/50"
                />
                <span className="text-pm-off-white">Texte</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="html"
                  checked={formData.type === 'html'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 focus:ring-pm-gold/50"
                />
                <span className="text-pm-off-white">HTML</span>
              </label>
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
              placeholder="Contenu de l'email..."
            />
            {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
          </div>

          {/* Pièces jointes */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Pièces jointes
            </label>
            <div className="space-y-3">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pm-gold/20 file:text-pm-gold hover:file:bg-pm-gold/30"
              />
              
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-pm-gold">Fichiers sélectionnés :</p>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-black/20 border border-pm-gold/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <PaperClipIcon className="w-4 h-4 text-pm-gold" />
                        <span className="text-sm text-pm-off-white">{file.name}</span>
                        <span className="text-xs text-pm-off-white/60">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              disabled={isSending}
              className="px-6 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              {isSending ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailComposeModal;
