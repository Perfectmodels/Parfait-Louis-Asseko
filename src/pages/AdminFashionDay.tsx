import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { TrashIcon, EyeIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const AdminFashionDay: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fashionDayApplications = data?.fashionDayApplications || [];
  const fashionDayEvents = data?.fashionDayEvents || [];

  const filteredApplications = fashionDayApplications.filter((application: any) => 
    filter === 'all' || application.status === filter
  );

  const handleStatusChange = (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    const updatedApplications = fashionDayApplications.map((application: any) =>
      application.id === id ? { ...application, status: newStatus } : application
    );
    saveData({ ...data!, fashionDayApplications: updatedApplications });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      const updatedApplications = fashionDayApplications.filter((application: any) => application.id !== id);
      saveData({ ...data!, fashionDayApplications: updatedApplications });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'approved': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'rejected': return 'bg-red-600/20 text-red-400 border-red-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      default: return 'Non définie';
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

  const getEventName = (eventId: string) => {
    const event = fashionDayEvents.find((e: any) => e.id === eventId);
    if (!event) return 'Événement inconnu';
    return (event as any).name || (event as any).title || (event as any).eventName || 'Événement inconnu';
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Gestion Fashion Day" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Gestion Fashion Day</h1>
            <p className="admin-page-subtitle">Gérer les candidatures et événements Fashion Day.</p>
          </div>
        </header>

        {/* Statistiques */}
        <div className="admin-section-wrapper mb-8">
          <h2 className="admin-section-title">Statistiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-base p-6 text-center">
              <UserGroupIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">{fashionDayApplications.length}</h3>
              <p className="text-pm-off-white/70">Total Candidatures</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <CalendarIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">
                {fashionDayApplications.filter((app: any) => app.status === 'pending').length}
              </h3>
              <p className="text-pm-off-white/70">En Attente</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <EyeIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">
                {fashionDayApplications.filter((app: any) => app.status === 'approved').length}
              </h3>
              <p className="text-pm-off-white/70">Approuvées</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <TrashIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">
                {fashionDayApplications.filter((app: any) => app.status === 'rejected').length}
              </h3>
              <p className="text-pm-off-white/70">Rejetées</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="admin-section-wrapper mb-8">
          <h2 className="admin-section-title">Filtres</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-pm-gold text-pm-dark' 
                  : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
              }`}
            >
              Toutes ({fashionDayApplications.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-pm-gold text-pm-dark' 
                  : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
              }`}
            >
              En attente ({fashionDayApplications.filter((app: any) => app.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'approved' 
                  ? 'bg-pm-gold text-pm-dark' 
                  : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
              }`}
            >
              Approuvées ({fashionDayApplications.filter((app: any) => app.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'rejected' 
                  ? 'bg-pm-gold text-pm-dark' 
                  : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
              }`}
            >
              Rejetées ({fashionDayApplications.filter((app: any) => app.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Liste des candidatures */}
        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Candidatures</h2>
          
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">
                {filter === 'all' 
                  ? 'Aucune candidature Fashion Day' 
                  : `Aucune candidature ${filter === 'pending' ? 'en attente' : filter === 'approved' ? 'approuvée' : 'rejetée'}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application: any) => (
                <div key={application.id} className="card-base p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-pm-gold">{application.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          {getStatusLabel(application.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Email:</strong> {application.email}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Téléphone:</strong> {application.phone}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Âge:</strong> {application.age} ans</p>
                        </div>
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Événement:</strong> {getEventName(application.eventId)}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Date de candidature:</strong> {formatDate(application.submissionDate)}</p>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Expérience:</strong> {application.experience || 'Non spécifiée'}</p>
                        </div>
                      </div>
                      
                      {application.measurements && (
                        <div className="mb-4">
                          <p className="text-sm text-pm-off-white/70 mb-2"><strong>Mensurations:</strong></p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-pm-off-white/70">Taille:</span>
                              <span className="text-pm-off-white ml-2">{application.measurements.height}</span>
                            </div>
                            <div>
                              <span className="text-pm-off-white/70">Tour de poitrine:</span>
                              <span className="text-pm-off-white ml-2">{application.measurements.chest}</span>
                            </div>
                            <div>
                              <span className="text-pm-off-white/70">Tour de taille:</span>
                              <span className="text-pm-off-white ml-2">{application.measurements.waist}</span>
                            </div>
                            <div>
                              <span className="text-pm-off-white/70">Tour de hanches:</span>
                              <span className="text-pm-off-white ml-2">{application.measurements.hips}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {application.message && (
                        <div>
                          <p className="text-sm text-pm-off-white/70 mb-1"><strong>Message:</strong></p>
                          <p className="text-pm-off-white/80 bg-pm-off-white/5 p-3 rounded-lg whitespace-pre-wrap">{application.message}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(application.id, 'approved')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                            Approuver
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Rejeter
                          </button>
                        </>
                      )}
                      {application.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(application.id, 'rejected')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Rejeter
                        </button>
                      )}
                      {application.status === 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(application.id, 'approved')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                          Approuver
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(application.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
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

export default AdminFashionDay;
