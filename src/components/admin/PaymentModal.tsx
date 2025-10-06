import React, { useState } from 'react';
import { XMarkIcon, CurrencyDollarIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: any) => void;
  payment?: any;
  isEdit?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  payment,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    modelId: payment?.modelId || '',
    modelName: payment?.modelName || '',
    amount: payment?.amount || '',
    type: payment?.type || 'salary',
    period: payment?.period || '',
    status: payment?.status || 'pending',
    paymentMethod: payment?.paymentMethod || 'bank_transfer',
    reference: payment?.reference || '',
    notes: payment?.notes || '',
    dueDate: payment?.dueDate || new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentTypes = [
    { value: 'salary', label: 'Salaire' },
    { value: 'bonus', label: 'Prime' },
    { value: 'commission', label: 'Commission' },
    { value: 'reimbursement', label: 'Remboursement' },
    { value: 'advance', label: 'Avance' }
  ];

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Virement Bancaire' },
    { value: 'cash', label: 'Espèces' },
    { value: 'check', label: 'Chèque' },
    { value: 'mobile_money', label: 'Mobile Money' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'En Attente', icon: ClockIcon, color: 'text-yellow-400' },
    { value: 'paid', label: 'Payé', icon: CheckCircleIcon, color: 'text-green-400' },
    { value: 'cancelled', label: 'Annulé', icon: XMarkIcon, color: 'text-red-400' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.modelName.trim()) {
      newErrors.modelName = 'Le nom du mannequin est requis';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    if (!formData.period.trim()) {
      newErrors.period = 'La période est requise';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const paymentData = {
      ...formData,
      id: payment?.id || Date.now().toString(),
      amount: parseFloat(formData.amount),
      createdAt: payment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(paymentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <CurrencyDollarIcon className="w-6 h-6" />
              {isEdit ? 'Modifier le Paiement' : 'Nouveau Paiement'}
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
          {/* Informations du mannequin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Nom du Mannequin *
              </label>
              <input
                type="text"
                name="modelName"
                value={formData.modelName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.modelName ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="Nom du mannequin"
              />
              {errors.modelName && <p className="text-red-400 text-sm mt-1">{errors.modelName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Type de Paiement
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                {paymentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Montant (FCFA) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.amount ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="0.00"
              />
              {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
            </div>

            {/* Période */}
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Période *
              </label>
              <input
                type="text"
                name="period"
                value={formData.period}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.period ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="Ex: Janvier 2024"
              />
              {errors.period && <p className="text-red-400 text-sm mt-1">{errors.period}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Méthode de paiement */}
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Méthode de Paiement
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date d'échéance */}
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Date d'Échéance *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.dueDate ? 'border-red-500' : 'border-pm-gold/30'
                }`}
              />
              {errors.dueDate && <p className="text-red-400 text-sm mt-1">{errors.dueDate}</p>}
            </div>

            {/* Référence */}
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Référence
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                placeholder="Numéro de référence"
              />
            </div>
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
              placeholder="Notes supplémentaires..."
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
              type="submit"
              className="px-6 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
            >
              {isEdit ? 'Mettre à jour' : 'Enregistrer le Paiement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
