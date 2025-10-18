import React from 'react';
import SEO from '../../components/SEO';
import AdminPageHeader from '../components/AdminPageHeader';

const AdminReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <SEO title="Admin - Rapports" noIndex />
      <AdminPageHeader title="Rapports & Analyses" subtitle="Exportez des indicateurs clés (CSV/PDF)." />
      <div className="bg-black border border-pm-gold/20 rounded-lg p-6 text-pm-off-white/70">
        Module de rapports à venir. Sélection de période, filtres, et exports.
      </div>
    </div>
  );
};

export default AdminReports;
