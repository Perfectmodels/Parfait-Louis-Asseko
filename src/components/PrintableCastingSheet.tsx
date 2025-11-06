

import React, { useEffect } from 'react';
// FIX: Corrected import path for types.
import { CastingApplication, JuryMember, JuryScore } from '../../types';
import { useData } from '../contexts/DataContext';

interface PrintableCastingSheetProps {
    app: CastingApplication;
    juryMembers: JuryMember[];
    onDonePrinting: () => void;
}

const PrintableCastingSheet: React.FC<PrintableCastingSheetProps> = ({ app, juryMembers, onDonePrinting }) => {
    const { data } = useData();

    useEffect(() => {
        const handleAfterPrint = () => {
            onDonePrinting();
            window.removeEventListener('afterprint', handleAfterPrint);
        };
        window.addEventListener('afterprint', handleAfterPrint);
        
        const timer = setTimeout(() => {
            window.print();
        }, 500);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, [onDonePrinting]);
    
    const calculateAge = (birthDate: string): string => {
        if (!birthDate) return 'N/A';
        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        return `${age} ans`;
    };
    
    const juryScores: [string, JuryScore][] = app.scores ? Object.entries(app.scores) : [];
    const overallScores = juryScores.map(([, score]) => score.overall);
    const averageScore = overallScores.length > 0 ? (overallScores.reduce((a, b) => a + b, 0) / overallScores.length) : 0;
    const decision = averageScore >= 5 ? 'Présélectionné' : 'Recalé';

    return (
        <div className="printable-content printable-sheet p-8 bg-white text-black font-montserrat">
            <header className="flex justify-between items-center border-b-2 border-black pb-4">
                <div>
                    <h1 className="text-4xl font-bold font-playfair">Fiche Candidat</h1>
                    <p className="text-lg">Casting Perfect Models Management</p>
                </div>
                {data?.siteConfig?.logo && <img src={data.siteConfig.logo} alt="Logo" className="h-20 w-auto" />}
            </header>

            <section className="mt-6 grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <h2 className="text-5xl font-playfair font-bold text-pm-gold">{app.firstName} {app.lastName}</h2>
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-lg">
                        <div><strong>Âge:</strong> {calculateAge(app.birthDate)}</div>
                        <div><strong>Genre:</strong> {app.gender}</div>
                        <div><strong>Taille:</strong> {app.height} cm</div>
                        <div><strong>Poids:</strong> {app.weight} kg</div>
                        <div><strong>Téléphone:</strong> {app.phone}</div>
                        <div><strong>Email:</strong> {app.email}</div>
                    </div>
                </div>
                <div className="col-span-1 text-center bg-black p-4 flex flex-col justify-center items-center">
                    <p className="text-sm uppercase tracking-widest text-white">Numéro de Passage</p>
                    <p className="text-8xl font-playfair font-bold text-pm-gold">#{String(app.passageNumber).padStart(3, '0')}</p>
                </div>
            </section>
            
            <section className="mt-6">
                 <h3 className="text-2xl font-playfair border-b border-black pb-1 mb-2">Mensurations</h3>
                 <div className="flex space-x-8 text-md">
                    <span><strong>Poitrine:</strong> {app.chest || 'N/A'} cm</span>
                    <span><strong>Taille:</strong> {app.waist || 'N/A'} cm</span>
                    <span><strong>Hanches:</strong> {app.hips || 'N/A'} cm</span>
                    <span><strong>Pointure:</strong> {app.shoeSize || 'N/A'} EU</span>
                 </div>
            </section>

            <section className="mt-6">
                <h3 className="text-2xl font-playfair border-b border-black pb-1 mb-2">Évaluation du Jury</h3>
                {juryScores.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-200 border-b-2 border-black">
                                <th className="p-2 font-bold">Jury</th>
                                <th className="p-2 font-bold text-center">Physique</th>
                                <th className="p-2 font-bold text-center">Présence</th>
                                <th className="p-2 font-bold text-center">Photogénie</th>
                                <th className="p-2 font-bold text-center">Potentiel</th>
                                <th className="p-2 font-bold text-center text-pm-gold bg-black">Note Globale</th>
                            </tr>
                        </thead>
                        <tbody>
                            {juryScores.map(([juryId, score]) => {
                                const jury = juryMembers.find(j => j.id === juryId);
                                return (
                                    <tr key={juryId} className="border-b">
                                        <td className="p-2 font-semibold">{jury?.name || juryId}</td>
                                        <td className="p-2 text-center">{score.physique.toFixed(1)}</td>
                                        <td className="p-2 text-center">{score.presence.toFixed(1)}</td>
                                        <td className="p-2 text-center">{score.photogenie.toFixed(1)}</td>
                                        <td className="p-2 text-center">{score.potentiel.toFixed(1)}</td>
                                        <td className="p-2 text-center font-bold text-pm-gold bg-black">{score.overall.toFixed(1)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>Aucune note enregistrée.</p>
                )}
            </section>
            
            {juryScores.some(([, score]) => score.notes) && (
                <section className="mt-6">
                     <h3 className="text-2xl font-playfair border-b border-black pb-1 mb-2">Remarques des Jurys</h3>
                     <div className="space-y-2">
                        {juryScores.filter(([, score]) => score.notes).map(([juryId, score]) => {
                             const jury = juryMembers.find(j => j.id === juryId);
                             return (
                                <div key={juryId}>
                                    <strong>{jury?.name || juryId}:</strong>
                                    <span className="italic"> "{score.notes}"</span>
                                </div>
                             )
                        })}
                     </div>
                </section>
            )}

            <section className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-playfair">Moyenne Générale</h3>
                    <p className="text-6xl font-playfair font-bold text-pm-gold">{averageScore.toFixed(2)} <span className="text-3xl text-black">/ 10</span></p>
                 </div>
                 <div>
                    <h3 className="text-xl font-playfair">Décision Provisoire</h3>
                    <p className={`text-4xl font-playfair font-bold ${decision === 'Présélectionné' ? 'text-green-600' : 'text-red-600'}`}>{decision}</p>
                 </div>
            </section>
        </div>
    );
};

export default PrintableCastingSheet;