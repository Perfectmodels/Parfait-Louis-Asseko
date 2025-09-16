import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, PencilIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Model, PaymentStatus, PaymentWarning } from '../types';
import PaymentStatusBadge from '../components/PaymentStatusBadge';

const AdminPayments: React.FC = () => {
  const { data, saveData } = useData();
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const models = data?.models || [];

  const handleUpdatePayment = async (modelId: string, paymentData: Partial<PaymentStatus>) => {
    if (!data) return;

    const updatedModels = models.map(model => {
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

    try {
      await saveData({ ...data, models: updatedModels });
      setShowPaymentForm(false);
      setSelectedModel(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement:', error);
    }
  };

  const handleAddWarning = async (modelId: string, warning: Omit<PaymentWarning, 'id'>) => {
    if (!data) return;

    const updatedModels = models.map(model => {
      if (model.id === modelId) {
        const newWarning: PaymentWarning = {
          ...warning,
          id: `warning-${Date.now()}`
        };
        
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

    try {
      await saveData({ ...data, models: updatedModels });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avertissement:', error);
    }
  };

  const getPaymentStats = () => {
    const totalModels = models.length;
    const upToDate = models.filter(m => m.paymentStatus?.isUpToDate).length;
    const overdue = models.filter(m => 
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
              onClick={() => setShowPaymentForm(true)}
              className="action-btn bg-pm-gold text-pm-dark hover:bg-white"
            >
              <PlusIcon className="w-5 h-5" />
              Nouveau Paiement
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pm-gold/20">
                  <th className="text-left py-3 px-4 text-pm-gold font-medium">Mannequin</th>
                  <th className="text-left py-3 px-4 text-pm-gold font-medium">Statut</th>
                  <th className="text-left py-3 px-4 text-pm-gold font-medium">Dernier Paiement</th>
                  <th className="text-left py-3 px-4 text-pm-gold font-medium">Prochaine Échéance</th>
                  <th className="text-left py-3 px-4 text-pm-gold font-medium">Montant</th>
                  <th className="text-left py-3 px-4 text-pm-gold font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} className="border-b border-pm-gold/10 hover:bg-pm-gold/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={model.imageUrl}
                          alt={model.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-pm-off-white">{model.name}</p>
                          <p className="text-sm text-pm-off-white/60">{model.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <PaymentStatusBadge paymentStatus={model.paymentStatus} />
                    </td>
                    <td className="py-4 px-4 text-pm-off-white/80">
                      {model.paymentStatus?.lastPaymentDate 
                        ? new Date(model.paymentStatus.lastPaymentDate).toLocaleDateString('fr-FR')
                        : 'Aucun'
                      }
                    </td>
                    <td className="py-4 px-4 text-pm-off-white/80">
                      {model.paymentStatus?.nextDueDate 
                        ? new Date(model.paymentStatus.nextDueDate).toLocaleDateString('fr-FR')
                        : 'Non défini'
                      }
                    </td>
                    <td className="py-4 px-4 text-pm-off-white/80">
                      {model.paymentStatus?.amount 
                        ? `${model.paymentStatus.amount} ${model.paymentStatus.currency || 'FCFA'}`
                        : 'Non défini'
                      }
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedModel(model);
                            setShowPaymentForm(true);
                          }}
                          className="action-btn bg-blue-500/10 text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
                          title="Modifier le paiement"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;