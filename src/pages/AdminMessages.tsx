import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { EnvelopeIcon, CheckIcon, ArchiveBoxIcon, TrashIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';

const AdminMessages: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'Nouveau' | 'Lu' | 'Archivé'>('all');

  if (!data) {
    return (
      <AdminLayout>
        <SEO title="Admin - Messages de Contact" noIndex />
      </AdminLayout>
    );
  }

  const contactMessages = data.contactMessages || [];

  const filteredMessages = contactMessages.filter((message: any) =>
    filter === 'all' || message.status === filter
  );

  const handleStatusChange = async (id: string, newStatus: 'Nouveau' | 'Lu' | 'Archivé') => {
    const updatedMessages = contactMessages.map((message: any) =>
      message.id === id ? { ...message, status: newStatus } : message
    );
    await saveData({ ...data, contactMessages: updatedMessages });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    const updatedMessages = contactMessages.filter((message: any) => message.id !== id);
    await saveData({ ...data, contactMessages: updatedMessages });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'Lu': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'Archivé': return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const formatDate = (timestamp: string) => new Date(timestamp).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <AdminLayout>
      <SEO title="Admin - Messages de Contact" noIndex />
      <AdminPageHeader
        title="Messages de Contact"
        subtitle="Gérez les messages reçus via le formulaire de contact."
      />

      <AdminSection title="Messages">
        <AdminCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {(['all', 'Nouveau', 'Lu', 'Archivé'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                  filter === f
                    ? 'bg-pm-gold text-pm-dark border-pm-gold'
                    : 'border-pm-off-white/50 text-pm-off-white hover:bg-pm-gold/20'
                }`}
              >
                {f === 'all' ? 'Tous' : f}
              </button>
            ))}
          </div>

          {filteredMessages.length === 0 ? (
            <div className="text-center py-16">
              <EnvelopeIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">Aucun message trouvé</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMessages.map((message: any) => (
                <div key={message.id} className="card-base p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-pm-gold">{message.subject}</h3>
                      <p className="text-sm text-pm-off-white/70">de <strong>{message.name}</strong> ({message.email})</p>
                      <p className="text-xs text-pm-off-white/50 mt-1">Reçu le {formatDate(message.submissionDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>{message.status}</span>
                      <button onClick={() => handleDelete(message.id)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                      </div>
                      
                      <div className="mb-4">
                    <p className="text-pm-off-white/80 whitespace-pre-wrap bg-pm-off-white/5 p-4 rounded-lg">{message.message}</p>
                    </div>
                    
                      {message.status === 'Nouveau' && (
                    <div className="flex gap-2 pt-4 border-t border-pm-gold/20">
                      <button onClick={() => handleStatusChange(message.id, 'Lu')} className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors">
                        <CheckIcon className="w-4 h-4" /> Marquer comme lu
                        </button>
                      <button onClick={() => handleStatusChange(message.id, 'Archivé')} className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 text-gray-400 border border-gray-600/30 rounded-lg hover:bg-gray-600/30 transition-colors">
                        <ArchiveBoxIcon className="w-4 h-4" /> Archiver
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminMessages;


