import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

// RecoveryRequest type removed - using any[]

const AdminRecovery: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'Nouveau' | 'Traité'>('all');

  const recoveryRequests = data?.recoveryRequests || [];
  
  const filteredRequests = recoveryRequests.filter(request => 
    filter === 'all' || request.status === filter
  );

  const handleStatusChange = (id: string, newStatus: 'Nouveau' | 'Traité') => {
    const updatedRequests = recoveryRequests.map(request =>
      request.id === id ? { ...request, status: newStatus } : request
    );
    saveData({ ...data!, recoveryRequests: updatedRequests });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      const updatedRequests = recoveryRequests.filter(request => request.id !== id);
      saveData({ ...data!, recoveryRequests: updatedRequests });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau': return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'Traité': return 'bg-green-600/20 text-green-400 border-green-600/30';
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
      <SEO title="Demandes de Récupération" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Demandes de Récupération</h1>
            <p className="admin-page-subtitle">Gérer les demandes de récupération de coordonnées oubliées.</p>
          </div>
        </header>

        <div className="admin-section-wrapper">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="admin-section-title">Demandes</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Toutes ({recoveryRequests.length})
              </button>
              <button
                onClick={() => setFilter('Nouveau')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Nouveau' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Nouvelles ({recoveryRequests.filter(r => r.status === 'Nouveau').length})
              </button>
              <button
                onClick={() => setFilter('Traité')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Traité' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Traitées ({recoveryRequests.filter(r => r.status === 'Traité').length})
              </button>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">
                {filter === 'all' 
                  ? 'Aucune demande de récupération' 
                  : `Aucune demande ${filter.toLowerCase()}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="card-base p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-pm-gold">{request.modelName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-pm-off-white/70">
                        <p><strong>Téléphone:</strong> {request.phone}</p>
                        <p><strong>Date:</strong> {formatDate(request.timestamp)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {request.status === 'Nouveau' && (
                        <button
                          onClick={() => handleStatusChange(request.id, 'Traité')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Marquer comme traité
                        </button>
                      )}
                      {request.status === 'Traité' && (
                        <button
                          onClick={() => handleStatusChange(request.id, 'Nouveau')}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-lg hover:bg-yellow-600/30 transition-colors"
                        >
                          <ClockIcon className="w-4 h-4" />
                          Marquer comme nouveau
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(request.id)}
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

export default AdminRecovery;
