import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CastingApplication, JuryScore } from '../types';
import SEO from '../components/SEO';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ScoreInput from '../components/ScoreInput';

const JuryCasting: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [selectedApp, setSelectedApp] = useState<CastingApplication | null>(null);
    const [currentScores, setCurrentScores] = useState<Omit<JuryScore, 'overall'>>({
        physique: 5,
        presence: 5,
        photogenie: 5,
        potentiel: 5,
        notes: '',
    });

    const juryId = sessionStorage.getItem('userId');
    const juryName = sessionStorage.getItem('userName');
    
    const applications = useMemo(() => {
        return data?.castingApplications
            .filter(app => app.status === 'Présélectionné')
            .sort((a, b) => {
                const aScored = a.scores && a.scores[juryId!];
                const bScored = b.scores && b.scores[juryId!];
                if (aScored && !bScored) return 1;
                if (!aScored && bScored) return -1;
                // Sort by submission date if both are scored or not scored
                return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
            }) || [];
    }, [data?.castingApplications, juryId]);

    const openScoringModal = (app: CastingApplication) => {
        setSelectedApp(app);
        const existingScores = app.scores && juryId ? app.scores[juryId] : null;
        if (existingScores) {
            setCurrentScores({
                physique: existingScores.physique,
                presence: existingScores.presence,
                photogenie: existingScores.photogenie,
                potentiel: existingScores.potentiel,
                notes: existingScores.notes || '',
            });
        } else {
            // Reset to default scores for a new applicant
            setCurrentScores({
                physique: 5,
                presence: 5,
                photogenie: 5,
                potentiel: 5,
                notes: '',
            });
        }
    };

    const handleScoreChange = (field: keyof Omit<JuryScore, 'overall' | 'notes'>, value: number) => {
        setCurrentScores(prev => ({ ...prev, [field]: value }));
    };
    
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentScores(prev => ({ ...prev, notes: e.target.value }));
    };

    const handleSubmitScore = async () => {
        if (!selectedApp || !juryId || !data) return;

        const overall = (currentScores.physique + currentScores.presence + currentScores.photogenie + currentScores.potentiel) / 4;
        const newScore: JuryScore = { ...currentScores, overall };

        const updatedApps = data.castingApplications.map(app => {
            if (app.id === selectedApp.id) {
                return {
                    ...app,
                    scores: {
                        ...(app.scores || {}),
                        [juryId]: newScore,
                    }
                };
            }
            return app;
        });

        try {
            await saveData({ ...data, castingApplications: updatedApps });
            alert('Note enregistrée avec succès !');
            setSelectedApp(null);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de l\'enregistrement de la note.');
        }
    };
    
    if (!isInitialized) {
        return <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-gold">Chargement...</div>;
    }

    if (!juryId || !juryName) {
        return <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-gold">Erreur: membre du jury non identifié. Veuillez vous reconnecter.</div>;
    }

    return (
        <>
            <SEO title={`Jury Casting - ${juryName}`} noIndex />
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl font-playfair text-pm-gold">Panel de Notation du Jury</h1>
                    <p className="text-pm-off-white/80 mb-8">Bonjour, {juryName}. Veuillez évaluer les candidats présélectionnés.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {applications.map(app => {
                            const hasScored = app.scores && app.scores[juryId!];
                            const overallScore = hasScored ? app.scores![juryId!].overall : null;

                            return (
                                <button 
                                    key={app.id} 
                                    onClick={() => openScoringModal(app)}
                                    className={`group block bg-black border ${hasScored ? 'border-pm-gold/50' : 'border-pm-gold/20'} overflow-hidden transition-all duration-300 hover:border-pm-gold hover:shadow-lg hover:shadow-pm-gold/10`}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        {app.photoPortraitUrl ? (
                                            <img src={app.photoPortraitUrl} alt={`${app.firstName} ${app.lastName}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full bg-pm-dark flex items-center justify-center">
                                                <span className="text-pm-off-white/20 text-sm">Photo non dispo.</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        {hasScored && (
                                            <div className="absolute top-2 right-2 bg-pm-gold text-pm-dark rounded-full p-2 flex items-center gap-1 text-xs font-bold">
                                                <CheckCircleIcon className="w-4 h-4" />
                                                <span>{overallScore?.toFixed(1)}/10</span>
                                            </div>
                                        )}
                                         {!hasScored && (
                                            <div className="absolute top-2 right-2 bg-pm-dark text-pm-gold rounded-full p-2 text-xs font-bold border border-pm-gold/50">
                                                À Noter
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 p-3 w-full">
                                            <h3 className="text-lg font-playfair text-pm-off-white group-hover:text-pm-gold">{app.firstName} {app.lastName}</h3>
                                            <p className="text-xs text-pm-off-white/70">{app.height} cm - {new Date().getFullYear() - new Date(app.birthDate).getFullYear()} ans</p>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                     {applications.length === 0 && (
                        <div className="text-center col-span-full py-20">
                            <p className="text-pm-off-white/70">Aucune candidature à noter pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedApp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl shadow-pm-gold/10 w-full max-w-lg max-h-[90vh] flex flex-col">
                        <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                             <h2 className="text-2xl font-playfair text-pm-gold">Noter {selectedApp.firstName} {selectedApp.lastName}</h2>
                             <button onClick={() => setSelectedApp(null)} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                        </header>
                         <main className="p-6 overflow-y-auto flex-grow">
                             <form onSubmit={(e) => { e.preventDefault(); handleSubmitScore(); }} className="space-y-4">
                                <ScoreInput label="Physique & Harmonie" value={currentScores.physique} onChange={val => handleScoreChange('physique', val)} />
                                <ScoreInput label="Présence & Charisme" value={currentScores.presence} onChange={val => handleScoreChange('presence', val)} />
                                <ScoreInput label="Photogénie" value={currentScores.photogenie} onChange={val => handleScoreChange('photogenie', val)} />
                                <ScoreInput label="Potentiel de développement" value={currentScores.potentiel} onChange={val => handleScoreChange('potentiel', val)} />
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-pm-off-white/70 mb-1">Notes / Remarques</label>
                                    <textarea
                                        id="notes"
                                        value={currentScores.notes}
                                        onChange={handleNotesChange}
                                        rows={3}
                                        className="admin-input admin-textarea"
                                        placeholder="Commentaires optionnels..."
                                    />
                                </div>
                                <div className="pt-4 flex justify-end gap-4">
                                    <button type="button" onClick={() => setSelectedApp(null)} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-xs rounded-full hover:border-white">
                                        Annuler
                                    </button>
                                     <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white shadow-md shadow-pm-gold/30">
                                        Enregistrer la Note
                                    </button>
                                </div>
                             </form>
                         </main>
                    </div>
                </div>
            )}
        </>
    );
};

export default JuryCasting;
