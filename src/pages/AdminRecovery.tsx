import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

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
      <SEO title="Admin - Demandes de Récupération" noIndex />
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-playfair text-pm-gold">Demandes de Récupération</h1>
        <p className="text-pm-off-white/70 mt-2 mb-8">
          Gérez les demandes de coordonnées oubliées soumises par les mannequins.
        </p>

        <div className="flex items-center gap-4 mb-6">
          {(['all', 'Nouveau', 'Traité'] as const).map(f => (
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

        {filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <ClockIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
            <p className="text-pm-off-white/60 text-lg">Aucune demande de récupération trouvée</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map(request => (
              <div key={request.id} className="bg-black p-6 border border-pm-gold/20 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-pm-gold">{request.modelName}</h3>
                    <p className="text-sm text-pm-off-white/70">{request.phone}</p>
                    <p className="text-xs text-pm-off-white/50 mt-1">
                      Demandé le {formatDate(request.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {request.status === 'Nouveau' && (
                  <div className="flex gap-2 pt-4 border-t border-pm-gold/20">
                    <button
                      onClick={() => handleStatusChange(request.id, 'Traité')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                    >
                      <CheckIcon className="w-4 h-4" />
                      Marquer comme traité
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

export default AdminRecovery;