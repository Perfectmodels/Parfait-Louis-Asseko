import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CheckIcon, XMarkIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

// ArticleComment type removed - using any[]

const AdminComments: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const comments = data?.articleComments || [];
  
  const filteredComments = comments.filter(comment => 
    filter === 'all' || comment.status === filter
  );

  const handleStatusChange = (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    const updatedComments = comments.map(comment =>
      comment.id === id ? { ...comment, status: newStatus } : comment
    );
    saveData({ ...data!, articleComments: updatedComments });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      const updatedComments = comments.filter(comment => comment.id !== id);
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
      <SEO title="Admin - Commentaires" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Commentaires</h1>
            <p className="admin-page-subtitle">Gérez les commentaires des articles.</p>
          </div>
        </header>

        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Commentaires</h2>
          
          <div className="flex items-center gap-4 mb-6">
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                  filter === f
                    ? 'bg-pm-gold text-pm-dark border-pm-gold'
                    : 'border-pm-off-white/50 text-pm-off-white hover:bg-pm-gold/20'
                }`}
              >
                {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : f === 'approved' ? 'Approuvés' : 'Rejetés'}
              </button>
            ))}
          </div>

          {filteredComments.length === 0 ? (
            <div className="text-center py-16">
              <EyeIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">Aucun commentaire trouvé</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredComments.map(comment => (
                <div key={comment.id} className="card-base p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-pm-gold">{comment.authorName}</h3>
                      <p className="text-sm text-pm-off-white/70">{comment.email}</p>
                      <p className="text-xs text-pm-off-white/50 mt-1">
                        Commenté le {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(comment.status)}`}>
                        {comment.status === 'pending' ? 'En attente' : comment.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                      </span>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-pm-off-white/80 whitespace-pre-wrap bg-pm-off-white/5 p-4 rounded-lg">
                      {comment.content}
                    </p>
                  </div>

                  {comment.articleId && (
                    <div className="mb-4">
                      <p className="text-sm text-pm-off-white/70">Article</p>
                      <p className="text-pm-off-white">ID: {comment.articleId}</p>
                    </div>
                  )}

                  {comment.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t border-pm-gold/20">
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
                    </div>
                  )}
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