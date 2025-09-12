import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const AdminBeginnerStudents: React.FC = () => {
    const { data } = useData();
    const students = data?.beginnerStudents || [];
    const [copiedMatricule, setCopiedMatricule] = useState<string | null>(null);

    const handleCopy = (textToCopy: string, matricule: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedMatricule(matricule);
        setTimeout(() => setCopiedMatricule(null), 2000);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Accès Débutants" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold mb-2">Accès des Mannequins Débutants</h1>
                <p className="text-pm-off-white/70 mb-8">
                    Tableau récapitulatif des identifiants de connexion pour le Classroom Débutant.
                </p>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Nom du Mannequin</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Matricule</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-pm-off-white/70">Mot de passe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} className="border-b border-pm-dark hover:bg-pm-dark/50 [&:nth-child(even)]:bg-pm-dark/30">
                                        <td className="p-4 font-semibold">{student.name}</td>
                                        <td className="p-4 font-mono text-xs text-pm-gold/80">{student.matricule}</td>
                                        <td className="p-4 text-pm-off-white/80">
                                            <div className="flex items-center gap-2">
                                                <span>{student.password}</span>
                                                <button onClick={() => handleCopy(student.password, student.matricule)} className="text-pm-off-white/60 hover:text-pm-gold">
                                                    {copiedMatricule === student.matricule ? (
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
                        {students.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun mannequin débutant trouvé.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBeginnerStudents;
