import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import AdminFilterBar from '../components/admin/AdminFilterBar';

const AdminBookings: React.FC = () => {
    const { data, saveData } = useData();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const bookings = data?.bookingRequests || [];

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
        if (!data) return;
    const updated = bookings.map(b => 
      b.id === id ? { ...b, status: newStatus } : b
    );
    saveData({ ...data, bookingRequests: updated });
  };

  const handleDelete = (id: string) => {
    if (!data) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      const updated = bookings.filter(b => b.id !== id);
      saveData({ ...data, bookingRequests: updated });
        }
    };

    return (
    <AdminLayout>
      <AdminPageHeader 
        title="Réservations" 
        subtitle="Gérer les demandes de réservation"
      />

      <AdminFilterBar
        filters={[
          { label: 'Toutes', value: 'all' },
          { label: 'Nouvelles', value: 'new' },
          { label: 'Confirmées', value: 'confirmed' },
          { label: 'Annulées', value: 'cancelled' }
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom ou email..."
      />

      <AdminSection title={`${filteredBookings.length} réservation(s)`}>
                <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <AdminCard key={booking.id}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                                <div>
                    <h3 className="font-semibold text-lg">{booking.name}</h3>
                    <p className="text-sm text-gray-600">{booking.email}</p>
                    <p className="text-sm text-gray-600">{booking.phone}</p>
                                </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmée' :
                     booking.status === 'cancelled' ? 'Annulée' : 'Nouvelle'}
                        </span>
                      </div>
                      
                <div className="grid grid-cols-2 gap-4">
                        <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{booking.service}</p>
                        </div>
                        <div>
                    <p className="text-sm text-gray-500">Date souhaitée</p>
                    <p className="font-medium">{new Date(booking.preferredDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                      
                {booking.message && (
                      <div>
                    <p className="text-sm text-gray-500">Message</p>
                    <p className="text-gray-700">{booking.message}</p>
                      </div>
                )}

                <div className="flex gap-2 pt-2">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="new">Nouvelle</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                      <button
                        onClick={() => handleDelete(booking.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
            </AdminCard>
              ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune réservation trouvée
            </div>
          )}
        </div>
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminBookings;

