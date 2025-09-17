import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, PencilIcon, CheckCircleIcon, ExclamationTriangleIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { AccountingTransaction } from '../types';

import PaymentStatusIndicator from '../components/PaymentStatusIndicator';

const AdminPayments: React.FC = () => {
  const { data, saveData } = useData();
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<'name' | 'status' | 'lastPayment' | 'nextDue'>('status');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Récupérer tous les mannequins (Pro + Débutants unifiés)
  const allModels = [
    ...(data?.models || []),
    ...(data?.beginnerStudents?.map(student => ({
      id: student.id,
      name: student.name,
      username: student.matricule || student.name.toLowerCase().replace(/\s+/g, ''),
      level: 'Mannequin' as const,
      imageUrl: 'https://i.ibb.co/fVBxPNT/T-shirt.png', // Image par défaut
      paymentStatus: {
        isUpToDate: false,
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 1500,
        currency: 'FCFA',
        paymentType: 'cotisation' as const,
        description: 'Cotisation mensuelle',
        warnings: []
      }
    })) || [])
  ];

  const toggleModelExpansion = (modelId: string) => {
    const newExpanded = new Set(expandedModels);
    if (newExpanded.has(modelId)) {
      newExpanded.delete(modelId);
    } else {
      newExpanded.add(modelId);
    }
    setExpandedModels(newExpanded);
  };

  // Fonction pour déterminer la catégorie de statut
  const getStatusCategory = (model: any) => {
    const paymentStatus = model.paymentStatus;
    
    // Si pas de statut de paiement du tout, c'est "en attente"
    if (!paymentStatus || !paymentStatus.paymentType) {
      return 'pending';
    }
    
    const now = new Date();
    const nextDueDate = paymentStatus.nextDueDate ? new Date(paymentStatus.nextDueDate) : null;
    const isOverdue = nextDueDate && nextDueDate < now;
    const hasWarnings = paymentStatus.warnings && paymentStatus.warnings.length > 0;

    // Vérifier si le mannequin a payé quelque chose
    const hasPaid = paymentStatus.lastPaymentDate && paymentStatus.amount && paymentStatus.amount > 0;

    if (paymentStatus.paymentType === 'cotisation_inscription') {
      if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings && hasPaid) {
        return 'complete';
      } else if (hasPaid) {
        return 'partial';
      } else {
        return 'pending';
      }
    } else if (paymentStatus.paymentType === 'cotisation') {
      if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings && hasPaid) {
        return 'cotisation_only';
      } else if (hasPaid) {
        return 'cotisation_pending';
      } else {
        return 'pending';
      }
    } else if (paymentStatus.paymentType === 'inscription') {
      if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings && hasPaid) {
        return 'inscription_only';
      } else if (hasPaid) {
        return 'inscription_pending';
      } else {
        return 'pending';
      }
    } else if (paymentStatus.paymentType === 'avance') {
      if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings && hasPaid) {
        return 'advance';
      } else if (hasPaid) {
        return 'advance_pending';
      } else {
        return 'pending';
      }
    }

    // Si pas de paiement du tout
    if (!hasPaid) {
      return 'pending';
    }

    if (isOverdue) return 'overdue';
    if (hasWarnings) return 'warning';
    return 'pending';
  };

  // Tri et filtrage des modèles
  const filteredAndSortedModels = allModels
    .map(model => ({ ...model, statusCategory: getStatusCategory(model) }))
    .filter(model => filterStatus === 'all' || model.statusCategory === filterStatus)
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          const statusOrder = {
            'pending': 1,
            'complete': 2,
            'cotisation_only': 3,
            'inscription_only': 4,
            'advance': 5,
            'partial': 6,
            'cotisation_pending': 7,
            'inscription_pending': 8,
            'advance_pending': 9,
            'warning': 10,
            'overdue': 11,
            'unknown': 12
          };
          aValue = statusOrder[a.statusCategory as keyof typeof statusOrder] || 999;
          bValue = statusOrder[b.statusCategory as keyof typeof statusOrder] || 999;
          break;
        case 'lastPayment':
          aValue = (a.paymentStatus as any)?.lastPaymentDate ? new Date((a.paymentStatus as any).lastPaymentDate).getTime() : 0;
          bValue = (b.paymentStatus as any)?.lastPaymentDate ? new Date((b.paymentStatus as any).lastPaymentDate).getTime() : 0;
          break;
        case 'nextDue':
          aValue = a.paymentStatus?.nextDueDate ? new Date(a.paymentStatus.nextDueDate).getTime() : 0;
          bValue = b.paymentStatus?.nextDueDate ? new Date(b.paymentStatus.nextDueDate).getTime() : 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (field: 'name' | 'status' | 'lastPayment' | 'nextDue') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleUpdatePayment = async (modelId: string, paymentData: any) => {
    if (!data) return;

    // Trouver le mannequin pour obtenir son nom
    const model = allModels.find(m => m.id === modelId);
    if (!model) return;

    // Mettre à jour les modèles professionnels
    const updatedProModels = (data?.models || []).map(model => {
      if (model.id === modelId) {
        return {
          ...model,
          paymentStatus: {
            ...model.paymentStatus,
            isUpToDate: true,
            lastPaymentDate: new Date().toISOString(),
            amount: paymentData.amount,
            currency: paymentData.currency || 'FCFA',
            paymentMethod: paymentData.paymentMethod,
            nextDueDate: paymentData.nextDueDate,
            notes: paymentData.notes,
            paymentType: paymentData.paymentType,
            description: paymentData.description
          }
        };
      }
      return model;
    });

    // Mettre à jour les étudiants débutants
    const updatedBeginnerStudents = (data?.beginnerStudents || []).map(student => {
      if (student.id === modelId) {
        return {
          ...student,
          paymentStatus: {
            isUpToDate: true,
            lastPaymentDate: new Date().toISOString(),
            amount: paymentData.amount,
            currency: paymentData.currency || 'FCFA',
            paymentMethod: paymentData.paymentMethod,
            nextDueDate: paymentData.nextDueDate,
            notes: paymentData.notes,
            paymentType: paymentData.paymentType,
            description: paymentData.description,
            warnings: []
          }
        };
      }
      return student;
    });

    // Créer une transaction comptable automatiquement
    const accountingTransaction: AccountingTransaction = {
      id: `payment-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `${paymentData.description || paymentData.paymentType} - ${model.name}`,
      category: 'revenue',
      subcategory: paymentData.paymentType === 'cotisation' ? 'Cotisations mensuelles' : 
                   paymentData.paymentType === 'inscription' ? 'Frais d\'inscription' :
                   paymentData.paymentType === 'cotisation_inscription' ? 'Cotisations + Inscriptions' :
                   'Paiements en avance',
      amount: paymentData.amount,
      currency: paymentData.currency || 'FCFA',
      paymentMethod: paymentData.paymentMethod || 'cash',
      reference: `${paymentData.paymentType?.toUpperCase()}-${model.name}-${new Date().getFullYear()}`,
      notes: paymentData.notes || `Paiement ${paymentData.paymentType} pour ${model.name}`,
      relatedModelId: modelId,
      relatedModelName: model.name,
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    };

    try {
      // Ajouter la transaction comptable
      const updatedTransactions = [...(data.accountingTransactions || []), accountingTransaction];
      
      await saveData({ 
        ...data, 
        models: updatedProModels,
        beginnerStudents: updatedBeginnerStudents,
        accountingTransactions: updatedTransactions
      });
      setShowPaymentForm(false);
      setSelectedModel(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement:', error);
    }
  };


  const getPaymentStats = () => {
    const totalModels = allModels.length;
    const upToDate = allModels.filter(m => m.paymentStatus?.isUpToDate).length;
    const overdue = allModels.filter(m => 
      m.paymentStatus?.nextDueDate && 
      new Date(m.paymentStatus.nextDueDate) < new Date() && 
      !m.paymentStatus.isUpToDate
    ).length;
    const pending = totalModels - upToDate - overdue;

    return { totalModels, upToDate, overdue, pending };
  };

  // Fonction pour migrer les paiements existants vers le livre comptable
  const migrateExistingPayments = async () => {
    if (!data) return;

    const existingTransactions = data.accountingTransactions || [];
    const newTransactions: AccountingTransaction[] = [];

    // Vérifier les modèles professionnels
    (data.models || []).forEach(model => {
      if (model.paymentStatus && model.paymentStatus.isUpToDate && model.paymentStatus.lastPaymentDate) {
        // Vérifier si cette transaction existe déjà
        const existingTransaction = existingTransactions.find(t => 
          t.relatedModelId === model.id && 
          t.relatedModelName === model.name &&
          t.amount === (model.paymentStatus?.amount || 0)
        );

        if (!existingTransaction) {
          const transaction: AccountingTransaction = {
            id: `migration-${model.id}-${Date.now()}`,
            date: model.paymentStatus.lastPaymentDate.split('T')[0],
            description: `${model.paymentStatus.description || model.paymentStatus.paymentType} - ${model.name}`,
            category: 'revenue',
            subcategory: model.paymentStatus.paymentType === 'cotisation' ? 'Cotisations mensuelles' : 
                         model.paymentStatus.paymentType === 'inscription' ? 'Frais d\'inscription' :
                         model.paymentStatus.paymentType === 'cotisation_inscription' ? 'Cotisations + Inscriptions' :
                         'Paiements en avance',
            amount: model.paymentStatus.amount || 0,
            currency: model.paymentStatus.currency || 'FCFA',
            paymentMethod: (model.paymentStatus.paymentMethod as any) || 'cash',
            reference: `${model.paymentStatus.paymentType?.toUpperCase()}-${model.name}-${new Date().getFullYear()}`,
            notes: model.paymentStatus.notes || `Paiement ${model.paymentStatus.paymentType} pour ${model.name} (Migration)`,
            relatedModelId: model.id,
            relatedModelName: model.name,
            createdBy: 'admin',
            createdAt: new Date().toISOString()
          };
          newTransactions.push(transaction);
        }
      }
    });

    // Vérifier les étudiants débutants
    (data.beginnerStudents || []).forEach(student => {
      if (student.paymentStatus && student.paymentStatus.isUpToDate && student.paymentStatus.lastPaymentDate) {
        // Vérifier si cette transaction existe déjà
        const existingTransaction = existingTransactions.find(t => 
          t.relatedModelId === student.id && 
          t.relatedModelName === student.name &&
          t.amount === (student.paymentStatus?.amount || 0)
        );

        if (!existingTransaction) {
          const transaction: AccountingTransaction = {
            id: `migration-${student.id}-${Date.now()}`,
            date: student.paymentStatus.lastPaymentDate.split('T')[0],
            description: `${student.paymentStatus.description || student.paymentStatus.paymentType} - ${student.name}`,
            category: 'revenue',
            subcategory: student.paymentStatus.paymentType === 'cotisation' ? 'Cotisations mensuelles' : 
                         student.paymentStatus.paymentType === 'inscription' ? 'Frais d\'inscription' :
                         student.paymentStatus.paymentType === 'cotisation_inscription' ? 'Cotisations + Inscriptions' :
                         'Paiements en avance',
            amount: student.paymentStatus.amount || 0,
            currency: student.paymentStatus.currency || 'FCFA',
            paymentMethod: (student.paymentStatus.paymentMethod as any) || 'cash',
            reference: `${student.paymentStatus.paymentType?.toUpperCase()}-${student.name}-${new Date().getFullYear()}`,
            notes: student.paymentStatus.notes || `Paiement ${student.paymentStatus.paymentType} pour ${student.name} (Migration)`,
            relatedModelId: student.id,
            relatedModelName: student.name,
            createdBy: 'admin',
            createdAt: new Date().toISOString()
          };
          newTransactions.push(transaction);
        }
      }
    });

    if (newTransactions.length > 0) {
      try {
        const updatedTransactions = [...existingTransactions, ...newTransactions];
        await saveData({ 
          ...data, 
          accountingTransactions: updatedTransactions
        });
        alert(`${newTransactions.length} paiements existants ont été migrés vers le livre comptable !`);
      } catch (error) {
        console.error('Erreur lors de la migration:', error);
        alert('Erreur lors de la migration des paiements.');
      }
    } else {
      alert('Aucun paiement existant à migrer. Tous les paiements sont déjà dans le livre comptable.');
    }
  };

  const stats = getPaymentStats();

  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen">
      <SEO title="Gestion des Paiements" noIndex />
      
      <div className="page-container">
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold hover:text-white transition-colors mb-4">
              <ChevronLeftIcon className="w-5 h-5" />
              Retour au tableau de bord
            </Link>
            <h1 className="admin-page-title">Gestion des Paiements</h1>
            <p className="admin-page-subtitle">Suivi des cotisations et statuts de paiement</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="admin-section-wrapper mb-8">
          <h2 className="admin-section-title">Statistiques des Paiements</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-pm-dark/50 p-6 rounded-lg border border-pm-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-400">{stats.totalModels}</span>
                </div>
                <div>
                  <p className="text-pm-off-white/60 text-sm">Total Mannequins</p>
                  <p className="text-xl font-bold text-pm-off-white">{stats.totalModels}</p>
                </div>
              </div>
            </div>

            <div className="bg-pm-dark/50 p-6 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-pm-off-white/60 text-sm">À jour</p>
                  <p className="text-xl font-bold text-green-400">{stats.upToDate}</p>
                </div>
              </div>
            </div>

            <div className="bg-pm-dark/50 p-6 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-pm-off-white/60 text-sm">En retard</p>
                  <p className="text-xl font-bold text-red-400">{stats.overdue}</p>
                </div>
              </div>
            </div>

            <div className="bg-pm-dark/50 p-6 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-yellow-400">{stats.pending}</span>
                </div>
                <div>
                  <p className="text-pm-off-white/60 text-sm">En attente</p>
                  <p className="text-xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note sur la synchronisation */}
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-green-400 font-semibold mb-1">Synchronisation Automatique</h4>
              <p className="text-green-300/80 text-sm">
                Les nouveaux paiements sont automatiquement ajoutés au livre comptable. 
                Si vous avez des paiements existants qui n'apparaissent pas dans le livre comptable, 
                cliquez sur "Migrer Paiements Existants" ci-dessous.
              </p>
            </div>
          </div>
        </div>

        {/* Filtres et tri */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-pm-gold" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-pm-dark border border-pm-gold/20 rounded-lg px-3 py-2 text-pm-off-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente (Aucun paiement)</option>
              <option value="complete">Complets (Cotisation + Inscription)</option>
              <option value="cotisation_only">Cotisation seule</option>
              <option value="inscription_only">Inscription seule</option>
              <option value="partial">Partiels</option>
              <option value="cotisation_pending">Cotisation en attente</option>
              <option value="inscription_pending">Inscription en attente</option>
              <option value="advance_pending">Avance en attente</option>
              <option value="overdue">En retard</option>
              <option value="warning">Avertissements</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-pm-off-white/60">
            <span>Tri par:</span>
            <button
              onClick={() => handleSort('status')}
              className={`px-3 py-1 rounded ${sortField === 'status' ? 'bg-pm-gold/20 text-pm-gold' : 'hover:bg-pm-gold/10'}`}
            >
              Statut {sortField === 'status' && (sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4 inline ml-1" /> : <ArrowDownIcon className="w-4 h-4 inline ml-1" />)}
            </button>
            <button
              onClick={() => handleSort('name')}
              className={`px-3 py-1 rounded ${sortField === 'name' ? 'bg-pm-gold/20 text-pm-gold' : 'hover:bg-pm-gold/10'}`}
            >
              Nom {sortField === 'name' && (sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4 inline ml-1" /> : <ArrowDownIcon className="w-4 h-4 inline ml-1" />)}
            </button>
            <button
              onClick={() => handleSort('lastPayment')}
              className={`px-3 py-1 rounded ${sortField === 'lastPayment' ? 'bg-pm-gold/20 text-pm-gold' : 'hover:bg-pm-gold/10'}`}
            >
              Dernier Paiement {sortField === 'lastPayment' && (sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4 inline ml-1" /> : <ArrowDownIcon className="w-4 h-4 inline ml-1" />)}
            </button>
          </div>
          <div className="ml-auto flex gap-3">
            <button
              onClick={migrateExistingPayments}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <ArrowUpIcon className="w-4 h-4" />
              Migrer Paiements Existants
            </button>
            <Link 
              to="/admin/payment-status"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FunnelIcon className="w-4 h-4" />
              Vue Statuts Détaillée
            </Link>
          </div>
        </div>

        {/* Liste des mannequins */}
        <div className="admin-section-wrapper">
          <div className="flex justify-between items-center mb-6">
            <h2 className="admin-section-title">Statuts de Paiement</h2>
            <button
              onClick={() => {
                setSelectedModel(null);
                setShowPaymentForm(true);
              }}
              className="action-btn bg-pm-gold text-pm-dark hover:bg-white"
            >
              <PlusIcon className="w-5 h-5" />
              Nouveau Paiement
            </button>
          </div>

          <div className="space-y-4">
            {filteredAndSortedModels.map((model) => {
              const isExpanded = expandedModels.has(model.id);
              return (
                <div key={model.id} className="bg-black/50 border border-pm-gold/20 rounded-lg overflow-hidden hover:border-pm-gold transition-colors">
                  {/* Header de la carte */}
                  <div className="w-full flex justify-between items-center p-6">
                    <div 
                      className="flex-1 flex items-center gap-4 cursor-pointer hover:bg-pm-gold/5 p-2 rounded transition-colors"
                      onClick={() => {
                        setSelectedModel(model);
                        setShowPaymentForm(true);
                      }}
                    >
                      <img
                        src={model.imageUrl}
                        alt={model.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-pm-gold">{model.name}</h3>
                        <p className="text-sm text-pm-off-white/60">{model.level}</p>
                        <p className="text-xs text-pm-gold/60">Cliquez pour modifier le paiement</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <PaymentStatusIndicator paymentStatus={model.paymentStatus} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModelExpansion(model.id);
                        }}
                        className="p-2 hover:bg-pm-gold/10 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUpIcon className="w-6 h-6 text-pm-gold" />
                        ) : (
                          <ChevronDownIcon className="w-6 h-6 text-pm-gold" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Contenu dépliable */}
                  {isExpanded && (
                    <div className="p-6 border-t border-pm-gold/20 bg-pm-dark/30 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Dernier Paiement */}
                        <div className="bg-black/50 p-4 rounded-lg border border-pm-gold/10">
                          <h4 className="text-sm font-medium text-pm-gold mb-2">Dernier Paiement</h4>
                          <p className="text-pm-off-white/80">
                            {(model.paymentStatus as any)?.lastPaymentDate 
                              ? new Date((model.paymentStatus as any).lastPaymentDate).toLocaleDateString('fr-FR')
                              : 'Aucun'
                            }
                          </p>
                        </div>

                        {/* Prochaine Échéance */}
                        <div className="bg-black/50 p-4 rounded-lg border border-pm-gold/10">
                          <h4 className="text-sm font-medium text-pm-gold mb-2">Prochaine Échéance</h4>
                          <p className="text-pm-off-white/80">
                            {model.paymentStatus?.nextDueDate 
                              ? new Date(model.paymentStatus.nextDueDate).toLocaleDateString('fr-FR')
                              : 'Non défini'
                            }
                          </p>
                        </div>

                        {/* Montant */}
                        <div className="bg-black/50 p-4 rounded-lg border border-pm-gold/10">
                          <h4 className="text-sm font-medium text-pm-gold mb-2">Montant</h4>
                          <p className="text-pm-off-white/80">
                            {model.paymentStatus?.amount 
                              ? `${model.paymentStatus.amount} ${model.paymentStatus.currency || 'FCFA'}`
                              : 'Non défini'
                            }
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="bg-black/50 p-4 rounded-lg border border-pm-gold/10">
                          <h4 className="text-sm font-medium text-pm-gold mb-2">Actions</h4>
                          <button
                            onClick={() => {
                              setSelectedModel(model);
                              setShowPaymentForm(true);
                            }}
                            className="action-btn bg-blue-500/10 text-blue-300 border-blue-500/50 hover:bg-blue-500/20 w-full"
                            title="Modifier le paiement"
                          >
                            <PencilIcon className="w-4 h-4" />
                            Modifier
                          </button>
                        </div>
                      </div>

                      {/* Avertissements */}
                      {model.paymentStatus?.warnings && model.paymentStatus.warnings.length > 0 && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <h4 className="text-sm font-medium text-red-400 mb-3">Avertissements</h4>
                          <div className="space-y-2">
                            {model.paymentStatus.warnings.map((warning) => (
                              <div key={warning.id} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg">
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-red-300 font-medium">{warning.title}</p>
                                  <p className="text-xs text-red-400/80">{warning.message}</p>
                                  <p className="text-xs text-red-400/60 mt-1">
                                    {new Date(warning.date).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Formulaire de paiement */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-pm-gold/20 bg-pm-gold/5">
                <h3 className="text-xl font-bold text-pm-gold">
                  {selectedModel ? `Paiement - ${selectedModel.name}` : 'Nouveau Paiement'}
                </h3>
                <button
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedModel(null);
                  }}
                  className="p-1 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const modelId = formData.get('modelId') as string || selectedModel?.id;
                const paymentType = formData.get('paymentType') as string || 'cotisation';
                const amount = parseFloat(formData.get('amount') as string) || 0;
                
                // Confirmation avant enregistrement
                let confirmMessage = '';
                if (paymentType === 'cotisation') {
                  confirmMessage = `Confirmer le paiement de la cotisation mensuelle de ${amount.toLocaleString()} FCFA ?`;
                } else if (paymentType === 'inscription') {
                  confirmMessage = `Confirmer le paiement des frais d'inscription de ${amount.toLocaleString()} FCFA ?`;
                } else if (paymentType === 'cotisation_inscription') {
                  confirmMessage = `Confirmer le paiement cotisation + inscription de ${amount.toLocaleString()} FCFA ?`;
                } else if (paymentType === 'avance') {
                  const cotisationStandard = 1500;
                  const moisAvance = Math.floor(amount / cotisationStandard);
                  confirmMessage = `Confirmer le paiement en avance de ${amount.toLocaleString()} FCFA (${moisAvance} mois d'avance) ?`;
                }
                
                if (!window.confirm(confirmMessage)) {
                  return;
                }
                
                if (modelId) {
                  // Calculer la prochaine échéance selon le type de paiement
                  let nextDueDate = new Date();
                  let description = '';
                  
                  if (paymentType === 'cotisation') {
                    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                    description = 'Cotisation mensuelle';
                  } else if (paymentType === 'inscription') {
                    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                    description = 'Frais d\'inscription';
                  } else if (paymentType === 'cotisation_inscription') {
                    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                    description = 'Cotisation mensuelle + Frais d\'inscription';
                  } else if (paymentType === 'avance') {
                    const cotisationStandard = 1500;
                    const moisAvance = Math.floor(amount / cotisationStandard);
                    nextDueDate.setMonth(nextDueDate.getMonth() + moisAvance);
                    description = `Paiement en avance (${moisAvance} mois)`;
                  }

                  const paymentData = {
                    amount: amount,
                    currency: 'FCFA',
                    paymentMethod: formData.get('paymentMethod') as string || 'cash',
                    notes: formData.get('notes') as string || '',
                    nextDueDate: nextDueDate.toISOString(),
                    paymentType: paymentType,
                    description: description
                  };
                  handleUpdatePayment(modelId, paymentData);
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Colonne gauche - Sélection mannequin et type de paiement */}
                  <div className="space-y-4">
                    {selectedModel ? (
                      <div className="p-3 bg-pm-gold/10 border border-pm-gold/20 rounded-lg">
                        <h4 className="font-semibold text-pm-gold mb-1 text-sm">Mannequin sélectionné</h4>
                        <p className="text-pm-off-white text-sm">{selectedModel.name}</p>
                        <p className="text-xs text-pm-off-white/60">{selectedModel.level}</p>
                        <input type="hidden" name="modelId" value={selectedModel.id} />
                      </div>
                    ) : (
                      <div>
                        <label className="admin-label">Sélectionner un mannequin</label>
                        <select name="modelId" className="admin-input" required>
                          <option value="">Choisir un mannequin</option>
                          {allModels.map(model => (
                            <option key={model.id} value={model.id}>
                              {model.name} ({model.level})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="admin-label">Type de paiement</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg cursor-pointer hover:bg-green-500/20 transition-colors">
                      <input
                        type="radio"
                        name="paymentType"
                        value="cotisation"
                        defaultChecked
                        className="w-4 h-4 text-green-500 bg-pm-dark border-green-500/30 focus:ring-green-500 focus:ring-2"
                        onChange={(e) => {
                          if (e.target.checked) {
                            const amountInput = document.querySelector('input[name="amount"]') as HTMLInputElement;
                            if (amountInput) amountInput.value = '1500';
                          }
                        }}
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
                        className="w-4 h-4 text-blue-500 bg-pm-dark border-blue-500/30 focus:ring-blue-500 focus:ring-2"
                        onChange={(e) => {
                          if (e.target.checked) {
                            const amountInput = document.querySelector('input[name="amount"]') as HTMLInputElement;
                            if (amountInput) amountInput.value = '15000';
                          }
                        }}
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
                        className="w-4 h-4 text-purple-500 bg-pm-dark border-purple-500/30 focus:ring-purple-500 focus:ring-2"
                        onChange={(e) => {
                          if (e.target.checked) {
                            const amountInput = document.querySelector('input[name="amount"]') as HTMLInputElement;
                            if (amountInput) amountInput.value = '16500';
                          }
                        }}
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
                        className="w-4 h-4 text-orange-500 bg-pm-dark border-orange-500/30 focus:ring-orange-500 focus:ring-2"
                        onChange={(e) => {
                          if (e.target.checked) {
                            const amountInput = document.querySelector('input[name="amount"]') as HTMLInputElement;
                            if (amountInput) amountInput.value = '';
                            amountInput.placeholder = 'Montant personnalisé';
                          }
                        }}
                      />
                          <div>
                            <p className="font-medium text-orange-300 text-sm">Paiement en avance</p>
                            <p className="text-xs text-orange-400/80">Montant personnalisé - Calcul automatique des mois</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite - Détails du paiement */}
                  <div className="space-y-4">

                    <div>
                      <label className="admin-label">Montant (FCFA)</label>
                      <input
                        type="number"
                        name="amount"
                        defaultValue="1500"
                        className="admin-input"
                        placeholder="1500"
                        required
                        onChange={(e) => {
                          const amount = parseFloat(e.target.value);
                          const cotisationStandard = 1500;
                          if (amount > cotisationStandard) {
                            const moisAvance = Math.floor(amount / cotisationStandard);
                            const montantRestant = amount % cotisationStandard;
                            const infoDiv = document.getElementById('avance-info');
                            if (infoDiv) {
                              infoDiv.innerHTML = `
                                <div class="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                  <p class="text-xs text-orange-300">
                                    <strong>${moisAvance} mois</strong> d'avance 
                                    ${montantRestant > 0 ? `+ ${montantRestant} FCFA de surplus` : ''}
                                  </p>
                                  <p class="text-xs text-orange-400/80 mt-1">
                                    Prochaine échéance dans ${moisAvance} mois
                                  </p>
                                </div>
                              `;
                            }
                          } else {
                            const infoDiv = document.getElementById('avance-info');
                            if (infoDiv) {
                              infoDiv.innerHTML = '';
                            }
                          }
                        }}
                      />
                      <div id="avance-info"></div>
                    </div>

                    <div>
                      <label className="admin-label">Méthode de paiement</label>
                      <select name="paymentMethod" className="admin-input" defaultValue="cash">
                        <option value="cash">Espèces</option>
                        <option value="bank_transfer">Virement bancaire</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="check">Chèque</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Notes (optionnel)</label>
                      <textarea
                        name="notes"
                        className="admin-textarea"
                        rows={3}
                        placeholder="Notes sur le paiement..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedModel(null);
                    }}
                    className="px-6 py-2 border border-pm-gold/50 text-pm-gold rounded-lg hover:bg-pm-gold/10 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-white transition-colors"
                  >
                    Enregistrer le Paiement
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;