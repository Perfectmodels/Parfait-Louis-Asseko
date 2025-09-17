import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, PencilIcon, CheckCircleIcon, ExclamationTriangleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Model, PaymentStatus, PaymentWarning } from '../types';
import PaymentStatusBadge from '../components/PaymentStatusBadge';

const AdminPayments: React.FC = () => {
  const { data, saveData } = useData();
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  // Récupérer tous les mannequins (Pro + Débutants unifiés)
  const allModels = [
    ...(data?.models || []),
    ...(data?.beginnerStudents?.map(student => ({
      id: student.id,
      name: student.name,
      username: student.matricule || student.name.toLowerCase().replace(/\s+/g, ''),
      level: 'Mannequin' as const,
      paymentStatus: {
        isUpToDate: false,
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 50000,
        currency: 'FCFA',
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

  const handleUpdatePayment = async (modelId: string, paymentData: Partial<PaymentStatus>) => {
    if (!data) return;

    // Mettre à jour les modèles professionnels
    const updatedProModels = (data?.models || []).map(model => {
      if (model.id === modelId) {
        return {
          ...model,
          paymentStatus: {
            ...model.paymentStatus,
            ...paymentData,
            isUpToDate: true,
            lastPaymentDate: new Date().toISOString()
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
            amount: paymentData.amount || 50000,
            currency: paymentData.currency || 'FCFA',
            warnings: []
          }
        };
      }
      return student;
    });

    try {
      await saveData({ 
        ...data, 
        models: updatedProModels,
        beginnerStudents: updatedBeginnerStudents
      });
      setShowPaymentForm(false);
      setSelectedModel(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement:', error);
    }
  };

  const handleAddWarning = async (modelId: string, warning: Omit<PaymentWarning, 'id'>) => {
    if (!data) return;

    const newWarning: PaymentWarning = {
      ...warning,
      id: `warning-${Date.now()}`
    };

    // Mettre à jour les modèles professionnels
    const updatedProModels = (data?.models || []).map(model => {
      if (model.id === modelId) {
        return {
          ...model,
          paymentStatus: {
            ...model.paymentStatus,
            warnings: [...(model.paymentStatus?.warnings || []), newWarning],
            isUpToDate: false
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
            ...student.paymentStatus,
            warnings: [...(student.paymentStatus?.warnings || []), newWarning],
            isUpToDate: false
          }
        };
      }
      return student;
    });

    try {
      await saveData({ 
        ...data, 
        models: updatedProModels,
        beginnerStudents: updatedBeginnerStudents
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avertissement:', error);
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
            {allModels.map((model) => {
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
                      <PaymentStatusBadge paymentStatus={model.paymentStatus} />
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
                            {model.paymentStatus?.lastPaymentDate 
                              ? new Date(model.paymentStatus.lastPaymentDate).toLocaleDateString('fr-FR')
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
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-pm-gold mb-6">
                {selectedModel ? `Paiement - ${selectedModel.name}` : 'Nouveau Paiement'}
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const modelId = formData.get('modelId') as string || selectedModel?.id;
                
                if (modelId) {
                  const paymentData = {
                    amount: parseFloat(formData.get('amount') as string) || 0,
                    currency: formData.get('currency') as string || 'FCFA',
                    paymentMethod: formData.get('paymentMethod') as string || 'cash',
                    notes: formData.get('notes') as string || ''
                  };
                  handleUpdatePayment(modelId, paymentData);
                }
              }} className="space-y-4">
                
                {selectedModel ? (
                  <div className="p-4 bg-pm-gold/10 border border-pm-gold/20 rounded-lg">
                    <h4 className="font-semibold text-pm-gold mb-2">Mannequin sélectionné</h4>
                    <p className="text-pm-off-white">{selectedModel.name}</p>
                    <p className="text-sm text-pm-off-white/60">{selectedModel.level}</p>
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
                  <label className="admin-label">Montant (FCFA)</label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={selectedModel?.paymentStatus?.amount || 50000}
                    className="admin-input"
                    placeholder="50000"
                    required
                  />
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
        )}
      </div>
    </div>
  );
};

export default AdminPayments;