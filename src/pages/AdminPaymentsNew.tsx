import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { updateModelPaymentStatus, manualUpdateModelStatus } from '../utils/paymentUtils';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  PlusIcon,
  PencilIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon as SolidExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const AdminPaymentsNew: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'lastPayment'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleManualUpdate = async (modelId: string, status: 'complete' | 'pending' | 'inscription_only') => {
    const model = filteredAndSortedModels.find(m => m.id === modelId);
    const confirmation = window.confirm(
      `Êtes-vous sûr de vouloir forcer le statut de "${model?.name}" à "${status}" ?\n\nCette action ne créera PAS de transaction comptable.`
    );

    if (confirmation) {
      const success = await manualUpdateModelStatus(data, saveData, modelId, status);
      if (success) {
        alert("Statut mis à jour avec succès.");
      } else {
        alert("Erreur lors de la mise à jour du statut.");
      }
      setOpenMenuId(null);
    }
  };


  // Composant d'indicateur de statut de paiement
  const PaymentStatusIndicator: React.FC<{ status: string; lastPaymentDate?: string }> = ({ status, lastPaymentDate }) => {
    const getStatusInfo = () => {
      switch (status) {
        case 'complete':
          return { 
            icon: <ShieldCheckIcon className="w-5 h-5 text-teal-400" />,
            text: 'À jour',
            textColor: 'text-teal-400',
            bgColor: 'bg-teal-500/10',
            borderColor: 'border-teal-500/20'
          };
        case 'inscription_only':
          return { 
            icon: <CheckCircleIcon className="w-5 h-5 text-blue-400" />,
            text: 'Inscription OK',
            textColor: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
          };
        case 'cotisation_only':
          return { 
            icon: <CheckCircleIcon className="w-5 h-5 text-green-400" />,
            text: 'Cotisation OK',
            textColor: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/20'
          };
        case 'pending':
          return { 
            icon: <ClockIcon className="w-5 h-5 text-yellow-400" />,
            text: 'En attente',
            textColor: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/20'
          };
        case 'overdue':
          return { 
            icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />,
            text: 'En retard',
            textColor: 'text-red-400',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/20'
          };
        default:
          return { 
            icon: <ExclamationTriangleIcon className="w-5 h-5 text-gray-400" />,
            text: 'Non défini',
            textColor: 'text-gray-400',
            bgColor: 'bg-gray-500/10',
            borderColor: 'border-gray-500/20'
          };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
        {statusInfo.icon}
        <span className={`text-sm font-medium ${statusInfo.textColor}`}>
          {statusInfo.text}
        </span>
        {lastPaymentDate && (
          <span className="text-xs text-gray-400">
            ({new Date(lastPaymentDate).toLocaleDateString('fr-FR')})
          </span>
        )}
      </div>
    );
  };

  // Composant de formulaire de paiement rapide
  const QuickPaymentForm: React.FC<{ model: any; onClose: () => void; onSuccess: () => void }> = ({ model, onClose, onSuccess }) => {
    const [paymentType, setPaymentType] = useState<'inscription' | 'cotisation' | 'both' | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile_money' | 'bank_transfer'>('mobile_money');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isInscriptionPaid = model.paymentStatus?.inscription === 'paid';
    const isCotisationPaidThisMonth = () => {
      if (!model.paymentStatus?.lastCotisationDate) return false;
      const lastPayment = new Date(model.paymentStatus.lastCotisationDate);
      const today = new Date();
      return lastPayment.getMonth() === today.getMonth() && lastPayment.getFullYear() === today.getFullYear();
    };

    const handlePaymentTypeSelect = (type: 'inscription' | 'cotisation' | 'both') => {
      setPaymentType(type);
      switch (type) {
        case 'inscription':
          setAmount('15000');
          break;
        case 'cotisation':
          setAmount('1500');
          break;
        case 'both':
          setAmount('16500');
          break;
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!paymentType) {
        alert("Veuillez sélectionner un type de paiement.");
        return;
      }
      setIsSubmitting(true);

      try {
        await updateModelPaymentStatus(
          data,
          saveData,
          model.id,
          {
            paymentType: paymentType === 'both' ? 'cotisation_inscription' : paymentType,
            amount: parseFloat(amount) || 0,
            paymentMethod,
            notes,
            description: `Paiement ${paymentType === 'both' ? 'inscription et cotisation' : paymentType}`
          }
        );
        
        onSuccess();
        onClose();
      } catch (error) {
        console.error('Erreur lors de la mise à jour du paiement:', error);
        alert('Erreur lors de la mise à jour du paiement');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-pm-dark border border-pm-gold/20 rounded-2xl p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-pm-gold">Paiement Rapide</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-pm-gold/10 rounded-lg border border-pm-gold/20">
            <p className="text-pm-gold font-medium">{model.name}</p>
            <p className="text-sm text-gray-300">Matricule: {model.matricule}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type de paiement
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: 'inscription', label: 'Inscription', amount: '15,000', disabled: isInscriptionPaid },
                  { value: 'cotisation', label: 'Cotisation', amount: '1,500', disabled: isCotisationPaidThisMonth() },
                  { value: 'both', label: 'Les deux', amount: '16,500', disabled: isInscriptionPaid }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handlePaymentTypeSelect(type.value as any)}
                    disabled={type.disabled}
                    className={`p-3 rounded-lg border text-sm text-center font-medium transition-all transform hover:scale-105 ${
                      paymentType === type.value
                        ? 'bg-pm-gold text-pm-dark border-pm-gold shadow-lg'
                        : 'bg-pm-dark/50 text-gray-300 border-gray-600 hover:border-pm-gold/50'
                    } ${type.disabled ? 'opacity-50 cursor-not-allowed bg-gray-700 hover:border-gray-600' : ''}`}
                  >
                    <div className="font-semibold">{type.label}</div>
                    <div className="text-xs mt-1">{type.amount} FCFA</div>
                    {type.disabled && type.value === 'inscription' && <div className="text-xs text-green-400 mt-1">(Déjà payé)</div>}
                    {type.disabled && type.value === 'cotisation' && <div className="text-xs text-green-400 mt-1">(Payé ce mois-ci)</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Montant (FCFA)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Le montant s'affichera ici"
                readOnly
                className="w-full px-3 py-2 bg-pm-dark/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pm-gold focus:outline-none cursor-default"
                required
              />
            </div>

            {/* Méthode de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Méthode de paiement
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-pm-dark/50 border border-gray-600 rounded-lg text-white focus:border-pm-gold focus:outline-none"
              >
                <option value="mobile_money">Mobile Money</option>
                <option value="cash">Espèces</option>
                <option value="bank_transfer">Virement bancaire</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informations supplémentaires..."
                className="w-full px-3 py-2 bg-pm-dark/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-pm-gold focus:outline-none h-20 resize-none"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !paymentType}
                className="flex-1 px-4 py-2 bg-pm-gold text-pm-dark rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-pm-dark border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CurrencyDollarIcon className="w-5 h-5" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Calculer le statut de paiement pour chaque modèle
  const modelsWithPaymentStatus = useMemo(() => {
    if (!data || !isInitialized) return [];

    const allModels = [
      ...(data.models || []).map((model: any) => ({ ...model, type: 'pro' })),
      ...(data.beginnerStudents || []).map((model: any) => ({ ...model, type: 'beginner' }))
    ];

    return allModels.map((model: any) => {
      const paymentStatus = model.paymentStatus || {};
      const hasInscription = paymentStatus.inscription === 'paid';
      const hasCotisation = paymentStatus.cotisation === 'paid';

      let statusCategory = 'pending';
      if (hasInscription && hasCotisation) {
        statusCategory = 'complete';
      } else if (hasInscription && !hasCotisation) {
        statusCategory = 'inscription_only';
      } else if (!hasInscription && hasCotisation) {
        statusCategory = 'cotisation_only';
      }

      return {
        ...model,
        statusCategory,
        paymentStatus
      };
    });
  }, [data, isInitialized]);

  // Filtrer et trier les modèles
  const filteredAndSortedModels = useMemo(() => {
    let filtered = modelsWithPaymentStatus;

    // Filtrage par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(model => model.statusCategory === filterStatus);
    }

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.statusCategory.localeCompare(b.statusCategory);
          break;
        case 'lastPayment':
          const aDate = a.paymentStatus?.lastPaymentDate ? new Date(a.paymentStatus.lastPaymentDate) : new Date(0);
          const bDate = b.paymentStatus?.lastPaymentDate ? new Date(b.paymentStatus.lastPaymentDate) : new Date(0);
          comparison = aDate.getTime() - bDate.getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [modelsWithPaymentStatus, filterStatus, searchTerm, sortBy, sortOrder]);

  // Statistiques
  const stats = useMemo(() => {
    const total = modelsWithPaymentStatus.length;
    const complete = modelsWithPaymentStatus.filter(m => m.statusCategory === 'complete').length;
    const pending = modelsWithPaymentStatus.filter(m => m.statusCategory === 'pending').length;
    const partial = modelsWithPaymentStatus.filter(m => 
      m.statusCategory === 'inscription_only' || m.statusCategory === 'cotisation_only'
    ).length;

    return { total, complete, pending, partial };
  }, [modelsWithPaymentStatus]);

  if (!isInitialized || !data) {
    return (
      <div className="min-h-screen bg-pm-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pm-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Gestion des Paiements - Admin" />
      <div className="min-h-screen bg-pm-dark text-pm-off-white">
        {/* Header */}
        <div className="bg-pm-dark border-b border-pm-gold/20 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-pm-gold hover:text-yellow-400 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                Retour au panel
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-pm-gold mb-2">
                  Gestion des Paiements
                </h1>
                <p className="text-gray-400">
                  Gestion optimisée des paiements d'inscription et de cotisation
                </p>
              </div>
              
              <button
                onClick={() => setShowPaymentForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark rounded-lg hover:bg-yellow-400 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nouveau paiement
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-sm text-gray-400">Total mannequins</p>
                </div>
              </div>
            </div>

            <div className="bg-pm-dark/50 border border-teal-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-teal-400">{stats.complete}</p>
                  <p className="text-sm text-gray-400">À jour</p>
                </div>
              </div>
            </div>

            <div className="bg-pm-dark/50 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                  <p className="text-sm text-gray-400">En attente</p>
                </div>
              </div>
            </div>

            <div className="bg-pm-dark/50 border border-orange-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-400">{stats.partial}</p>
                  <p className="text-sm text-gray-400">Partiel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-pm-gold">Filtres et recherche</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FunnelIcon className="w-4 h-4" />
                {showFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recherche */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rechercher
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nom ou matricule..."
                    className="w-full px-3 py-2 bg-pm-dark/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-pm-gold focus:outline-none"
                  />
                </div>

                {/* Filtre par statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Statut
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-pm-dark/50 border border-gray-600 rounded-lg text-white focus:border-pm-gold focus:outline-none"
                  >
                    <option value="all">Tous</option>
                    <option value="complete">À jour</option>
                    <option value="inscription_only">Inscription seulement</option>
                    <option value="cotisation_only">Cotisation seulement</option>
                    <option value="pending">En attente</option>
                  </select>
                </div>

                {/* Tri */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trier par
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="flex-1 px-3 py-2 bg-pm-dark/50 border border-gray-600 rounded-lg text-white focus:border-pm-gold focus:outline-none"
                    >
                      <option value="name">Nom</option>
                      <option value="status">Statut</option>
                      <option value="lastPayment">Dernier paiement</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 bg-pm-gold/20 border border-pm-gold/30 rounded-lg text-pm-gold hover:bg-pm-gold/30 transition-colors"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Liste des modèles */}
          <div className="space-y-4">
            {filteredAndSortedModels.map((model) => (
              <div
                key={model.id}
                className="bg-pm-dark/50 border border-pm-gold/20 rounded-xl p-4 hover:border-pm-gold/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pm-gold/20 rounded-lg flex items-center justify-center">
                      <span className="text-pm-gold font-bold text-lg">
                        {model.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Matricule: {model.matricule}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          model.type === 'pro' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {model.type === 'pro' ? 'Professionnel' : 'Débutant'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <PaymentStatusIndicator 
                      status={model.statusCategory} 
                      lastPaymentDate={model.paymentStatus?.lastPaymentDate}
                    />
                    
                    <button
                      onClick={() => {
                        setSelectedModel(model);
                        setShowPaymentForm(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-pm-gold/20 border border-pm-gold/30 rounded-lg text-pm-gold hover:bg-pm-gold/30 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Modifier
                    </button>

                    <div className="relative" ref={openMenuId === model.id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === model.id ? null : model.id)}
                        className="p-2 rounded-full hover:bg-pm-gold/20 text-gray-400 hover:text-white"
                      >
                        <EllipsisVerticalIcon className="w-5 h-5" />
                      </button>
                      {openMenuId === model.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-pm-dark-lighter border border-gray-700 rounded-lg shadow-xl z-20">
                          <div className="p-2">
                            <p className="text-xs text-gray-400 px-2 py-1 font-semibold">Mise à jour manuelle</p>
                             <button
                              onClick={() => handleManualUpdate(model.id, 'complete')}
                              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-pm-gold/20 rounded-md"
                            >
                              <CheckCircleIcon className="w-4 h-4 text-teal-400" />
                              Forcer "À jour"
                            </button>
                             <button
                              onClick={() => handleManualUpdate(model.id, 'inscription_only')}
                              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-pm-gold/20 rounded-md"
                            >
                              <CheckCircleIcon className="w-4 h-4 text-blue-400" />
                              Forcer "Inscription OK"
                            </button>
                            <button
                              onClick={() => handleManualUpdate(model.id, 'pending')}
                              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-pm-gold/20 rounded-md"
                            >
                              <ClockIcon className="w-4 h-4 text-yellow-400" />
                              Forcer "En attente"
                            </button>
                            <div className="border-t border-gray-700 my-1"></div>
                            <div className="px-3 py-2 text-xs text-yellow-400/80 flex items-start gap-2">
                              <SolidExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>Attention, cette action ne crée pas de transaction comptable.</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Détails des paiements */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Inscription:</span>
                      <span className={`font-medium ${
                        model.paymentStatus?.inscription === 'paid' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {model.paymentStatus?.inscription === 'paid' ? 'Payée' : 'Non payée'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Cotisation:</span>
                      <span className={`font-medium ${
                        model.paymentStatus?.cotisation === 'paid' 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {model.paymentStatus?.cotisation === 'paid' ? 'Payée' : 'Non payée'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredAndSortedModels.length === 0 && (
              <div className="text-center py-12">
                <CurrencyDollarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Aucun mannequin trouvé
                </h3>
                <p className="text-gray-500">
                  Ajustez vos filtres pour voir plus de résultats
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Formulaire de paiement */}
        {showPaymentForm && selectedModel && (
          <QuickPaymentForm
            model={selectedModel}
            onClose={() => {
              setShowPaymentForm(false);
              setSelectedModel(null);
            }}
            onSuccess={() => {
              // Rafraîchir les données si nécessaire
            }}
          />
        )}
      </div>
    </>
  );
};

export default AdminPaymentsNew;