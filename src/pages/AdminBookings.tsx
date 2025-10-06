import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

// BookingRequest type removed - using any[]

const AdminBookings: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'Nouveau' | 'Confirmé' | 'Annulé'>('all');

  const bookingRequests = data?.bookingRequests || [];
  
  const filteredBookings = bookingRequests.filter(booking => 
    filter === 'all' || booking.status === filter
  );

  const handleStatusChange = (id: string, newStatus: 'Nouveau' | 'Confirmé' | 'Annulé') => {
    const updatedBookings = bookingRequests.map((booking: any) =>
      booking.id === id ? { ...booking, status: newStatus } : booking
    );
    saveData({ ...data!, bookingRequests: updatedBookings });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande de booking ?')) {
      const updatedBookings = bookingRequests.filter((booking: any) => booking.id !== id);
      saveData({ ...data!, bookingRequests: updatedBookings });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'Confirmé': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'Annulé': return 'bg-red-600/20 text-red-400 border-red-600/30';
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
      <SEO title="Demandes de Booking" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Demandes de Booking</h1>
            <p className="admin-page-subtitle">Gérer les demandes de booking des clients.</p>
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
                Toutes ({bookingRequests.length})
              </button>
              <button
                onClick={() => setFilter('Nouveau')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Nouveau' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Nouvelles ({bookingRequests.filter(b => b.status === 'Nouveau').length})
              </button>
              <button
                onClick={() => setFilter('Confirmé')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Confirmé' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Confirmées ({bookingRequests.filter(b => b.status === 'Confirmé').length})
              </button>
              <button
                onClick={() => setFilter('Annulé')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Annulé' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Annulées ({bookingRequests.filter(b => b.status === 'Annulé').length})
              </button>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">
                {filter === 'all' 
                  ? 'Aucune demande de booking' 
                  : `Aucune demande ${filter.toLowerCase()}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking: any) => (
                <div key={booking.id} className="card-base p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-pm-gold">{booking.clientName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Email:</strong> {booking.clientEmail}</p>
                          {booking.clientCompany && (
                            <p className="text-sm text-pm-off-white/70 mb-1"><strong>Entreprise:</strong> {booking.clientCompany}</p>
                          )}
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Date de soumission:</strong> {formatDate(booking.submissionDate)}</p>
                        </div>
                        <div>
                          {booking.startDate && (
                            <p className="text-sm text-pm-off-white/70 mb-1"><strong>Date de début:</strong> {formatDate(booking.startDate)}</p>
                          )}
                          {booking.endDate && (
                            <p className="text-sm text-pm-off-white/70 mb-1"><strong>Date de fin:</strong> {formatDate(booking.endDate)}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-pm-off-white/70 mb-1"><strong>Mannequins demandés:</strong></p>
                        <p className="text-pm-off-white/80">{booking.requestedModels}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-pm-off-white/70 mb-1"><strong>Message:</strong></p>
                        <p className="text-pm-off-white/80 bg-pm-off-white/5 p-3 rounded-lg">{booking.message}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {booking.status === 'Nouveau' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'Confirmé')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                          >
                            <CheckIcon className="w-4 h-4" />
                            Confirmer
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'Annulé')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                            Annuler
                          </button>
                        </>
                      )}
                      {booking.status === 'Confirmé' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'Annulé')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Annuler
                        </button>
                      )}
                      {booking.status === 'Annulé' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'Confirmé')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Confirmer
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(booking.id)}
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

export default AdminBookings;
