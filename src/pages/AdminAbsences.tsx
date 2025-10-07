import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// AbsenceRequest type removed - using any[]

const AdminAbsences: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'En attente' | 'Approuvé' | 'Rejeté'>('all');

  const absenceRequests = (data?.absenceRequests as any[]) || [];
  
  const filteredAbsences = absenceRequests.filter(absence => 
    filter === 'all' || absence.status === filter
  );

  const handleStatusChange = (id: string, newStatus: 'En attente' | 'Approuvé' | 'Rejeté') => {
    const updatedAbsences = absenceRequests.map((absence: any) =>
      absence.id === id ? { ...absence, status: newStatus } : absence
    );
    saveData({ ...data!, absenceRequests: updatedAbsences });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande d\'absence ?')) {
      const updatedAbsences = absenceRequests.filter((absence: any) => absence.id !== id);
      saveData({ ...data!, absenceRequests: updatedAbsences });
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

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Demandes d'Absence" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Demandes d'Absence</h1>
            <p className="admin-page-subtitle">Gérer les demandes d'absence des mannequins.</p>
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
                Toutes ({absenceRequests.length})
              </button>
              <button
                onClick={() => setFilter('En attente')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'En attente' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                En attente ({absenceRequests.filter((a: any) => a.status === 'En attente').length})
              </button>
              <button
                onClick={() => setFilter('Approuvé')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Approuvé' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Approuvées ({absenceRequests.filter((a: any) => a.status === 'Approuvé').length})
              </button>
              <button
                onClick={() => setFilter('Rejeté')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Rejeté' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Rejetées ({absenceRequests.filter((a: any) => a.status === 'Rejeté').length})
              </button>
            </div>
          </div>

          {filteredAbsences.length === 0 ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">
                {filter === 'all' 
                  ? 'Aucune demande d\'absence' 
                  : `Aucune demande ${filter.toLowerCase()}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAbsences.map((absence: any) => (
                <div key={absence.id} className="card-base p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-pm-gold">{absence.modelName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(absence.status)}`}>
                          {absence.status}
                        </span>
                        {absence.isJustified && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
                            Justifiée
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Email:</strong> {absence.modelEmail}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Date d'absence:</strong> {formatDate(absence.absenceDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Date de soumission:</strong> {formatDate(absence.submissionDate)}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Raison:</strong> {absence.reason}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-pm-off-white/70 mb-1"><strong>Description:</strong></p>
                        <p className="text-pm-off-white/80 bg-pm-off-white/5 p-3 rounded-lg whitespace-pre-wrap">{absence.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {absence.status === 'En attente' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(absence.id, 'Approuvé')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                          >
                            <CheckIcon className="w-4 h-4" />
                            Approuver
                          </button>
                          <button
                            onClick={() => handleStatusChange(absence.id, 'Rejeté')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                            Rejeter
                          </button>
                        </>
                      )}
                      {absence.status === 'Approuvé' && (
                        <button
                          onClick={() => handleStatusChange(absence.id, 'Rejeté')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Rejeter
                        </button>
                      )}
                      {absence.status === 'Rejeté' && (
                        <button
                          onClick={() => handleStatusChange(absence.id, 'Approuvé')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Approuver
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(absence.id)}
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

export default AdminAbsences;
