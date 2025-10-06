import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { EnvelopeIcon, CheckIcon, ArchiveBoxIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

// ContactMessage type removed - using any[]

const AdminMessages: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'Nouveau' | 'Lu' | 'Archivé'>('all');

  const contactMessages = data?.contactMessages || [];
  
  const filteredMessages = contactMessages.filter(message => 
    filter === 'all' || message.status === filter
  );

  const handleStatusChange = (id: string, newStatus: 'Nouveau' | 'Lu' | 'Archivé') => {
    const updatedMessages = contactMessages.map(message =>
      message.id === id ? { ...message, status: newStatus } : message
    );
    saveData({ ...data!, contactMessages: updatedMessages });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      const updatedMessages = contactMessages.filter(message => message.id !== id);
      saveData({ ...data!, contactMessages: updatedMessages });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau': return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'Lu': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'Archivé': return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
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
      <SEO title="Messages de Contact" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Messages de Contact</h1>
            <p className="admin-page-subtitle">Gérer les messages reçus via le formulaire de contact.</p>
          </div>
        </header>

        <div className="admin-section-wrapper">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="admin-section-title">Messages</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Tous ({contactMessages.length})
              </button>
              <button
                onClick={() => setFilter('Nouveau')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Nouveau' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Nouveaux ({contactMessages.filter(m => m.status === 'Nouveau').length})
              </button>
              <button
                onClick={() => setFilter('Lu')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Lu' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Lus ({contactMessages.filter(m => m.status === 'Lu').length})
              </button>
              <button
                onClick={() => setFilter('Archivé')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'Archivé' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Archivés ({contactMessages.filter(m => m.status === 'Archivé').length})
              </button>
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <EnvelopeIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">
                {filter === 'all' 
                  ? 'Aucun message' 
                  : `Aucun message ${filter.toLowerCase()}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div key={message.id} className="card-base p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-pm-gold">{message.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-pm-off-white/70 mb-1"><strong>Email:</strong> {message.email}</p>
                        <p className="text-sm text-pm-off-white/70 mb-1"><strong>Sujet:</strong> {message.subject}</p>
                        <p className="text-sm text-pm-off-white/70 mb-1"><strong>Date:</strong> {formatDate(message.submissionDate)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-pm-off-white/70 mb-1"><strong>Message:</strong></p>
                        <p className="text-pm-off-white/80 bg-pm-off-white/5 p-3 rounded-lg whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {message.status === 'Nouveau' && (
                        <button
                          onClick={() => handleStatusChange(message.id, 'Lu')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                          Marquer comme lu
                        </button>
                      )}
                      {message.status === 'Lu' && (
                        <button
                          onClick={() => handleStatusChange(message.id, 'Archivé')}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 text-gray-400 border border-gray-600/30 rounded-lg hover:bg-gray-600/30 transition-colors"
                        >
                          <ArchiveBoxIcon className="w-4 h-4" />
                          Archiver
                        </button>
                      )}
                      {message.status === 'Archivé' && (
                        <button
                          onClick={() => handleStatusChange(message.id, 'Lu')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Désarchiver
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(message.id)}
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

export default AdminMessages;
