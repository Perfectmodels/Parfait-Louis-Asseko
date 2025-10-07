import React, { useState, useEffect } from 'react';
import { XMarkIcon, CurrencyDollarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface AdvancedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: any) => void;
  modelId: string;
  modelName: string;
  paymentType: 'inscription' | 'cotisation';
}

const AdvancedPaymentModal: React.FC<AdvancedPaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  modelId,
  modelName,
  paymentType
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'installments' | 'advance'>('full');
  const [installmentCount, setInstallmentCount] = useState(3);
  const [advanceMonths, setAdvanceMonths] = useState(3);
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prix de base
  const basePrices = {
    inscription: 15000,
    cotisation: 1500
  };

  const currentPrice = basePrices[paymentType];

  // Calculer le montant selon le type de paiement
  useEffect(() => {
    if (paymentMethod === 'full') {
      setAmount(currentPrice);
    } else if (paymentMethod === 'installments') {
      setAmount(Math.ceil(currentPrice / installmentCount));
    } else if (paymentMethod === 'advance') {
      setAmount(currentPrice * advanceMonths);
    }
  }, [paymentMethod, installmentCount, advanceMonths, currentPrice]);

  // Calculer la prochaine date de paiement
  const getNextPaymentDate = () => {
    const today = new Date();
    if (paymentMethod === 'installments') {
      // Pour les tranches, prochaine date dans 1 mois
      return new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    } else if (paymentMethod === 'advance') {
      // Pour les paiements anticipés, prochaine date après les mois payés
      return new Date(today.getFullYear(), today.getMonth() + advanceMonths + 1, today.getDate());
    }
    return null;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'installments' && installmentCount < 2) {
      newErrors.installmentCount = 'Minimum 2 tranches requises';
    }
    if (paymentMethod === 'advance' && advanceMonths < 2) {
      newErrors.advanceMonths = 'Minimum 2 mois d\'avance requis';
    }
    if (amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const nextPaymentDate = getNextPaymentDate();
    
    const paymentData = {
      id: `payment_${Date.now()}`,
      modelId,
      modelName,
      type: paymentType,
      amount,
      method: 'advanced_payment',
      status: 'En attente',
      paymentMethod,
      installmentCount: paymentMethod === 'installments' ? installmentCount : null,
      advanceMonths: paymentMethod === 'advance' ? advanceMonths : null,
      totalAmount: currentPrice,
      remainingAmount: paymentMethod === 'installments' ? currentPrice - amount : 0,
      nextPaymentDate: nextPaymentDate?.toISOString(),
      notes,
      submissionDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
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
              Paiement Avancé - {modelName}
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
          {/* Type de paiement */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-3">
              Type de paiement
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'full' 
                  ? 'border-pm-gold bg-pm-gold/10' 
                  : 'border-pm-gold/30 hover:border-pm-gold/50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="full"
                  checked={paymentMethod === 'full'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-lg font-semibold text-pm-gold mb-1">Paiement Complet</div>
                  <div className="text-sm text-pm-off-white/70">{currentPrice.toLocaleString()} FCFA</div>
                </div>
              </label>

              <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'installments' 
                  ? 'border-pm-gold bg-pm-gold/10' 
                  : 'border-pm-gold/30 hover:border-pm-gold/50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="installments"
                  checked={paymentMethod === 'installments'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-lg font-semibold text-pm-gold mb-1">Par Tranches</div>
                  <div className="text-sm text-pm-off-white/70">Paiement échelonné</div>
                </div>
              </label>

              <label className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'advance' 
                  ? 'border-pm-gold bg-pm-gold/10' 
                  : 'border-pm-gold/30 hover:border-pm-gold/50'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="advance"
                  checked={paymentMethod === 'advance'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-lg font-semibold text-pm-gold mb-1">Paiement Anticipé</div>
                  <div className="text-sm text-pm-off-white/70">Plusieurs mois d'avance</div>
                </div>
              </label>
            </div>
          </div>

          {/* Configuration selon le type */}
          {paymentMethod === 'installments' && (
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Nombre de tranches
              </label>
              <select
                value={installmentCount}
                onChange={(e) => setInstallmentCount(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                {[2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} tranches</option>
                ))}
              </select>
              {errors.installmentCount && (
                <p className="text-red-400 text-sm mt-1">{errors.installmentCount}</p>
              )}
            </div>
          )}

          {paymentMethod === 'advance' && (
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Nombre de mois d'avance
              </label>
              <select
                value={advanceMonths}
                onChange={(e) => setAdvanceMonths(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              >
                {[2, 3, 4, 5, 6, 12].map(num => (
                  <option key={num} value={num}>{num} mois</option>
                ))}
              </select>
              {errors.advanceMonths && (
                <p className="text-red-400 text-sm mt-1">{errors.advanceMonths}</p>
              )}
            </div>
          )}

          {/* Résumé du paiement */}
          <div className="bg-black/30 border border-pm-gold/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-pm-gold mb-3">Résumé du Paiement</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-pm-off-white/70">Type:</span>
                <span className="text-pm-off-white">
                  {paymentType === 'inscription' ? 'Inscription' : 'Cotisation'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-pm-off-white/70">Montant total:</span>
                <span className="text-pm-gold font-semibold">{currentPrice.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pm-off-white/70">Montant à payer:</span>
                <span className="text-pm-gold font-semibold">{amount.toLocaleString()} FCFA</span>
              </div>
              {paymentMethod === 'installments' && (
                <div className="flex justify-between">
                  <span className="text-pm-off-white/70">Tranches restantes:</span>
                  <span className="text-pm-off-white">{installmentCount - 1}</span>
                </div>
              )}
              {paymentMethod === 'advance' && (
                <div className="flex justify-between">
                  <span className="text-pm-off-white/70">Mois couverts:</span>
                  <span className="text-pm-off-white">{advanceMonths} mois</span>
                </div>
              )}
              {getNextPaymentDate() && (
                <div className="flex justify-between">
                  <span className="text-pm-off-white/70">Prochaine échéance:</span>
                  <span className="text-pm-off-white">
                    {getNextPaymentDate()?.toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              placeholder="Notes sur ce paiement..."
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
              Enregistrer le Paiement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedPaymentModal;
