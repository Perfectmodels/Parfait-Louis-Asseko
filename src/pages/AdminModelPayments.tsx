import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { db } from '../../firebaseConfig';
import { ref, push, set } from 'firebase/database';
import { 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  BanknotesIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

type PaymentType = 'inscription' | 'cotisation' | 'both';
type PaymentMethod = 'Espèces' | 'Virement' | 'Mobile Money' | 'Chèque';

interface PaymentFormData {
  modelId: string;
  modelName: string;
  paymentType: PaymentType;
  // Inscription
  inscriptionAmount: number;
  // Cotisation
  cotisationMonths: number;
  cotisationPerMonth: number;
  // Paiement par tranches
  isPartialPayment: boolean;
  partialAmount: number;
  // Informations générales
  paymentMethod: PaymentMethod;
  paymentDate: string;
  notes: string;
}

const AdminModelPayments: React.FC = () => {
  const { data, saveData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const INSCRIPTION_PRICE = 15000; // FCFA
  const COTISATION_PRICE = 1500; // FCFA par mois

  const [formData, setFormData] = useState<PaymentFormData>({
    modelId: '',
    modelName: '',
    paymentType: 'cotisation',
    inscriptionAmount: INSCRIPTION_PRICE,
    cotisationMonths: 1,
    cotisationPerMonth: COTISATION_PRICE,
    isPartialPayment: false,
    partialAmount: 0,
    paymentMethod: 'Espèces',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Filtrer les mannequins
  const filteredModels = useMemo(() => {
    if (!data?.models) return [];
    return data.models.filter(model => 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.models, searchTerm]);

  // Calculer le statut de paiement de chaque mannequin
  const getModelPaymentStatus = (modelId: string) => {
    const payments = data?.monthlyPayments || [];
    const modelPayments = payments.filter((p: any) => p.modelId === modelId);
    
    const hasInscription = modelPayments.some((p: any) => 
      p.type === 'inscription' || p.notes?.toLowerCase().includes('inscription')
    );

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const hasCotisationThisMonth = modelPayments.some((p: any) => 
      p.month === currentMonth && p.status === 'Payé'
    );

    return {
      hasInscription,
      isUpToDate: hasCotisationThisMonth,
      lastPaymentDate: modelPayments.length > 0 
        ? modelPayments[modelPayments.length - 1].paymentDate 
        : null
    };
  };

  // Ouvrir le modal de paiement
  const handleOpenPaymentModal = (model: any) => {
    setSelectedModel(model);
    setFormData({
      ...formData,
      modelId: model.id,
      modelName: model.name,
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setShowPaymentModal(true);
  };

  // Calculer le total à payer
  const calculateTotal = () => {
    let total = 0;

    if (formData.paymentType === 'inscription' || formData.paymentType === 'both') {
      total += formData.inscriptionAmount;
    }

    if (formData.paymentType === 'cotisation' || formData.paymentType === 'both') {
      const cotisationTotal = formData.cotisationMonths * formData.cotisationPerMonth;
      
      if (formData.isPartialPayment) {
        total += formData.partialAmount;
      } else {
        total += cotisationTotal;
      }
    }

    return total;
  };

  // Soumettre le paiement
  const handleSubmitPayment = async () => {
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const paymentsRef = ref(db, 'monthlyPayments');
      const transactionsRef = ref(db, 'accountingTransactions');
      const newPayments: any[] = [];
      const newTransactions: any[] = [];

      // Paiement d'inscription
      if (formData.paymentType === 'inscription' || formData.paymentType === 'both') {
        const inscriptionPayment = {
          id: `payment-${Date.now()}-inscription`,
          modelId: formData.modelId,
          modelName: formData.modelName,
          type: 'inscription',
          amount: formData.inscriptionAmount,
          paymentMethod: formData.paymentMethod,
          paymentDate: formData.paymentDate,
          status: 'Payé',
          notes: formData.notes,
          createdAt: new Date().toISOString()
        };
        newPayments.push(inscriptionPayment);

        // Transaction comptable
        newTransactions.push({
          id: `trans-${Date.now()}-inscription`,
          type: 'recette',
          category: 'Inscriptions',
          amount: formData.inscriptionAmount,
          description: `Inscription - ${formData.modelName}`,
          date: formData.paymentDate,
          paymentMethod: formData.paymentMethod,
          relatedTo: formData.modelId,
          createdAt: new Date().toISOString()
        });
      }

      // Paiement de cotisation
      if (formData.paymentType === 'cotisation' || formData.paymentType === 'both') {
        const baseMonth = new Date(formData.paymentDate);
        const cotisationTotal = formData.cotisationMonths * formData.cotisationPerMonth;
        const amountToPay = formData.isPartialPayment ? formData.partialAmount : cotisationTotal;

        if (formData.isPartialPayment) {
          // Paiement partiel pour le mois en cours
          const cotisationPayment = {
            id: `payment-${Date.now()}-cotisation-partial`,
            modelId: formData.modelId,
            modelName: formData.modelName,
            type: 'cotisation',
            month: baseMonth.toISOString().slice(0, 7),
            amount: formData.partialAmount,
            totalDue: formData.cotisationPerMonth,
            remaining: formData.cotisationPerMonth - formData.partialAmount,
            paymentMethod: formData.paymentMethod,
            paymentDate: formData.paymentDate,
            status: 'Partiel',
            isPartial: true,
            notes: formData.notes || `Paiement partiel (${formData.partialAmount} FCFA sur ${formData.cotisationPerMonth} FCFA)`,
            createdAt: new Date().toISOString()
          };
          newPayments.push(cotisationPayment);
        } else {
          // Paiement anticipé de plusieurs mois
          for (let i = 0; i < formData.cotisationMonths; i++) {
            const monthDate = new Date(baseMonth);
            monthDate.setMonth(monthDate.getMonth() + i);
            const monthStr = monthDate.toISOString().slice(0, 7);

            const cotisationPayment = {
              id: `payment-${Date.now()}-cotisation-${i}`,
              modelId: formData.modelId,
              modelName: formData.modelName,
              type: 'cotisation',
              month: monthStr,
              amount: formData.cotisationPerMonth,
              paymentMethod: formData.paymentMethod,
              paymentDate: formData.paymentDate,
              status: 'Payé',
              isAdvance: i > 0,
              notes: i > 0 
                ? `${formData.notes} - Paiement anticipé pour ${monthStr}` 
                : formData.notes,
              createdAt: new Date().toISOString()
            };
            newPayments.push(cotisationPayment);
          }
        }

        // Transaction comptable pour cotisations
        newTransactions.push({
          id: `trans-${Date.now()}-cotisation`,
          type: 'recette',
          category: 'Cotisations',
          amount: amountToPay,
          description: formData.isPartialPayment
            ? `Cotisation partielle - ${formData.modelName} (${formData.partialAmount} FCFA)`
            : `Cotisation ${formData.cotisationMonths} mois - ${formData.modelName}`,
          date: formData.paymentDate,
          paymentMethod: formData.paymentMethod,
          relatedTo: formData.modelId,
          createdAt: new Date().toISOString()
        });
      }

      // Sauvegarder dans Firebase
      const currentPayments = data?.monthlyPayments || [];
      const currentTransactions = data?.accountingTransactions || [];

      await saveData({
        ...data,
        monthlyPayments: [...currentPayments, ...newPayments],
        accountingTransactions: [...currentTransactions, ...newTransactions]
      });

      setSuccessMessage(`✅ Paiement enregistré avec succès ! Total: ${calculateTotal().toLocaleString()} FCFA`);
      setShowPaymentModal(false);
      
      // Reset form
      setTimeout(() => {
        setSuccessMessage('');
        setSelectedModel(null);
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      alert('Erreur lors de l\'enregistrement du paiement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-playfair text-pm-gold mb-2">
            💰 Gestion des Paiements Mannequins
          </h1>
          <p className="text-pm-off-white/70">
            Enregistrez les inscriptions, cotisations mensuelles et paiements anticipés
          </p>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="mb-6 bg-green-900/30 border border-green-500/50 text-green-400 p-4 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Recherche */}
        <div className="mb-6 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pm-gold" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un mannequin par nom ou ID..."
            className="w-full bg-black/30 border border-pm-gold/30 rounded-lg pl-12 pr-4 py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:border-pm-gold"
          />
        </div>

        {/* Liste des mannequins */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => {
            const status = getModelPaymentStatus(model.id);

            return (
              <div
                key={model.id}
                className="bg-gradient-to-br from-black via-pm-dark to-black border border-pm-gold/30 rounded-lg p-6 hover:border-pm-gold transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={model.imageUrl || '/placeholder-model.jpg'}
                      alt={model.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-pm-gold"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{model.name}</h3>
                      <p className="text-xs text-pm-off-white/50">{model.id}</p>
                    </div>
                  </div>
                </div>

                {/* Statut */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    {status.hasInscription ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    )}
                    <span className={status.hasInscription ? 'text-green-400' : 'text-red-400'}>
                      {status.hasInscription ? 'Inscrit' : 'Non inscrit'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {status.isUpToDate ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                    )}
                    <span className={status.isUpToDate ? 'text-green-400' : 'text-orange-400'}>
                      {status.isUpToDate ? 'Cotisation à jour' : 'Cotisation en retard'}
                    </span>
                  </div>

                  {status.lastPaymentDate && (
                    <p className="text-xs text-pm-off-white/50">
                      Dernier paiement: {new Date(status.lastPaymentDate).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                {/* Bouton paiement */}
                <button
                  onClick={() => handleOpenPaymentModal(model)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pm-gold to-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:scale-105 transition-transform duration-300"
                >
                  <BanknotesIcon className="w-5 h-5" />
                  Enregistrer un paiement
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal de paiement */}
        {showPaymentModal && selectedModel && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-black via-pm-dark to-black border border-pm-gold rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-playfair text-pm-gold mb-6">
                💳 Nouveau Paiement - {selectedModel.name}
              </h2>

              {/* Type de paiement */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-pm-gold mb-2">Type de paiement *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'inscription', label: 'Inscription uniquement' },
                    { value: 'cotisation', label: 'Cotisation uniquement' },
                    { value: 'both', label: 'Inscription + Cotisation' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, paymentType: option.value as PaymentType })}
                      className={`py-3 px-4 rounded-lg border-2 font-bold text-sm transition-all ${
                        formData.paymentType === option.value
                          ? 'bg-pm-gold text-black border-pm-gold'
                          : 'bg-black/50 text-pm-off-white border-pm-off-white/30 hover:border-pm-gold'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inscription */}
              {(formData.paymentType === 'inscription' || formData.paymentType === 'both') && (
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <h3 className="font-bold text-blue-400 mb-3">📝 Inscription</h3>
                  <div>
                    <label className="block text-sm text-pm-off-white/70 mb-2">Montant</label>
                    <input
                      type="number"
                      value={formData.inscriptionAmount}
                      onChange={(e) => setFormData({ ...formData, inscriptionAmount: Number(e.target.value) })}
                      className="w-full bg-black/50 border border-pm-off-white/30 rounded-lg p-3 text-pm-off-white focus:outline-none focus:border-pm-gold"
                    />
                    <p className="text-xs text-pm-off-white/50 mt-1">Montant standard: {INSCRIPTION_PRICE.toLocaleString()} FCFA</p>
                  </div>
                </div>
              )}

              {/* Cotisation */}
              {(formData.paymentType === 'cotisation' || formData.paymentType === 'both') && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <h3 className="font-bold text-green-400 mb-3">💵 Cotisation Mensuelle</h3>
                  
                  {/* Paiement partiel */}
                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPartialPayment}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          isPartialPayment: e.target.checked,
                          cotisationMonths: e.target.checked ? 1 : formData.cotisationMonths
                        })}
                        className="w-5 h-5 text-pm-gold focus:ring-pm-gold"
                      />
                      <span className="text-sm font-bold text-pm-off-white">Paiement par tranche (partiel)</span>
                    </label>
                  </div>

                  {formData.isPartialPayment ? (
                    <div>
                      <label className="block text-sm text-pm-off-white/70 mb-2">Montant de la tranche</label>
                      <input
                        type="number"
                        value={formData.partialAmount}
                        onChange={(e) => setFormData({ ...formData, partialAmount: Number(e.target.value) })}
                        max={formData.cotisationPerMonth}
                        className="w-full bg-black/50 border border-pm-off-white/30 rounded-lg p-3 text-pm-off-white focus:outline-none focus:border-pm-gold"
                      />
                      <p className="text-xs text-pm-off-white/50 mt-1">
                        Restant à payer: {(formData.cotisationPerMonth - formData.partialAmount).toLocaleString()} FCFA
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-pm-off-white/70 mb-2">Nombre de mois (paiement anticipé)</label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={formData.cotisationMonths}
                          onChange={(e) => setFormData({ ...formData, cotisationMonths: Number(e.target.value) })}
                          className="w-full bg-black/50 border border-pm-off-white/30 rounded-lg p-3 text-pm-off-white focus:outline-none focus:border-pm-gold"
                        />
                        <p className="text-xs text-pm-off-white/50 mt-1">
                          {formData.cotisationMonths} mois × {formData.cotisationPerMonth.toLocaleString()} FCFA = {(formData.cotisationMonths * formData.cotisationPerMonth).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Informations de paiement */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-pm-gold mb-2">Mode de paiement *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full bg-black/50 border border-pm-off-white/30 rounded-lg p-3 text-pm-off-white focus:outline-none focus:border-pm-gold"
                  >
                    <option value="Espèces">Espèces</option>
                    <option value="Virement">Virement bancaire</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Chèque">Chèque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-pm-gold mb-2">Date de paiement *</label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className="w-full bg-black/50 border border-pm-off-white/30 rounded-lg p-3 text-pm-off-white focus:outline-none focus:border-pm-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-pm-gold mb-2">Notes (optionnel)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full bg-black/50 border border-pm-off-white/30 rounded-lg p-3 text-pm-off-white focus:outline-none focus:border-pm-gold resize-none"
                    placeholder="Informations complémentaires..."
                  />
                </div>
              </div>

              {/* Total */}
              <div className="bg-pm-gold/20 border border-pm-gold rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">TOTAL À PAYER:</span>
                  <span className="text-2xl font-bold text-pm-gold">
                    {calculateTotal().toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={isSubmitting || calculateTotal() === 0}
                  className="flex-1 bg-gradient-to-r from-pm-gold to-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Valider le paiement'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModelPayments;

