import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication } from '../types';
import SEO from '../components/SEO';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import { ChevronLeftIcon, StarIcon, UsersIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';

// FIX: Renamed `status` to `liveStatus` to avoid conflict with `CastingApplication.status`
type ApplicantWithScore = CastingApplication & {
    averageScore: number;
    juryCount: number;
    liveStatus: 'Présélectionné' | 'Recalé';
};

type ActiveTab = 'all' | 'selected' | 'rejected';

const AdminCastingLive: React.FC = () => {
    const { data } = useData();
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [activeTab, setActiveTab] = useState<ActiveTab>('all');

    useEffect(() => {
        setLastUpdate(new Date());
    }, [data]);

    const allApplicants = useMemo((): ApplicantWithScore[] => {
        if (!data?.castingApplications) return [];
        
        return data.castingApplications
            .filter(app => app.passageNumber && app.scores && Object.keys(app.scores).length > 0)
            .map(app => {
                const scoresArray = Object.values(app.scores!);
                const averageScore = scoresArray.reduce((acc, score) => acc + score.overall, 0) / scoresArray.length;
                const juryCount = scoresArray.length;
                // FIX: Explicitly type `liveStatus` to prevent TypeScript from widening it to a generic `string` and ensure it matches the `ApplicantWithScore` type.
                const liveStatus: 'Présélectionné' | 'Recalé' = averageScore >= 5 ? 'Présélectionné' : 'Recalé';
                return { ...app, averageScore, juryCount, liveStatus };
            })
            .sort((a, b) => b.averageScore - a.averageScore);

    }, [data?.castingApplications]);

    const displayedApplicants = useMemo(() => {
        if (activeTab === 'selected') {
            return allApplicants.filter(app => app.liveStatus === 'Présélectionné');
        }
        if (activeTab === 'rejected') {
            return allApplicants.filter(app => app.liveStatus === 'Recalé');
        }
        return allApplicants;
    }, [activeTab, allApplicants]);

    const selectedCount = allApplicants.filter(app => app.liveStatus === 'Présélectionné').length;
    const rejectedCount = allApplicants.length - selectedCount;

    return (
        <div className="bg-black text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Résultats Casting Live" noIndex />
            <div className="container mx-auto px-6">
                <ReactRouterDOM.Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </ReactRouterDOM.Link>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Résultats du Casting en Direct</h1>
                        <p className="text-pm-off-white/70">Les résultats sont mis à jour en temps réel.</p>
                    </div>
                    <div className="text-right text-xs text-pm-off-white/60">
                        <p>Dernière màj:</p>
                        <p>{lastUpdate.toLocaleTimeString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard icon={UsersIcon} label="Total Évalués" value={allApplicants.length} />
                    <StatCard icon={UserPlusIcon} label="Sélectionnés" value={selectedCount} color="text-green-400" />
                    <StatCard icon={UserMinusIcon} label="Recalés" value={rejectedCount} color="text-red-400" />
                </div>
                
                <div className="flex items-center gap-2 mb-8 border-b border-pm-gold/20">
                    <TabButton label="Résultats Globaux" isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} count={allApplicants.length} />
                    <TabButton label="Liste des Sélectionnés" isActive={activeTab === 'selected'} onClick={() => setActiveTab('selected')} count={selectedCount} />
                    <TabButton label="Liste des Recalés" isActive={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} count={rejectedCount} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedApplicants.map(app => (
                        <ApplicantCard key={app.id} app={app} data={data} />
                    ))}
                </div>
                 {displayedApplicants.length === 0 && (
                    <div className="text-center col-span-full py-20">
                        <p className="text-pm-off-white/70">Aucun candidat dans cette catégorie pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ApplicantCard: React.FC<{ app: ApplicantWithScore, data: any }> = ({ app, data }) => {
    const getScoreColor = (score: number) => {
        if (score >= 8.5) return 'text-pm-gold border-pm-gold bg-pm-gold/10';
        if (score >= 7) return 'text-green-400 border-green-500 bg-green-500/10';
        if (score >= 5) return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
        return 'text-red-400 border-red-500 bg-red-500/10';
    };
    
    const getStatusPill = (status: 'Présélectionné' | 'Recalé') => {
        const baseClasses = "px-2 py-1 text-xs font-bold rounded-full border";
        if (status === 'Présélectionné') return `${baseClasses} bg-green-500/10 text-green-300 border-green-500`;
        return `${baseClasses} bg-red-500/10 text-red-300 border-red-500`;
    };

    return (
        <div key={app.id} className="bg-pm-dark p-4 border border-pm-gold/20 rounded-lg shadow-lg shadow-black/30">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-pm-off-white/60">#{app.passageNumber ? String(app.passageNumber).padStart(3, '0') : 'N/A'}</p>
                    <h2 className="text-xl font-bold text-pm-off-white">{app.firstName} {app.lastName}</h2>
                </div>
                <div className={`text-2xl font-bold p-2 rounded-md border ${getScoreColor(app.averageScore)}`}>
                    {app.averageScore.toFixed(2)}
                </div>
            </div>
            <div className="mt-2">
                <span className={getStatusPill(app.liveStatus)}>{app.liveStatus}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-pm-gold/10">
                <h3 className="text-sm font-semibold text-pm-off-white/80 mb-2">Notes des Jurys ({app.juryCount})</h3>
                <div className="space-y-1 text-xs">
                    {app.scores && Object.entries(app.scores).map(([juryId, score]) => {
                        const juryMember = data?.juryMembers.find((j: any) => j.id === juryId);
                        return (
                            <div key={juryId} className="flex justify-between items-center bg-black/50 p-1.5 rounded">
                                <span>{juryMember?.name || juryId}</span>
                                <div className="flex items-center gap-1 font-bold text-pm-gold">
                                    <StarIcon className="w-3 h-3"/>
                                    <span>{score.overall.toFixed(1)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ElementType, label: string, value: number, color?: string }> = ({ icon: Icon, label, value, color = 'text-pm-gold' }) => (
    <div className="bg-pm-dark p-4 border border-pm-gold/20 rounded-lg flex items-center gap-4">
        <Icon className={`w-10 h-10 ${color}`} />
        <div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-pm-off-white/70">{label}</p>
        </div>
    </div>
);

const TabButton: React.FC<{ label: string, isActive: boolean, onClick: () => void, count: number }> = ({ label, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
            isActive
                ? 'text-pm-gold border-pm-gold'
                : 'text-pm-off-white/60 border-transparent hover:text-pm-gold'
        }`}
    >
        <span>{label}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-pm-gold text-pm-dark' : 'bg-pm-dark text-pm-off-white/70'}`}>
            {count}
        </span>
    </button>
);

export default AdminCastingLive;