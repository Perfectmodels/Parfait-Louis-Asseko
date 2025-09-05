import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, StarIcon } from '@heroicons/react/24/outline';

const AdminCastingLive: React.FC = () => {
    const { data } = useData();
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // This effect will trigger a re-render whenever data changes from Firebase
    useEffect(() => {
        setLastUpdate(new Date());
    }, [data]);

    const applications = useMemo(() => {
        if (!data?.castingApplications) return [];
        
        return data.castingApplications
            .filter(app => app.status === 'Présélectionné' && app.scores && Object.keys(app.scores).length > 0)
            .map(app => {
                const scoresArray = Object.values(app.scores!);
                const averageScore = scoresArray.reduce((acc, score) => acc + score.overall, 0) / scoresArray.length;
                const juryCount = scoresArray.length;
                return { ...app, averageScore, juryCount };
            })
            .sort((a, b) => b.averageScore - a.averageScore);

    }, [data?.castingApplications]);

    const getScoreColor = (score: number) => {
        if (score >= 8.5) return 'text-pm-gold border-pm-gold bg-pm-gold/10';
        if (score >= 7) return 'text-green-400 border-green-500 bg-green-500/10';
        if (score >= 5) return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
        return 'text-red-400 border-red-500 bg-red-500/10';
    };

    return (
        <div className="bg-black text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Casting Live View" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Résultats du Casting en Direct</h1>
                        <p className="text-pm-off-white/70">Les notes des jurys sont mises à jour en temps réel.</p>
                    </div>
                    <div className="text-right text-xs text-pm-off-white/60">
                        <p>Dernière mise à jour:</p>
                        <p>{lastUpdate.toLocaleTimeString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {applications.map(app => (
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
                            <div className="mt-4 pt-4 border-t border-pm-gold/10">
                                <h3 className="text-sm font-semibold text-pm-off-white/80 mb-2">Notes des Jurys ({app.juryCount})</h3>
                                <div className="space-y-1 text-xs">
                                    {app.scores && Object.entries(app.scores).map(([juryId, score]) => {
                                        const juryMember = data?.juryMembers.find(j => j.id === juryId);
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
                    ))}
                </div>
                 {applications.length === 0 && (
                    <div className="text-center col-span-full py-20">
                        <p className="text-pm-off-white/70">En attente des premières notes du jury...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCastingLive;
