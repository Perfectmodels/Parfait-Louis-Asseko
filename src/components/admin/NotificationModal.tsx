import React, { useState } from 'react';
import { XMarkIcon, BellIcon, UsersIcon, EyeIcon } from '@heroicons/react/24/outline';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notificationData: any) => void;
  notification?: any;
  isEdit?: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  notification,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    title: notification?.title || '',
    message: notification?.message || '',
    type: notification?.type || 'info',
    targetAudience: notification?.targetAudience || 'all',
    priority: notification?.priority || 'normal',
    scheduleDate: notification?.scheduleDate || '',
    isScheduled: notification?.isScheduled || false,
    isImmediate: notification?.isImmediate || false,
    actionUrl: notification?.actionUrl || '',
    actionText: notification?.actionText || '',
    imageUrl: notification?.imageUrl || '',
    soundEnabled: notification?.soundEnabled || true,
    vibrationEnabled: notification?.vibrationEnabled || true,
    status: notification?.status || 'draft',
    notes: notification?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const notificationTypes = [
    { value: 'info', label: 'Information', color: 'bg-blue-500' },
    { value: 'success', label: 'Succès', color: 'bg-green-500' },
    { value: 'warning', label: 'Avertissement', color: 'bg-yellow-500' },
    { value: 'error', label: 'Erreur', color: 'bg-red-500' },
    { value: 'promotion', label: 'Promotion', color: 'bg-purple-500' },
    { value: 'reminder', label: 'Rappel', color: 'bg-orange-500' }
  ];

  const targetAudiences = [
    { value: 'all', label: 'Tous les utilisateurs' },
    { value: 'models', label: 'Mannequins uniquement' },
    { value: 'students', label: 'Étudiants uniquement' },
    { value: 'admins', label: 'Administrateurs uniquement' },
    { value: 'custom', label: 'Liste personnalisée' }
  ];

  const priorities = [
    { value: 'low', label: 'Faible', color: 'text-gray-500' },
    { value: 'normal', label: 'Normal', color: 'text-blue-500' },
    { value: 'high', label: 'Élevé', color: 'text-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-500' }
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

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
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

    const notificationData = {
      ...formData,
      id: notification?.id || Date.now().toString(),
      createdAt: notification?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(notificationData);
    onClose();
  };

  const generatePreview = () => {
    const typeConfig = notificationTypes.find(t => t.value === formData.type);
    const priorityConfig = priorities.find(p => p.value === formData.priority);
    
    return {
      typeColor: typeConfig?.color || 'bg-blue-500',
      priorityColor: priorityConfig?.color || 'text-blue-500',
      priorityLabel: priorityConfig?.label || 'Normal'
    };
  };

  if (!isOpen) return null;

  const preview = generatePreview();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <BellIcon className="w-6 h-6" />
              {isEdit ? 'Modifier la Notification' : 'Nouvelle Notification Push'}
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
                  <h3 className="text-lg font-semibold">{formData.title}</h3>
                  <p className="text-sm text-gray-600">Type: {notificationTypes.find(t => t.value === formData.type)?.label}</p>
                  <p className="text-sm text-gray-600">Priorité: {preview.priorityLabel}</p>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p>{formData.message}</p>
                  {formData.actionUrl && (
                    <div className="mt-4">
                      <a href={formData.actionUrl} className="text-blue-600 underline">
                        {formData.actionText || 'Voir plus'}
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>Audience: {targetAudiences.find(a => a.value === formData.targetAudience)?.label}</p>
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
              {/* Titre et type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Titre de la notification *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                      errors.title ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="Titre de la notification"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    Type de notification
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                  >
                    {notificationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                    errors.message ? 'border-red-500' : 'border-pm-gold/30'
                  }`}
                  placeholder="Message de la notification..."
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Audience et priorité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
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

              {/* Action et image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pm-gold">Action et média</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                      URL d'action
                    </label>
                    <input
                      type="url"
                      name="actionUrl"
                      value={formData.actionUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                      Texte du bouton d'action
                    </label>
                    <input
                      type="text"
                      name="actionText"
                      value={formData.actionText}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                      placeholder="Voir plus"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">
                    URL de l'image
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Options avancées */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pm-gold">Options avancées</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="soundEnabled"
                        checked={formData.soundEnabled}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                      />
                      <span className="text-pm-off-white">Son activé</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="vibrationEnabled"
                        checked={formData.vibrationEnabled}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                      />
                      <span className="text-pm-off-white">Vibration activée</span>
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
                  placeholder="Notes sur la notification..."
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
                  {isEdit ? 'Mettre à jour' : 'Créer la Notification'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
