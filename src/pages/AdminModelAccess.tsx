import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ClipboardDocumentIcon, CheckIcon, ArrowDownTrayIcon, KeyIcon } from '@heroicons/react/24/outline';

const AdminModelAccess: React.FC = () => {
    const { data } = useData();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const models = data?.models || [];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadCSV = () => {
        const csvContent = [
      ['Nom', 'Username', 'Mot de passe', 'Email', 'Téléphone'].join(','),
      ...models.map(model => [
        `"${model.name}"`,
        `"${model.username || model.email}"`,
        `"${model.password || '********'}"`,
        `"${model.email}"`,
        `"${model.phone || ''}"`
      ].join(','))
        ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modeles-acces.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Accès Mannequins Pro" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Tableau de Bord
                        </Link>
            <h1 className="admin-page-title">Accès Mannequins Professionnels</h1>
                        <p className="admin-page-subtitle">
              Consulter et gérer les identifiants de connexion des mannequins professionnels.
                        </p>
                    </div>
          <button 
            onClick={downloadCSV} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5"/> Télécharger CSV
                    </button>
                </div>

        <div className="admin-section-wrapper !p-0 mt-8 overflow-x-auto">
                        <table className="w-full text-left">
            <thead className="bg-pm-dark/50 sticky top-0">
                                <tr className="border-b border-pm-gold/20">
                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 font-semibold">Nom</th>
                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 font-semibold">Username</th>
                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 font-semibold">Mot de passe</th>
                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 font-semibold">Email</th>
                <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70 font-semibold">Téléphone</th>
                                </tr>
                            </thead>
                            <tbody>
              {models.map((model) => (
                <tr key={model.id} className="border-b border-pm-dark hover:bg-pm-dark/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <KeyIcon className="w-4 h-4 text-pm-gold/60" />
                      <span className="font-semibold text-pm-off-white">{model.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm text-pm-gold/90 bg-pm-dark/50 px-3 py-1 rounded border border-pm-gold/20">
                        {model.username || model.email}
                      </code>
                      <button
                        onClick={() => copyToClipboard(model.username || model.email, `${model.id}-username`)}
                        className="text-pm-off-white/60 hover:text-pm-gold transition-colors p-1"
                        title="Copier le username"
                      >
                        {copiedId === `${model.id}-username` ? (
                          <CheckIcon className="w-4 h-4 text-green-400" />
                        ) : (
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                                            <div className="flex items-center gap-2">
                      <code className="font-mono text-sm text-pm-gold/90 bg-pm-dark/50 px-3 py-1 rounded border border-pm-gold/20">
                        {model.password || '********'}
                      </code>
                      <button
                        onClick={() => copyToClipboard(model.password || '', `${model.id}-password`)}
                        className="text-pm-off-white/60 hover:text-pm-gold transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={!model.password}
                        title="Copier le mot de passe"
                      >
                        {copiedId === `${model.id}-password` ? (
                          <CheckIcon className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <ClipboardDocumentIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                  <td className="p-4">
                    <span className="text-pm-off-white/80 text-sm">{model.email}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-pm-off-white/80 text-sm">{model.phone || '—'}</span>
                  </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
          
          {models.length === 0 && (
            <div className="text-center py-16 text-pm-off-white/60">
              <KeyIcon className="w-12 h-12 mx-auto mb-4 text-pm-gold/30" />
              <p className="text-lg">Aucun mannequin professionnel enregistré</p>
            </div>
          )}
        </div>

        {models.length > 0 && (
          <div className="mt-6 p-4 bg-pm-dark/30 border border-pm-gold/20 rounded-lg">
            <div className="flex items-start gap-3">
              <KeyIcon className="w-5 h-5 text-pm-gold mt-0.5 flex-shrink-0" />
              <div className="text-sm text-pm-off-white/70">
                <p className="font-semibold text-pm-gold mb-1">Note importante :</p>
                <p>Ces identifiants permettent aux mannequins professionnels d'accéder à leur espace personnel. Gardez ces informations confidentielles et sécurisées.</p>
                  </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModelAccess;

