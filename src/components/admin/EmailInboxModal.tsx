import React, { useState } from 'react';
import { XMarkIcon, EnvelopeIcon, EnvelopeOpenIcon, ArrowUturnRightIcon, ForwardIcon, TrashIcon, StarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface EmailInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReply: (email: any) => void;
  onForward: (email: any) => void;
  onDelete: (emailId: string) => void;
  emails: any[];
}

const EmailInboxModal: React.FC<EmailInboxModalProps> = ({
  isOpen,
  onClose,
  onReply,
  onForward,
  onDelete,
  emails
}) => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'sent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = emails.filter(email => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !email.isRead) ||
      (filter === 'starred' && email.isStarred) ||
      (filter === 'sent' && email.status === 'sent');
    
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'low': return 'text-gray-400';
      default: return 'text-pm-gold';
    }
  };

  const getStatusIcon = (email: any) => {
    if (email.isRead) {
      return <EnvelopeOpenIcon className="w-4 h-4 text-pm-off-white/60" />;
    }
    return <EnvelopeIcon className="w-4 h-4 text-pm-gold" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <EnvelopeIcon className="w-6 h-6" />
              Boîte de Réception
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
          {/* Liste des emails */}
          <div className="w-1/3 border-r border-pm-gold/20 flex flex-col">
            {/* Filtres et recherche */}
            <div className="p-4 border-b border-pm-gold/20">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Rechercher dans les emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                />
                
                <div className="flex gap-2">
                  {[
                    { key: 'all', label: 'Tous' },
                    { key: 'unread', label: 'Non lus' },
                    { key: 'starred', label: 'Favoris' },
                    { key: 'sent', label: 'Envoyés' }
                  ].map(filterOption => (
                    <button
                      key={filterOption.key}
                      onClick={() => setFilter(filterOption.key as any)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        filter === filterOption.key
                          ? 'bg-pm-gold text-black'
                          : 'bg-pm-gold/20 text-pm-gold hover:bg-pm-gold/30'
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Liste des emails */}
            <div className="flex-1 overflow-y-auto">
              {filteredEmails.length === 0 ? (
                <div className="p-4 text-center text-pm-off-white/60">
                  Aucun email trouvé
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredEmails.map(email => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`p-4 cursor-pointer border-b border-pm-gold/10 hover:bg-pm-gold/5 transition-colors ${
                        selectedEmail?.id === email.id ? 'bg-pm-gold/10 border-l-4 border-l-pm-gold' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(email)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-sm font-semibold truncate ${
                              !email.isRead ? 'text-pm-gold' : 'text-pm-off-white'
                            }`}>
                              {email.subject}
                            </h3>
                            <div className="flex items-center gap-2">
                              {email.isStarred && (
                                <StarIcon className="w-4 h-4 text-yellow-400" />
                              )}
                              <span className={`text-xs ${getPriorityColor(email.priority)}`}>
                                {email.priority === 'high' ? '!' : email.priority === 'low' ? '↓' : ''}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-pm-off-white/70 truncate mb-1">
                            {email.from || email.to?.join(', ')}
                          </p>
                          <p className="text-xs text-pm-off-white/60 truncate">
                            {email.content?.substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-pm-off-white/50">
                              {formatDate(email.sentAt || email.createdAt)}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReply(email);
                                }}
                                className="p-1 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded"
                                title="Répondre"
                              >
                                <ArrowUturnRightIcon className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onForward(email);
                                }}
                                className="p-1 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded"
                                title="Transférer"
                              >
                                <ForwardIcon className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(email.id);
                                }}
                                className="p-1 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded"
                                title="Supprimer"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contenu de l'email sélectionné */}
          <div className="flex-1 flex flex-col">
            {selectedEmail ? (
              <>
                <div className="p-6 border-b border-pm-gold/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-playfair text-pm-gold mb-2">
                        {selectedEmail.subject}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-pm-off-white/70">
                        <span>De: {selectedEmail.from || 'Système'}</span>
                        <span>À: {selectedEmail.to?.join(', ') || 'N/A'}</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {formatDate(selectedEmail.sentAt || selectedEmail.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onReply(selectedEmail)}
                        className="p-2 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors"
                        title="Répondre"
                      >
                        <ArrowUturnRightIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onForward(selectedEmail)}
                        className="p-2 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors"
                        title="Transférer"
                      >
                        <ForwardIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(selectedEmail.id)}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    {selectedEmail.type === 'html' ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedEmail.content }} />
                    ) : (
                      <pre className="whitespace-pre-wrap text-pm-off-white font-sans">
                        {selectedEmail.content}
                      </pre>
                    )}
                  </div>
                  
                  {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-pm-gold/20">
                      <h3 className="text-lg font-semibold text-pm-gold mb-3">Pièces jointes</h3>
                      <div className="space-y-2">
                        {selectedEmail.attachments.map((attachment: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-black/20 border border-pm-gold/20 rounded-lg">
                            <div className="w-8 h-8 bg-pm-gold/20 rounded flex items-center justify-center">
                              <span className="text-xs text-pm-gold">📎</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-pm-off-white">{attachment.name}</p>
                              <p className="text-xs text-pm-off-white/60">
                                {(attachment.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button className="px-3 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded hover:bg-pm-gold/30 transition-colors">
                              Télécharger
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <EnvelopeIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-pm-gold mb-2">Sélectionnez un email</h3>
                  <p className="text-pm-off-white/70">Choisissez un email dans la liste pour le lire</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailInboxModal;
