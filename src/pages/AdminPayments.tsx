import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { CheckIcon, XMarkIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

// PaymentSubmission type removed - using any[]

const AdminPayments: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'En attente' | 'Approuvé' | 'Rejeté'>('all');

  const paymentSubmissions = (data?.paymentSubmissions as any[]) || [];
  
  const filteredPayments = paymentSubmissions.filter(payment => 
    filter === 'all' || payment.status === filter
  );

  const handleStatusChange = (id: string, newStatus: 'En attente' | 'Approuvé' | 'Rejeté') => {
    const updatedPayments = paymentSubmissions.map((payment: any) =>
      payment.id === id ? { ...payment, status: newStatus } : payment
    );
    saveData({ ...data!, paymentSubmissions: updatedPayments });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette soumission de paiement ?')) {
      const updatedPayments = paymentSubmissions.filter((payment: any) => payment.id !== id);
      saveData({ ...data!, paymentSubmissions: updatedPayments });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'Approuvé': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'Rejeté': return 'bg-red-600/20 text-red-400 border-red-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Soumissions de Paiement" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Soumissions de Paiement</h1>
            <p className="admin-page-subtitle">Gérer les soumissions de paiement des mannequins.</p>
          </div>
        </header>

        <div className="admin-section-wrapper">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="admin-section-title">Soumissions</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Toutes ({paymentSubmissions.length})
              </button>
              <button
                onClick={() => setFilter('En attente')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'En attente' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                En attente ({paymentSubmissions.filter((p: any) => p.status === 'En attente').length})
              </button>
              <button
                onClick={() => setFilter('Approuvé')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Approuvé' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Approuvées ({paymentSubmissions.filter((p: any) => p.status === 'Approuvé').length})
              </button>
              <button
                onClick={() => setFilter('Rejeté')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Rejeté' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Rejetées ({paymentSubmissions.filter((p: any) => p.status === 'Rejeté').length})
              </button>
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CurrencyDollarIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">
                {filter === 'all' 
                  ? 'Aucune soumission de paiement' 
                  : `Aucune soumission ${filter.toLowerCase()}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment: any) => (
                <div key={payment.id} className="card-base p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-pm-gold">{payment.modelName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Email:</strong> {payment.modelEmail}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Montant:</strong> {formatAmount(payment.amount, payment.currency)}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Méthode:</strong> {payment.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Date de soumission:</strong> {formatDate(payment.submissionDate)}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Devise:</strong> {payment.currency}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-pm-off-white/70 mb-1"><strong>Description:</strong></p>
                        <p className="text-pm-off-white/80 bg-pm-off-white/5 p-3 rounded-lg">{payment.description}</p>
                      </div>
                      
                      {payment.attachments && payment.attachments.length > 0 && (
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-2"><strong>Pièces jointes:</strong></p>
                          <div className="flex flex-wrap gap-2">
                            {payment.attachments.map((attachment: any, index: any) => (
                              <a
                                key={index}
                                href={attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-pm-gold/20 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/30 transition-colors text-sm"
                              >
                                Pièce {index + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {payment.status === 'En attente' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(payment.id, 'Approuvé')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                          >
                            <CheckIcon className="w-4 h-4" />
                            Approuver
                          </button>
                          <button
                            onClick={() => handleStatusChange(payment.id, 'Rejeté')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                            Rejeter
                          </button>
                        </>
                      )}
                      {payment.status === 'Approuvé' && (
                        <button
                          onClick={() => handleStatusChange(payment.id, 'Rejeté')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Rejeter
                        </button>
                      )}
                      {payment.status === 'Rejeté' && (
                        <button
                          onClick={() => handleStatusChange(payment.id, 'Approuvé')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Approuver
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
