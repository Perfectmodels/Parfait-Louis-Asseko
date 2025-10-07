import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { TrashIcon, EyeIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';

const AdminFashionDay: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  if (!data) {
    return (
      <AdminLayout>
        <SEO title="Admin - Fashion Day" noIndex />
      </AdminLayout>
    );
  }

  const fashionDayApplications = data.fashionDayApplications || [];
  const fashionDayEvents = data.fashionDayEvents || [];

  const filteredApplications = fashionDayApplications.filter((app: any) =>
    filter === 'all' || app.status === filter
  );

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    const updated = fashionDayApplications.map((app: any) => app.id === id ? { ...app, status: newStatus } : app);
    await saveData({ ...data, fashionDayApplications: updated });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette candidature ?')) return;
    const updated = fashionDayApplications.filter((app: any) => app.id !== id);
    await saveData({ ...data, fashionDayApplications: updated });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'approved': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'rejected': return 'bg-red-600/20 text-red-400 border-red-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const formatDate = (timestamp: string) => new Date(timestamp).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <AdminLayout>
      <SEO title="Admin - Fashion Day" noIndex />
      <AdminPageHeader title="Fashion Day" subtitle="Gérez les candidatures et événements Fashion Day." />

      <AdminSection title="Candidatures Fashion Day">
        <AdminCard className="p-6">
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
                {f === 'all' ? 'Toutes' : f === 'pending' ? 'En attente' : f === 'approved' ? 'Approuvées' : 'Rejetées'}
            </button>
            ))}
        </div>
          
          {filteredApplications.length === 0 ? (
            <div className="text-center py-16">
              <CalendarIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">Aucune candidature Fashion Day trouvée</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredApplications.map((app: any) => (
                <div key={app.id} className="card-base p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-pm-gold">{app.name}</h3>
                      <p className="text-sm text-pm-off-white/70">{app.email}</p>
                      <p className="text-xs text-pm-off-white/50 mt-1">Candidature du {formatDate(app.submissionDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status === 'pending' ? 'En attente' : app.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                        </span>
                      <button onClick={() => handleDelete(app.id)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors" title="Supprimer">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                      <p className="text-sm text-pm-off-white/70">Téléphone</p>
                      <p className="text-pm-off-white">{app.phone}</p>
                        </div>
                        <div>
                      <p className="text-sm text-pm-off-white/70">Rôle souhaité</p>
                      <p className="text-pm-off-white capitalize">{app.role}</p>
                        </div>
                      </div>
                      
                  {app.experience && (
                        <div className="mb-4">
                      <p className="text-sm text-pm-off-white/70">Expérience</p>
                      <p className="text-pm-off-white/80 bg-pm-off-white/5 p-3 rounded-lg">{app.experience}</p>
                            </div>
                  )}
                  {app.portfolio && (
                    <div className="mb-4">
                      <p className="text-sm text-pm-off-white/70">Portfolio</p>
                      <p className="text-pm-off-white/80 bg-pm-off-white/5 p-3 rounded-lg">{app.portfolio}</p>
                        </div>
                      )}
                      
                  {app.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t border-pm-gold/20">
                      <button onClick={() => handleStatusChange(app.id, 'approved')} className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors">
                        <EyeIcon className="w-4 h-4" /> Approuver
                      </button>
                      <button onClick={() => handleStatusChange(app.id, 'rejected')} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors">
                        <TrashIcon className="w-4 h-4" /> Rejeter
                      </button>
                        </div>
                      )}
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </AdminSection>

      <AdminSection title="Statistiques">
        <AdminCard className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <UserGroupIcon className="w-12 h-12 text-pm-gold mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-pm-gold mb-1">{fashionDayApplications.length}</h3>
            <p className="text-pm-off-white/70">Total candidatures</p>
        </div>
          <div>
            <CalendarIcon className="w-12 h-12 text-pm-gold mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-pm-gold mb-1">{fashionDayEvents.length}</h3>
            <p className="text-pm-off-white/70">Événements</p>
      </div>
          <div>
            <EyeIcon className="w-12 h-12 text-pm-gold mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-pm-gold mb-1">{fashionDayApplications.filter((a: any) => a.status === 'approved').length}</h3>
            <p className="text-pm-off-white/70">Candidatures approuvées</p>
    </div>
        </AdminCard>
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminFashionDay;


