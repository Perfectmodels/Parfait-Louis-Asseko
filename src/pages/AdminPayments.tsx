import React, { useState } from 'react';
import SEO from '../components/SEO';
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
    const updatedPayments = paymentSubmissions.map(payment =>
      payment.id === id ? { ...payment, status: newStatus } : payment
    );
    saveData({ ...data!, paymentSubmissions: updatedPayments });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette soumission de paiement ?')) {
      const updatedPayments = paymentSubmissions.filter(payment => payment.id !== id);
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Soumissions de Paiement" noIndex />
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-playfair text-pm-gold">Soumissions de Paiement</h1>
        <p className="text-pm-off-white/70 mt-2 mb-8">
          Gérez les soumissions de paiement des mannequins.
        </p>

        <div className="flex items-center gap-4 mb-8">
          {(['all', 'En attente', 'Approuvé', 'Rejeté'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                filter === f
                  ? 'bg-pm-gold text-pm-dark border-pm-gold'
                  : 'border-pm-off-white/50 text-pm-off-white hover:bg-pm-gold/20'
              }`}
            >
              {f === 'all' ? 'Toutes' : f}
            </button>
          ))}
        </div>

        {filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <CurrencyDollarIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
            <p className="text-pm-off-white/60 text-lg">Aucune soumission de paiement trouvée</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPayments.map(payment => (
              <div key={payment.id} className="bg-black p-6 border border-pm-gold/20 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-pm-gold">{payment.modelName}</h3>
                    <p className="text-sm text-pm-off-white/70">{payment.modelEmail}</p>
                    <p className="text-xs text-pm-off-white/50 mt-1">
                      Soumis le {formatDate(payment.submissionDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-pm-off-white/70">Montant</p>
                    <p className="text-lg font-bold text-pm-gold">{payment.amount} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm text-pm-off-white/70">Méthode de paiement</p>
                    <p className="text-pm-off-white">{payment.paymentMethod}</p>
                  </div>
                </div>

                {payment.transactionId && (
                  <div className="mb-4">
                    <p className="text-sm text-pm-off-white/70">ID de transaction</p>
                    <p className="text-pm-off-white font-mono text-sm">{payment.transactionId}</p>
                  </div>
                )}

                {payment.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-pm-off-white/70">Notes</p>
                    <p className="text-pm-off-white/80 bg-pm-off-white/5 p-3 rounded-lg">{payment.notes}</p>
                  </div>
                )}

                {payment.status === 'En attente' && (
                  <div className="flex gap-2 pt-4 border-t border-pm-gold/20">
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;