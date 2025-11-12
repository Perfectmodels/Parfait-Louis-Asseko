import React, { useState, useMemo } from 'react';
<<<<<<< HEAD:src/pages/admin/JuryCasting.tsx
import { useData } from '../../contexts/DataContext';
import { CastingApplication, JuryScore } from '../../types';
import SEO from '../../components/SEO';
=======
import { useData } from '../contexts/DataContext';
import { CastingApplication, JuryScore } from '../types';
import SEO from '../components/SEO';
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:pages/JuryCasting.tsx
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ScoreInput from '../../components/ScoreInput';

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
            .filter(app => app.status === 'Présélectionné' && app.passageNumber)
            .sort((a, b) => (a.passageNumber || 0) - (b.passageNumber || 0)) || [];
    }, [data?.castingApplications]);

    const candidatesToGrade = useMemo(() => {
        return applications.filter(app => !(app.scores && app.scores[juryId!]));
    }, [applications, juryId]);

    const gradedCandidates = useMemo(() => {
        return applications.filter(app => app.scores && app.scores[juryId!]);
    }, [applications, juryId]);

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
    
    const calculateAge = (birthDate: string): string => {
        if (!birthDate) return 'N/A';
        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        return `${age} ans`;
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

                    <section className="mb-16">
                        <h2 className="text-3xl font-playfair text-pm-gold border-b-2 border-pm-gold/20 pb-2 mb-6">
                            Candidats à Noter ({candidatesToGrade.length})
                        </h2>
                        {candidatesToGrade.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {candidatesToGrade.map(app => (
                                    <button 
                                        key={app.id} 
                                        onClick={() => openScoringModal(app)}
                                        className="group block bg-black border border-pm-gold/30 p-4 text-left overflow-hidden transition-all duration-300 hover:border-pm-gold hover:shadow-lg hover:shadow-pm-gold/10 hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-bold text-pm-off-white group-hover:text-pm-gold transition-colors duration-300">{app.firstName} {app.lastName}</h3>
                                            <p className="text-3xl font-playfair font-bold text-pm-gold">#{String(app.passageNumber).padStart(3, '0')}</p>
                                        </div>
                                        <div className="mt-4 border-t border-pm-gold/20 pt-3 space-y-2 text-sm text-pm-off-white/80">
                                            <p><strong>Âge:</strong> {calculateAge(app.birthDate)}</p>
                                            <p><strong>Taille:</strong> {app.height} cm</p>
                                            <p><strong>Genre:</strong> {app.gender}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-10 bg-black border border-pm-gold/10 rounded-lg">
                                <CheckCircleIcon className="w-12 h-12 mx-auto text-green-500 mb-2" />
                                <p className="text-pm-off-white/80">Tous les candidats ont été notés. Excellent travail !</p>
                            </div>
                        )}
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-playfair text-pm-gold border-b-2 border-pm-gold/20 pb-2 mb-6">
                            Candidats Notés ({gradedCandidates.length})
                        </h2>
                        {gradedCandidates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {gradedCandidates.map(app => {
                                    const myScore = app.scores![juryId!].overall;
                                    return (
                                        <button 
                                            key={app.id} 
                                            onClick={() => openScoringModal(app)}
                                            className="group block bg-pm-dark border border-pm-gold/50 p-4 text-left overflow-hidden transition-all duration-300 opacity-70 hover:opacity-100"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-2xl font-bold text-pm-off-white">{app.firstName} {app.lastName}</h3>
                                                <p className="text-3xl font-playfair font-bold text-pm-gold">#{String(app.passageNumber).padStart(3, '0')}</p>
                                            </div>
                                            <div className="mt-4 border-t border-pm-gold/20 pt-3 space-y-2 text-sm text-pm-off-white/80">
                                                <p><strong>Âge:</strong> {calculateAge(app.birthDate)}</p>
                                                <p><strong>Taille:</strong> {app.height} cm</p>
                                                <p><strong>Genre:</strong> {app.gender}</p>
                                            </div>
                                            <div className="mt-4 bg-pm-gold/10 p-2 rounded-md text-center">
                                                <p className="text-xs text-pm-gold uppercase tracking-wider">Votre Note</p>
                                                <p className="text-2xl font-bold text-pm-gold">{myScore.toFixed(1)}/10</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                             <div className="text-center py-10 bg-black border border-pm-gold/10 rounded-lg">
                                <p className="text-pm-off-white/70">Aucun candidat noté pour le moment.</p>
                            </div>
                        )}
                    </section>
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


