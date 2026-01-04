import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ClipboardDocumentIcon, CheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const AdminModelAccess: React.FC = () => {
    const { data } = useData();
    const proModels = data?.models.filter(model => model.level !== 'Débutant').sort((a,b) => a.name.localeCompare(b.name)) || [];
    const [copiedUsername, setCopiedUsername] = useState<string | null>(null);

    const handleCopy = (textToCopy: string, username: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedUsername(username);
        setTimeout(() => setCopiedUsername(null), 2000);
    };
    
    const handleDownloadCSV = () => {
        if (!proModels || proModels.length === 0) {
            alert("Aucune donnée à télécharger.");
            return;
        }

        const headers = ["Nom du Mannequin", "Identifiant (Matricule)", "Mot de passe"];
        const csvContent = [
            headers.join(','),
            ...proModels.map(model => 
                [
                    `"${model.name.replace(/"/g, '""')}"`, // Escape double quotes
                    model.username,
                    model.password
                ].join(',')
            )
        ].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel compatibility
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "acces-mannequins-pro.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
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
                        <h1 className="admin-page-title">Accès des Mannequins Professionnels</h1>
                        <p className="admin-page-subtitle">
                            Tableau récapitulatif des identifiants de connexion pour chaque mannequin professionnel.
                        </p>
                    </div>
                     <button onClick={handleDownloadCSV} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                        <ArrowDownTrayIcon className="w-5 h-5"/> Télécharger en CSV
                    </button>
                </div>


                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Nom du Mannequin</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Identifiant (Matricule)</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Mot de passe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proModels.map(model => (
                                    <tr key={model.id} className="border-b border-pm-dark hover:bg-pm-dark/50 [&:nth-child(even)]:bg-pm-dark/30">
                                        <td className="p-4 font-semibold">{model.name}</td>
                                        <td className="p-4 font-mono text-xs text-pm-gold/80">{model.username}</td>
                                        <td className="p-4 text-pm-off-white/80">
                                            <div className="flex items-center gap-2">
                                                <span>{model.password}</span>
                                                <button onClick={() => handleCopy(model.password, model.username)} className="text-pm-off-white/60 hover:text-pm-gold">
                                                    {copiedUsername === model.username ? (
                                                        <CheckIcon className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <ClipboardDocumentIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {proModels.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun mannequin professionnel trouvé.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminModelAccess;
