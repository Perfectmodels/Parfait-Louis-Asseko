import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import AdminFilterBar from '../components/admin/AdminFilterBar';

const AdminRecovery: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const requests = data?.recoveryRequests || [];

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = searchTerm === '' || 
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.accountType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    if (!data) return;
    const updated = requests.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    );
    saveData({ ...data, recoveryRequests: updated });
  };

  const handleDelete = (id: string) => {
    if (!data) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      const updated = requests.filter(r => r.id !== id);
      saveData({ ...data, recoveryRequests: updated });
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Récupération de Compte" 
        subtitle="Gérer les demandes de récupération de compte"
      />

      <AdminFilterBar
        filters={[
          { label: 'Toutes', value: 'all' },
          { label: 'Nouvelles', value: 'new' },
          { label: 'Traitées', value: 'processed' }
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par email..."
      />

      <AdminSection title={`${filteredRequests.length} demande(s)`}>
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <AdminCard key={request.id}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{request.email}</h3>
                    <p className="text-sm text-gray-600">Type: {request.accountType}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    request.status === 'processed' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {request.status === 'processed' ? 'Traitée' : 'Nouvelle'}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Demandé le</p>
                  <p className="font-medium">
                    {new Date(request.requestedAt).toLocaleDateString('fr-FR')} à{' '}
                    {new Date(request.requestedAt).toLocaleTimeString('fr-FR')}
                  </p>
                </div>

                {request.message && (
                  <div>
                    <p className="text-sm text-gray-500">Message</p>
                    <p className="text-gray-700">{request.message}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusChange(request.id, e.target.value)}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="new">Nouvelle</option>
                    <option value="processed">Traitée</option>
                  </select>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune demande de récupération trouvée
            </div>
          )}
        </div>
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminRecovery;

