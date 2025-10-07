import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import AdminFilterBar from '../components/admin/AdminFilterBar';

const AdminComments: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const comments = data?.comments || [];

  const filteredComments = comments.filter(comment => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !comment.approved) ||
      (filter === 'approved' && comment.approved);
    const matchesSearch = searchTerm === '' || 
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (id: string, approved: boolean) => {
    if (!data) return;
    const updated = comments.map(c => 
      c.id === id ? { ...c, approved } : c
    );
    saveData({ ...data, comments: updated });
  };

  const handleDelete = (id: string) => {
    if (!data) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      const updated = comments.filter(c => c.id !== id);
      saveData({ ...data, comments: updated });
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Commentaires" 
        subtitle="Gérer les commentaires des articles"
      />

      <AdminFilterBar
        filters={[
          { label: 'Tous', value: 'all' },
          { label: 'En attente', value: 'pending' },
          { label: 'Approuvés', value: 'approved' }
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher dans les commentaires..."
      />

      <AdminSection title={`${filteredComments.length} commentaire(s)`}>
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <AdminCard key={comment.id}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{comment.author}</h3>
                    <p className="text-sm text-gray-600">{comment.email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR')} à{' '}
                      {new Date(comment.createdAt).toLocaleTimeString('fr-FR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    comment.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {comment.approved ? 'Approuvé' : 'En attente'}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Article</p>
                  <p className="font-medium">{comment.articleTitle || comment.articleId}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-700">{comment.content}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  {!comment.approved ? (
                    <button
                      onClick={() => handleApprove(comment.id, true)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approuver
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(comment.id, false)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Désapprouver
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}

          {filteredComments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun commentaire trouvé
            </div>
          )}
        </div>
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminComments;

