import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { CheckIcon, XMarkIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

// ArticleComment type removed - using any[]

const AdminComments: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const comments = data?.articleComments || [];
  
  const filteredComments = comments.filter((comment: any) => 
    filter === 'all' || comment.status === filter
  );

  const handleStatusChange = (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    const updatedComments = comments.map((comment: any) =>
      comment.id === id ? { ...comment, status: newStatus } : comment
    );
    saveData({ ...data!, articleComments: updatedComments });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      const updatedComments = comments.filter((comment: any) => comment.id !== id);
      saveData({ ...data!, articleComments: updatedComments });
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
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return 'Non modéré';
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
      <SEO title="Modération des Commentaires" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Modération des Commentaires</h1>
            <p className="admin-page-subtitle">Modérer les commentaires laissés sur les articles du magazine.</p>
          </div>
        </header>

        <div className="admin-section-wrapper">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="admin-section-title">Commentaires</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Tous ({comments.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'pending' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                En attente ({comments.filter((c: any) => c.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'approved' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Approuvés ({comments.filter((c: any) => c.status === 'approved').length})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'rejected' 
                    ? 'bg-pm-gold text-pm-dark' 
                    : 'bg-pm-off-white/10 text-pm-off-white/70 hover:bg-pm-off-white/20'
                }`}
              >
                Rejetés ({comments.filter((c: any) => c.status === 'rejected').length})
              </button>
            </div>
          </div>

          {filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <EyeIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">
                {filter === 'all' 
                  ? 'Aucun commentaire' 
                  : `Aucun commentaire ${filter === 'pending' ? 'en attente' : filter === 'approved' ? 'approuvé' : 'rejeté'}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map((comment: any) => (
                <div key={comment.id} className="card-base p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-pm-gold">{comment.authorName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(comment.status || 'pending')}`}>
                          {getStatusLabel(comment.status || 'pending')}
                        </span>
                      </div>
                      <p className="text-pm-off-white/80 mb-3 leading-relaxed">{comment.content}</p>
                      <div className="text-sm text-pm-off-white/50">
                        <p><strong>Article:</strong> {comment.articleSlug}</p>
                        <p><strong>Date:</strong> {formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {(comment.status === 'pending' || !comment.status) && (
                        <>
                          <button
                            onClick={() => handleStatusChange(comment.id, 'approved')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                          >
                            <CheckIcon className="w-4 h-4" />
                            Approuver
                          </button>
                          <button
                            onClick={() => handleStatusChange(comment.id, 'rejected')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                            Rejeter
                          </button>
                        </>
                      )}
                      {comment.status === 'approved' && (
                        <button
                          onClick={() => handleStatusChange(comment.id, 'rejected')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Rejeter
                        </button>
                      )}
                      {comment.status === 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(comment.id, 'approved')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Approuver
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment.id)}
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

export default AdminComments;
