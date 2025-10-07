import React, { useState } from 'react';
import { XMarkIcon, EnvelopeIcon, UsersIcon, EyeIcon } from '@heroicons/react/24/outline';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (campaignData: any) => void;
  campaign?: any;
  isEdit?: boolean;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  campaign,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    subject: campaign?.subject || '',
    template: campaign?.template || '',
    recipients: campaign?.recipients || [] as string[],
    scheduleDate: campaign?.scheduleDate || '',
    status: campaign?.status || 'draft',
    isScheduled: campaign?.isScheduled || false,
    isImmediate: campaign?.isImmediate || false,
    targetAudience: campaign?.targetAudience || 'all',
    personalization: campaign?.personalization || false,
    trackingEnabled: campaign?.trackingEnabled || true,
    notes: campaign?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const targetAudiences = [
    { value: 'all', label: 'Tous les utilisateurs' },
    { value: 'models', label: 'Mannequins uniquement' },
    { value: 'students', label: 'Étudiants uniquement' },
    { value: 'custom', label: 'Liste personnalisée' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'scheduled', label: 'Programmée' },
    { value: 'sent', label: 'Envoyée' },
    { value: 'cancelled', label: 'Annulée' }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la campagne est requis';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    if (!formData.template.trim()) {
      newErrors.template = 'Le template est requis';
    }
    if (formData.isScheduled && !formData.scheduleDate) {
      newErrors.scheduleDate = 'La date de programmation est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const campaignData = {
      ...formData,
      id: campaign?.id || Date.now().toString(),
      createdAt: campaign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(campaignData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <EnvelopeIcon className="w-6 h-6" />
              {isEdit ? 'Modifier la Campagne' : 'Nouvelle Campagne Email'}
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
                  <p className="text-sm text-gray-600">Campagne: {formData.name}</p>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p>Contenu du template: {formData.template}</p>
                  <p>Audience cible: {targetAudiences.find(a => a.value === formData.targetAudience)?.label}</p>
                  <p>Statut: {statusOptions.find(s => s.value === formData.status)?.label}</p>
                </div>
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
              {/* Nom et sujet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Nom de la campagne *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                      errors.name ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="Nom de la campagne"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Sujet de l'email *
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
              </div>

              {/* Template et audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Template *
                  </label>
                  <select
                    name="template"
                    value={formData.template}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                      errors.template ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                  >
                    <option value="">Sélectionner un template</option>
                    <option value="welcome">Bienvenue</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="promotion">Promotion</option>
                    <option value="notification">Notification</option>
                    <option value="custom">Personnalisé</option>
                  </select>
                  {errors.template && <p className="text-red-400 text-sm mt-1">{errors.template}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Audience cible
                  </label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  >
                    {targetAudiences.map(audience => (
                      <option key={audience.value} value={audience.value}>{audience.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Options d'envoi */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pm-gold">Options d'envoi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isImmediate"
                        checked={formData.isImmediate}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                      />
                      <span className="text-pm-off-white">Envoi immédiat</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isScheduled"
                        checked={formData.isScheduled}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                      />
                      <span className="text-pm-off-white">Programmer l'envoi</span>
                    </label>
                  </div>
                </div>

                {formData.isScheduled && (
                  <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                      Date et heure d'envoi *
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduleDate"
                      value={formData.scheduleDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                        errors.scheduleDate ? 'border-red-500' : 'border-pm-gold/30'
                      }`}
                    />
                    {errors.scheduleDate && <p className="text-red-400 text-sm mt-1">{errors.scheduleDate}</p>}
                  </div>
                )}
              </div>

              {/* Options avancées */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pm-gold">Options avancées</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="personalization"
                        checked={formData.personalization}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                      />
                      <span className="text-pm-off-white">Personnalisation</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="trackingEnabled"
                        checked={formData.trackingEnabled}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                      />
                      <span className="text-pm-off-white">Suivi des ouvertures</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Statut */}
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

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  placeholder="Notes sur la campagne..."
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
                  {isEdit ? 'Mettre à jour' : 'Créer la Campagne'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;
