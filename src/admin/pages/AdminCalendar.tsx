import React from 'react';
import SEO from '../../components/SEO';
import AdminPageHeader from '../components/AdminPageHeader';

const AdminCalendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <SEO title="Admin - Calendrier" noIndex />
      <AdminPageHeader title="Calendrier Unifié" subtitle="Bookings, événements PFD, shootings, formations." />
      <div className="bg-black border border-pm-gold/20 rounded-lg p-6 text-pm-off-white/70">
        Calendrier à venir. Intégration ICS/Google Calendar, vues mois/semaine/jour.
      </div>
    </div>
  );
};

export default AdminCalendar;
