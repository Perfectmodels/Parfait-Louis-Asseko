import React, { useState } from 'react';
import { XMarkIcon, CurrencyDollarIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface FinancialTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: any) => void;
  transaction?: any;
  isEdit?: boolean;
}

const FinancialTransactionModal: React.FC<FinancialTransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  transaction,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    type: transaction?.type || 'income',
    category: transaction?.category || 'general',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    paymentMethod: transaction?.paymentMethod || 'bank_transfer',
    reference: transaction?.reference || '',
    notes: transaction?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const transactionTypes = [
    { value: 'income', label: 'Revenus', icon: PlusIcon, color: 'text-green-400' },
    { value: 'expense', label: 'Dépenses', icon: MinusIcon, color: 'text-red-400' }
  ];

  const categories = {
    income: [
      { value: 'casting_fees', label: 'Frais de Casting' },
      { value: 'model_contracts', label: 'Contrats Mannequins' },
      { value: 'training_fees', label: 'Frais de Formation' },
      { value: 'event_organization', label: 'Organisation d\'Événements' },
      { value: 'other_income', label: 'Autres Revenus' }
    ],
    expense: [
      { value: 'salaries', label: 'Salaires' },
      { value: 'rent', label: 'Loyer' },
      { value: 'utilities', label: 'Services Publics' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'equipment', label: 'Équipement' },
      { value: 'travel', label: 'Voyages' },
      { value: 'other_expense', label: 'Autres Dépenses' }
    ]
  };

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Virement Bancaire' },
    { value: 'cash', label: 'Espèces' },
    { value: 'check', label: 'Chèque' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'other', label: 'Autre' }
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

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const transactionData = {
      ...formData,
      id: transaction?.id || Date.now().toString(),
      amount: parseFloat(formData.amount),
      createdAt: transaction?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin' // En production, utiliser l'ID de l'utilisateur connecté
    };

    onSave(transactionData);
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
              {isEdit ? 'Modifier la Transaction' : 'Nouvelle Transaction'}
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
          {/* Type de transaction */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-3">
              Type de Transaction *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {transactionTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.type === type.value
                      ? 'border-pm-gold bg-pm-gold/10'
                      : 'border-pm-gold/20 hover:border-pm-gold/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <type.icon className={`w-5 h-5 ${type.color}`} />
                  <span className="text-pm-off-white">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                {categories[formData.type as keyof typeof categories].map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

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
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                errors.description ? 'border-red-500' : 'border-pm-gold/30'
              }`}
              placeholder="Description de la transaction"
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.date ? 'border-red-500' : 'border-pm-gold/30'
                }`}
              />
              {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
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
              placeholder="Numéro de référence ou facture"
            />
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
              {isEdit ? 'Mettre à jour' : 'Ajouter la Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialTransactionModal;
