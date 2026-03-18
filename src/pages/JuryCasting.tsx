import React from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const JuryCasting: React.FC = () => {
  const { data } = useData();
  const applications = data?.castingApplications?.filter(a => a.status !== 'Refusé') || [];

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white">
      <SEO title="Jury — Casting" noIndex />
      <div className="page-container">
        <h1 className="text-4xl font-playfair font-black italic mb-8">Interface Jury</h1>
        <p className="text-white/40 mb-8">{applications.length} candidature(s) à évaluer.</p>
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="border border-white/5 p-6 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{app.firstName} {app.lastName}</p>
                <p className="text-white/40 text-sm">{app.email}</p>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-black text-pm-gold border border-pm-gold/20 px-3 py-1">{app.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JuryCasting;
