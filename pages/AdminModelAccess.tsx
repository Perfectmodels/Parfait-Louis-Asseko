

import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const AdminModelAccess: React.FC = () => {
    const { data } = useData();
    const models = data?.models || [];
    const [copiedUsername, setCopiedUsername] = useState<string | null>(null);

    const handleCopy = (textToCopy: string, username: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedUsername(username);
        setTimeout(() => setCopiedUsername(null), 2000);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Accès Mannequins" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold mb-2">Accès des Mannequins</h1>
                <p className="text-pm-off-white/70 mb-8">
                    Tableau récapitulatif des identifiants de connexion uniques pour chaque mannequin.
                </p>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Nom du Mannequin</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Identifiant (Username)</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Mot de Passe</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {models.map(model => (
                                    <tr key={model.id} className="border-b border-pm-dark hover:bg-pm-dark/50 [&:nth-child(even)]:bg-pm-dark/30">
                                        <td className="p-4 font-semibold">{model.name}</td>
                                        <td className="p-4 font-mono text-sm text-pm-gold/80">{model.username}</td>
                                        <td className="p-4 font-mono text-sm">{model.password}</td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => handleCopy(`${model.username}:${model.password}`, model.username)} 
                                                className="flex items-center gap-2 px-3 py-1 text-xs bg-pm-dark border border-pm-gold/50 text-pm-gold rounded-full hover:bg-pm-gold hover:text-pm-dark transition-colors"
                                            >
                                                {copiedUsername === model.username ? (
                                                    <> <CheckIcon className="w-4 h-4 text-green-400" /> Copié !</>
                                                ) : (
                                                    <> <ClipboardDocumentIcon className="w-4 h-4" /> Copier</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {models.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun mannequin à afficher. Ajoutez-en depuis la section "Gérer les Mannequins".</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminModelAccess;