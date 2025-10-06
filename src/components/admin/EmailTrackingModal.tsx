import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChartBarIcon, EyeIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface EmailTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: any[];
  stats?: any;
}

const EmailTrackingModal: React.FC<EmailTrackingModalProps> = ({
  isOpen,
  onClose,
  emails
}) => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'sent' | 'delivered' | 'opened' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculer les statistiques
  const stats = {
    total: emails.length,
    sent: emails.filter(e => e.status === 'sent').length,
    delivered: emails.filter(e => e.status === 'delivered').length,
    opened: emails.filter(e => e.status === 'opened').length,
    failed: emails.filter(e => e.status === 'failed').length,
    openRate: emails.length > 0 ? (emails.filter(e => e.status === 'opened').length / emails.length) * 100 : 0
  };

  const filteredEmails = emails.filter(email => {
    const matchesFilter = 
      filter === 'all' || 
      email.status === filter;
    
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.to?.some((to: string) => to.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <EnvelopeIcon className="w-4 h-4 text-blue-400" />;
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
      case 'opened':
        return <EyeIcon className="w-4 h-4 text-pm-gold" />;
      case 'failed':
        return <XCircleIcon className="w-4 h-4 text-red-400" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'opened':
        return 'bg-pm-gold/20 text-pm-gold border-pm-gold/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent': return 'Envoyé';
      case 'delivered': return 'Livré';
      case 'opened': return 'Ouvert';
      case 'failed': return 'Échec';
      default: return 'En attente';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <ChartBarIcon className="w-6 h-6" />
              Suivi des Emails
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Statistiques et filtres */}
          <div className="w-1/3 border-r border-pm-gold/20 flex flex-col">
            {/* Statistiques */}
            <div className="p-4 border-b border-pm-gold/20">
              <h3 className="text-lg font-semibold text-pm-gold mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                  <div className="text-sm text-blue-300">Total</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{stats.delivered}</div>
                  <div className="text-sm text-green-300">Livrés</div>
                </div>
                <div className="bg-pm-gold/10 border border-pm-gold/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-pm-gold">{stats.opened}</div>
                  <div className="text-sm text-pm-gold">Ouverts</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">{stats.openRate.toFixed(1)}%</div>
                  <div className="text-sm text-purple-300">Taux d'ouverture</div>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="p-4 border-b border-pm-gold/20">
              <h3 className="text-lg font-semibold text-pm-gold mb-3">Filtres</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                />
                
                <div className="space-y-1">
                  {[
                    { key: 'all', label: 'Tous', count: stats.total },
                    { key: 'sent', label: 'Envoyés', count: stats.sent },
                    { key: 'delivered', label: 'Livrés', count: stats.delivered },
                    { key: 'opened', label: 'Ouverts', count: stats.opened },
                    { key: 'failed', label: 'Échecs', count: stats.failed }
                  ].map(filterOption => (
                    <button
                      key={filterOption.key}
                      onClick={() => setFilter(filterOption.key as any)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                        filter === filterOption.key
                          ? 'bg-pm-gold text-black'
                          : 'bg-pm-gold/10 text-pm-gold hover:bg-pm-gold/20'
                      }`}
                    >
                      <span>{filterOption.label}</span>
                      <span className="text-xs bg-pm-gold/20 px-2 py-1 rounded-full">
                        {filterOption.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Liste des emails */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-lg font-semibold text-pm-gold mb-3">Emails</h3>
              <div className="space-y-2">
                {filteredEmails.map(email => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-3 cursor-pointer border border-pm-gold/20 rounded-lg hover:bg-pm-gold/5 transition-colors ${
                      selectedEmail?.id === email.id ? 'bg-pm-gold/10 border-pm-gold' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(email.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-pm-off-white truncate">
                          {email.subject}
                        </h4>
                        <p className="text-xs text-pm-off-white/70 truncate">
                          À: {email.to?.join(', ') || 'N/A'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(email.status)}`}>
                            {getStatusLabel(email.status)}
                          </span>
                          <span className="text-xs text-pm-off-white/50">
                            {formatDate(email.sentAt || email.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Détails de l'email sélectionné */}
          <div className="flex-1 flex flex-col">
            {selectedEmail ? (
              <>
                <div className="p-6 border-b border-pm-gold/20">
                  <h2 className="text-xl font-playfair text-pm-gold mb-4">
                    {selectedEmail.subject}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-pm-gold mb-2">Informations</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-pm-off-white/70">Statut:</span>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(selectedEmail.status)}`}>
                            {getStatusLabel(selectedEmail.status)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-pm-off-white/70">Priorité:</span>
                          <span className="text-pm-off-white">{selectedEmail.priority || 'Normale'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-pm-off-white/70">Envoyé le:</span>
                          <span className="text-pm-off-white">
                            {formatDate(selectedEmail.sentAt || selectedEmail.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-pm-off-white/70">Destinataires:</span>
                          <span className="text-pm-off-white">{selectedEmail.to?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-pm-gold mb-2">Destinataires</h3>
                      <div className="space-y-1">
                        {selectedEmail.to?.map((recipient: string, index: number) => (
                          <div key={index} className="text-sm text-pm-off-white">
                            {recipient}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-pm-gold mb-4">Contenu</h3>
                  <div className="prose prose-invert max-w-none">
                    {selectedEmail.type === 'html' ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedEmail.content }} />
                    ) : (
                      <pre className="whitespace-pre-wrap text-pm-off-white font-sans">
                        {selectedEmail.content}
                      </pre>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-pm-gold mb-2">Sélectionnez un email</h3>
                  <p className="text-pm-off-white/70">Choisissez un email pour voir les détails de suivi</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTrackingModal;
