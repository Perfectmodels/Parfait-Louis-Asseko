import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Model, Module } from '../../types';

const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
};

const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'Jamais';
    return new Date(timestamp).toLocaleString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const AdminClassroomProgress: React.FC = () => {
    const { data } = useData();
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);

    const models = useMemo(() => 
        [...(data?.models || [])]
            .filter(m => m.level === 'Pro')
            .sort((a, b) => (b.lastActivity || '').localeCompare(a.lastActivity || '')), 
    [data?.models]);

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Suivi Classroom Pro" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="admin-page-title">Suivi de Progression Classroom Pro</h1>
                <p className="admin-page-subtitle">
                    Consultez l'activité et les scores des mannequins aux différents quiz.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {models.map(model => (
                        <div key={model.id} className="bg-black border border-pm-gold/20 p-4 rounded-lg flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-pm-off-white">{model.name}</h2>
                                <p className="text-xs text-pm-off-white/60">Dernière connexion: {formatTimestamp(model.lastLogin)}</p>
                                <p className="text-xs text-pm-off-white/60">Dernière activité: {formatTimestamp(model.lastActivity)}</p>
                            </div>
                            <button onClick={() => setSelectedModel(model)} className="mt-4 w-full text-center text-sm bg-pm-dark border border-pm-gold/50 text-pm-gold py-2 rounded-md hover:bg-pm-gold hover:text-pm-dark transition-colors">
                                Voir la Progression
                            </button>
                        </div>
                    ))}
                </div>
                 {models.length === 0 && <p className="text-center p-8 mt-8 bg-black rounded-lg">Aucun mannequin Pro trouvé.</p>}
            </div>

            {selectedModel && (
                <ProgressModal 
                    model={selectedModel} 
                    onClose={() => setSelectedModel(null)}
                    courseData={data?.courseData || []}
                />
            )}
        </div>
    );
};


interface ProgressModalProps {
    model: Model;
    onClose: () => void;
    // FIX: Corrected the type for courseData. It's an array of Modules, not a property on Model.
    courseData: Module[];
}
const ProgressModal: React.FC<ProgressModalProps> = ({ model, onClose, courseData }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                    <h2 className="text-2xl font-playfair text-pm-gold">Progression de {model.name}</h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6 overflow-y-auto flex-grow">
                    <div className="space-y-4">
                        {courseData.map(module => (
                            <div key={module.slug}>
                                <h3 className="text-xl font-bold text-pm-gold/80 mb-2">{module.title}</h3>
                                <div className="space-y-2">
                                    {module.chapters.map(chapter => {
                                        // FIX: Quiz results are stored against the module slug, not the chapter slug.
                                        const result = model.quizScores?.[module.slug];
                                        return (
                                            <div key={chapter.slug} className="bg-pm-dark/50 p-3 rounded-md flex justify-between items-center">
                                                <div>
                                                    <p className="text-pm-off-white/90">{chapter.title}</p>
                                                     {result && <p className="text-xs text-pm-off-white/60">Passé le: {formatTimestamp(result.timestamp)}</p>}
                                                </div>
                                                {result ? (
                                                    <div className="flex items-center gap-3">
                                                         {result.timesLeft > 0 && (
                                                            <div className="flex items-center gap-1 text-yellow-400" title={`${result.timesLeft} sortie(s) de la page détectée(s)`}>
                                                                <ExclamationTriangleIcon className="w-4 h-4" />
                                                                <span className="text-xs font-bold">{result.timesLeft}</span>
                                                            </div>
                                                         )}
                                                        <span className={`font-bold text-lg ${getScoreColor(result.score, result.total)}`}>
                                                            {result.score} / {result.total}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-pm-off-white/50">Non complété</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};


export default AdminClassroomProgress;
