import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication, CastingApplicationStatus, JuryMember, BeginnerStudent } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, CheckBadgeIcon, XCircleIcon, ArrowPathIcon, PrinterIcon } from '@heroicons/react/24/outline';
import PrintableCastingSheet from '../components/icons/PrintableCastingSheet';

const AdminCastingResults: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<CastingApplicationStatus | 'AllScored'>('AllScored');
    const [printingApp, setPrintingApp] = useState<CastingApplication | null>(null);

    const applicantsWithScores = useMemo(() => {
        const juryMembers: JuryMember[] = data?.juryMembers || [];
        return (data?.castingApplications || [])
            .filter(app => app.scores && Object.keys(app.scores).length > 0)
            .map(app => {
                const scores = Object.values(app.scores!);
                const averageScore = scores.reduce((sum, s) => sum + s.overall, 0) / scores.length;
                
                const scoredJuryIds = Object.keys(app.scores || {});
                const missingJuries = juryMembers.filter(j => !scoredJuryIds.includes(j.id));
                const isFullyScored = missingJuries.length === 0 && juryMembers.length > 0;

                return { ...app, averageScore, juryVotes: scores.length, missingJuries, isFullyScored };
            })
            .sort((a, b) => b.averageScore - a.averageScore);
    }, [data?.castingApplications, data?.juryMembers]);

    const filteredApplicants = useMemo(() => {
        if (filter === 'AllScored') return applicantsWithScores;
        return applicantsWithScores.filter(app => app.status === filter);
    }, [filter, applicantsWithScores]);

    const handleUpdateStatus = async (appId: string, newStatus: CastingApplicationStatus) => {
        if (!data) return;
        const updatedApps = data.castingApplications.map(app =>
            app.id === appId ? { ...app, status: newStatus } : app
        );
        await saveData({ ...data, castingApplications: updatedApps });
    };
    
    const handleValidateAndCreateBeginner = async (app: CastingApplication) => {
        if (!data) return;

        if (app.status === 'Accepté') {
            alert("Ce candidat a déjà été accepté et un profil a été créé.");
            return;
        }
        
        const studentExists = data.beginnerStudents.some(s => s.id === app.id);
        if (studentExists) {
            alert("Ce candidat a déjà été validé et un profil débutant a été créé.");
            await handleUpdateStatus(app.id, 'Accepté');
            return;
        }

        const currentYear = new Date().getFullYear();
        const sanitizeForPassword = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f\']/g, "").replace(/[^a-z0-9-]/g, "");

        const existingMatricules = data.beginnerStudents.map(s => parseInt(s.matricule.split('-')[2], 10) || 0);
        const nextNumber = existingMatricules.length > 0 ? Math.max(...existingMatricules) + 1 : 1;
        const matricule = `DEB-${currentYear}-${String(nextNumber).padStart(3, '0')}`;
        const password = `${sanitizeForPassword(app.firstName)}${currentYear}`;

        const newBeginnerStudent: BeginnerStudent = {
            id: app.id,
            name: `${app.firstName} ${app.lastName}`,
            matricule: matricule,
            password: password,
            quizScores: {}
        };
        
        const updatedBeginnerStudents = [...data.beginnerStudents, newBeginnerStudent];
        const updatedApps: CastingApplication[] = data.castingApplications.map(localApp => localApp.id === app.id ? { ...localApp, status: 'Accepté' } : localApp);

        try {
            await saveData({ ...data, beginnerStudents: updatedBeginnerStudents, castingApplications: updatedApps });
            alert(`Le profil débutant pour ${newBeginnerStudent.name} a été créé avec succès (Matricule: ${matricule}). La candidature a été marquée comme "Accepté".`);
        } catch (error) {
            console.error("Erreur lors de la création du profil débutant:", error);
            alert("Une erreur est survenue lors de la sauvegarde.");
        }
    };
    
    const getStatusColor = (status: CastingApplicationStatus) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Présélectionné': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Accepté': return 'bg-green-500/20 text-green-300 border-green-500';
            case 'Refusé': return 'bg-red-500/20 text-red-300 border-red-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };
    
    const getScoreColor = (score: number) => {
        if (score >= 7.5) return 'text-green-400';
        if (score >= 5) return 'text-yellow-400';
        return 'text-red-400';
    };

    const filterOptions: { value: CastingApplicationStatus | 'AllScored', label: string }[] = [
        { value: 'AllScored', label: 'Tous les Notés' },
        { value: 'Présélectionné', label: 'Présélectionnés' },
        { value: 'Accepté', label: 'Acceptés' },
        { value: 'Refusé', label: 'Refusés' }
    ];

    if (printingApp) {
        return <PrintableCastingSheet app={printingApp} juryMembers={data?.juryMembers || []} onDonePrinting={() => setPrintingApp(null)} />;
    }

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Résultats & Validation Casting" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Résultats & Validation Casting</h1>
                <p className="text-pm-off-white/70 mt-2 mb-8">
                    Consultez les moyennes des candidats et validez leur entrée dans l'agence en tant que débutants.
                </p>

                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    {filterOptions.map(f => (
                        <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all duration-300 ${filter === f.value ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-lg shadow-black/30">
                    <div className="overflow-x-auto">
                         <table className="w-full text-left">
                            <thead className="bg-pm-dark/50">
                                <tr className="border-b border-pm-gold/20">
                                    <th className="p-4 uppercase text-xs tracking-wider">Passage</th>
                                    <th className="p-4 uppercase text-xs tracking-wider">Candidat</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Votes Jury</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Moyenne</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Statut</th>
                                    <th className="p-4 uppercase text-xs tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplicants.map(app => {
                                    const missingJuryNames = app.missingJuries.map(j => j.name).join(', ');
                                    const tooltip = app.isFullyScored
                                        ? "Toutes les notes ont été enregistrées."
                                        : `Notes manquantes: ${missingJuryNames}`;
                                    return (
                                    <tr key={app.id} className={`border-b border-pm-dark hover:bg-pm-dark/50 ${app.isFullyScored ? 'bg-pm-dark border-l-4 border-l-pm-gold' : ''}`}>
                                        <td className="p-4 font-bold text-pm-gold">#{String(app.passageNumber).padStart(3, '0')}</td>
                                        <td className="p-4 font-semibold">{app.firstName} {app.lastName}</td>
                                        <td className="p-4 text-center" title={tooltip}>
                                            {app.juryVotes} / {data?.juryMembers.length || 4}
                                            {!app.isFullyScored && <span className="text-red-500 ml-1">*</span>}
                                        </td>
                                        <td className={`p-4 text-center font-bold text-lg ${getScoreColor(app.averageScore)}`}>{app.averageScore.toFixed(2)}</td>
                                        <td className="p-4 text-center"><span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(app.status)}`}>{app.status}</span></td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setPrintingApp(app)}
                                                    className="action-btn bg-blue-500/10 text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
                                                    title="Télécharger la fiche PDF"
                                                >
                                                    <PrinterIcon className="w-5 h-5"/>
                                                </button>
                                                {app.status === 'Présélectionné' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleValidateAndCreateBeginner(app)} 
                                                            className="action-btn bg-green-500/10 text-green-300 border-green-500/50 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
                                                            title={app.isFullyScored ? "Accepter & Créer le profil" : "En attente de toutes les notes"}
                                                            disabled={!app.isFullyScored}
                                                        >
                                                            <CheckBadgeIcon className="w-5 h-5"/>
                                                        </button>
                                                        <button onClick={() => handleUpdateStatus(app.id, 'Refusé')} className="action-btn bg-red-500/10 text-red-300 border-red-500/50 hover:bg-red-500/20" title="Refuser">
                                                            <XCircleIcon className="w-5 h-5"/>
                                                        </button>
                                                    </>
                                                )}
                                                {app.status === 'Accepté' && (
                                                    <span className="text-xs text-green-400">Profil Créé</span>
                                                )}
                                                {app.status === 'Refusé' && (
                                                    <button onClick={() => handleUpdateStatus(app.id, 'Présélectionné')} className="action-btn bg-yellow-500/10 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/20" title="Annuler le refus">
                                                        <ArrowPathIcon className="w-5 h-5"/>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                         </table>
                         {filteredApplicants.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun candidat ne correspond à ce filtre.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCastingResults;