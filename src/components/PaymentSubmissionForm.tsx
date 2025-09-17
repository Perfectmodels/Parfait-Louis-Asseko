import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PaymentSubmission {
  id: string;
  modelId: string;
  modelName: string;
  amount: number;
  currency: string;
  paymentType: 'cotisation' | 'inscription' | 'avance' | 'cotisation_inscription';
  description: string;
  paymentMethod: string;
  notes: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

interface PaymentSubmissionFormProps {
  modelId: string;
  modelName: string;
  onClose: () => void;
}

const PaymentSubmissionForm: React.FC<PaymentSubmissionFormProps> = ({ 
  modelId, 
  modelName, 
  onClose 
}) => {
  const { data, saveData } = useData();
  const [formData, setFormData] = useState({
    paymentType: 'cotisation' as 'cotisation' | 'inscription' | 'avance' | 'cotisation_inscription',
    amount: 1500,
    paymentMethod: 'cash',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!data) return;

      // Calculer le montant selon le type de paiement
      let amount = formData.amount;
      let description = '';
      
      if (formData.paymentType === 'cotisation') {
        amount = 1500;
        description = 'Cotisation mensuelle';
      } else if (formData.paymentType === 'inscription') {
        amount = 15000;
        description = 'Frais d\'inscription';
      } else if (formData.paymentType === 'cotisation_inscription') {
        amount = 16500; // 1500 + 15000
        description = 'Cotisation mensuelle + Frais d\'inscription';
      } else if (formData.paymentType === 'avance') {
        description = `Paiement en avance (${Math.floor(amount / 1500)} mois)`;
      }

      const newSubmission: PaymentSubmission = {
        id: `payment_${Date.now()}`,
        modelId,
        modelName,
        amount,
        currency: 'FCFA',
        paymentType: formData.paymentType,
        description,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Ajouter la soumission à la liste
      const updatedSubmissions = [...(data.paymentSubmissions || []), newSubmission];

      await saveData({ 
        ...data, 
        paymentSubmissions: updatedSubmissions 
      });

      alert('Paiement soumis avec succès ! Il sera validé par l\'administration dans les plus brefs délais.');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Une erreur est survenue lors de la soumission du paiement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setFormData({ ...formData, amount });
  };

  // Fonctions de drag and drop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragRef.current && dragRef.current.contains(e.target as Node)) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - (modalRef.current?.offsetWidth || 0) / 2,
        y: e.clientY - (modalRef.current?.offsetHeight || 0) / 2
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-pm-dark border border-pm-gold/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {/* Header avec poignée de déplacement */}
        <div 
          ref={dragRef}
          className="flex items-center justify-between p-4 border-b border-pm-gold/20 cursor-move bg-pm-gold/5"
          onMouseDown={handleMouseDown}
        >
          <h3 className="text-xl font-bold text-pm-gold">
            Soumettre un Paiement
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu de la modal */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
        
        <div className="mb-3 p-3 bg-pm-gold/10 border border-pm-gold/20 rounded-lg">
          <h4 className="font-semibold text-pm-gold mb-1 text-sm">Mannequin</h4>
          <p className="text-pm-off-white text-sm">{modelName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche - Type de paiement */}
            <div>
              <label className="admin-label">Type de paiement</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg cursor-pointer hover:bg-green-500/20 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="cotisation"
                    checked={formData.paymentType === 'cotisation'}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any, amount: 1500 })}
                    className="w-4 h-4 text-green-500 bg-pm-dark border-green-500/30 focus:ring-green-500 focus:ring-2"
                  />
                  <div>
                    <p className="font-medium text-green-300 text-sm">Cotisation mensuelle</p>
                    <p className="text-xs text-green-400/80">1,500 FCFA - Paiement mensuel standard</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="inscription"
                    checked={formData.paymentType === 'inscription'}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any, amount: 15000 })}
                    className="w-4 h-4 text-blue-500 bg-pm-dark border-blue-500/30 focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <p className="font-medium text-blue-300 text-sm">Frais d'inscription</p>
                    <p className="text-xs text-blue-400/80">15,000 FCFA - Inscription pour nouveaux mannequins</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg cursor-pointer hover:bg-purple-500/20 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="cotisation_inscription"
                    checked={formData.paymentType === 'cotisation_inscription'}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any, amount: 16500 })}
                    className="w-4 h-4 text-purple-500 bg-pm-dark border-purple-500/30 focus:ring-purple-500 focus:ring-2"
                  />
                  <div>
                    <p className="font-medium text-purple-300 text-sm">Cotisation + Inscription</p>
                    <p className="text-xs text-purple-400/80">16,500 FCFA - Pour nouveaux mannequins</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg cursor-pointer hover:bg-orange-500/20 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="avance"
                    checked={formData.paymentType === 'avance'}
                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
                    className="w-4 h-4 text-orange-500 bg-pm-dark border-orange-500/30 focus:ring-orange-500 focus:ring-2"
                  />
                  <div>
                    <p className="font-medium text-orange-300 text-sm">Paiement en avance</p>
                    <p className="text-xs text-orange-400/80">Montant personnalisé - Calcul automatique des mois</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Colonne droite - Détails du paiement */}
            <div className="space-y-4">
              <div>
                <label className="admin-label">Montant (FCFA)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="admin-input"
                  placeholder="1500"
                  required
                  disabled={formData.paymentType !== 'avance'}
                />
                {formData.paymentType === 'avance' && formData.amount > 1500 && (
                  <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <p className="text-xs text-orange-300">
                      <strong>{Math.floor(formData.amount / 1500)} mois</strong> d'avance 
                      {formData.amount % 1500 > 0 ? ` + ${formData.amount % 1500} FCFA de surplus` : ''}
                    </p>
                    <p className="text-xs text-orange-400/80 mt-1">
                      Prochaine échéance dans {Math.floor(formData.amount / 1500)} mois
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="admin-label">Méthode de paiement</label>
                <select 
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="admin-input"
                >
                  <option value="cash">Espèces</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="bank_transfer">Virement bancaire</option>
                  <option value="check">Chèque</option>
                </select>
              </div>

              <div>
                <label className="admin-label">Notes (optionnel)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="admin-input"
                  rows={3}
                  placeholder="Informations supplémentaires sur le paiement..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-pm-gold/50 text-pm-gold rounded-lg hover:bg-pm-gold/10 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50 text-sm"
            >
              {isSubmitting ? 'Soumission...' : 'Soumettre'}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-300 mb-1 text-sm">Information importante</h4>
              <p className="text-xs text-blue-400/80">
                Votre paiement sera soumis pour validation par l'administration. 
                Vous recevrez une notification une fois qu'il sera approuvé.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSubmissionForm;
