import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import AdminFilterBar from '../components/admin/AdminFilterBar';

const AdminAbsences: React.FC = () => {
    const { data, saveData } = useData();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const absences = data?.absenceRequests || [];

  const filteredAbsences = absences.filter(absence => {
    const matchesFilter = filter === 'all' || absence.status === filter;
    const matchesSearch = searchTerm === '' || 
      absence.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      absence.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    if (!data) return;
    const updated = absences.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    );
    saveData({ ...data, absenceRequests: updated });
  };

  const handleDelete = (id: string) => {
            if (!data) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande d\'absence ?')) {
      const updated = absences.filter(a => a.id !== id);
      saveData({ ...data, absenceRequests: updated });
        }
    };

    return (
    <AdminLayout>
      <AdminPageHeader 
        title="Demandes d'Absence" 
        subtitle="Gérer les demandes d'absence des mannequins"
      />

      <AdminFilterBar
        filters={[
          { label: 'Tous', value: 'all' },
          { label: 'En attente', value: 'pending' },
          { label: 'Approuvé', value: 'approved' },
          { label: 'Refusé', value: 'rejected' }
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom ou email..."
      />

      <AdminSection title={`${filteredAbsences.length} demande(s)`}>
        <div className="space-y-4">
          {filteredAbsences.map((absence) => (
            <AdminCard key={absence.id}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
          <div>
                    <h3 className="font-semibold text-lg">{absence.modelName}</h3>
                    <p className="text-sm text-gray-600">{absence.email}</p>
          </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    absence.status === 'approved' ? 'bg-green-100 text-green-800' :
                    absence.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {absence.status === 'approved' ? 'Approuvé' :
                     absence.status === 'rejected' ? 'Refusé' : 'En attente'}
                          </span>
                      </div>
                      
                <div className="grid grid-cols-2 gap-4">
                        <div>
                    <p className="text-sm text-gray-500">Date d'absence</p>
                    <p className="font-medium">{new Date(absence.absenceDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                    <p className="text-sm text-gray-500">Soumis le</p>
                    <p className="font-medium">{new Date(absence.submittedAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                      
                <div>
                  <p className="text-sm text-gray-500">Raison</p>
                  <p className="font-medium">{absence.reason}</p>
                    </div>
                    
                {absence.description && (
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">{absence.description}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <select
                    value={absence.status}
                    onChange={(e) => handleStatusChange(absence.id, e.target.value)}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="rejected">Refusé</option>
                  </select>
                      <button
                        onClick={() => handleDelete(absence.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
            </AdminCard>
              ))}

          {filteredAbsences.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune demande d'absence trouvée
            </div>
          )}
        </div>
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminAbsences;

