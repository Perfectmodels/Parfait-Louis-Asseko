import React from 'react';
import SEO from '../../components/SEO';
import AdminPageHeader from '../components/AdminPageHeader';
import { useData } from '../../contexts/DataContext';
import { formatDateTime } from '../utils/formatters';

const AdminAuditLog: React.FC = () => {
  const { data } = useData();
  const entries = (data?.auditLog || []).slice().reverse();

  return (
    <div className="space-y-6">
      <SEO title="Admin - Journal d'audit" noIndex />
      <AdminPageHeader title="Journal d'audit" subtitle="Historique des actions effectuées dans l'admin." />
      <div className="bg-black border border-pm-gold/20 rounded-lg">
        <div className="divide-y divide-pm-gold/10">
          {entries.length === 0 && (
            <div className="p-6 text-pm-off-white/60">Aucune entrée d'audit pour le moment.</div>
          )}
          {entries.map((e) => (
            <div key={e.id} className="p-4 flex items-start gap-4">
              <div className="text-xs text-pm-off-white/60 min-w-[180px]">{formatDateTime(e.timestamp)}</div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="text-pm-gold font-semibold">{e.actor.name}</span> ({e.actor.role})
                  {' '}a effectué <span className="font-semibold">{e.action}</span>
                  {e.entity?.type && (
                    <>
                      {' '}sur <span className="text-pm-off-white/90">{e.entity.type}</span>
                      {e.entity.name ? <> « {e.entity.name} »</> : null}
                    </>
                  )}
                </p>
                {e.details && (
                  <p className="text-xs text-pm-off-white/60 mt-1">{e.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLog;
