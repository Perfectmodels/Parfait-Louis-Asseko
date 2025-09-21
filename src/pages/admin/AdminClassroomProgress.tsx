import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, XMarkIcon, ExclamationTriangleIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import { Model, Module } from '../../types';
import ClassroomCharts from '../../components/ClassroomCharts'; // Import du composant de graphiques

// Fonctions utilitaires (getScoreColor, formatTimestamp)
const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
};

const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'Jamais';
    return new Date(timestamp).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};


const AdminClassroomProgress: React.FC = () => {
    const { data } = useData();
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [showCharts, setShowCharts] = useState(true);

    const models = useMemo(() => 
        [...(data?.models || [])]
            .filter(m => m.level === 'Pro')
            .sort((a, b) => (b.lastActivity || '').localeCompare(a.lastActivity || '')), 
    [data?.models]);
    
    const courseModules = useMemo(() => data?.courseData || [], [data?.courseData]);

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Suivi Classroom Pro" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Suivi de Progression Classroom</h1>
                        <p className="admin-page-subtitle">
                            Consultez l'activité, les scores et les statistiques de la formation.
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowCharts(!showCharts)}
                        className="action-btn bg-pm-dark border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark"
                    >
                        <ChartPieIcon className="w-5 h-5" />
                        {showCharts ? 'Cacher les Stats' : 'Afficher les Stats'}
                    </button>
                </div>

                {showCharts && (
                    <div className="my-8">
                         <ClassroomCharts models={models} modules={courseModules} />
                    </div>
                )}

                <div className="mt-8">
                     <h2 className="text-2xl font-bold text-pm-gold mb-4">Progression Individuelle</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>

            {selectedModel && (
                <ProgressModal 
                    model={selectedModel} 
                    onClose={() => setSelectedModel(null)}
                    courseData={courseModules}
                />
            )}
        </div>
    );
};


// --- ProgressModal Component (aucun changement ici) ---
interface ProgressModalProps {
    model: Model;
    onClose: () => void;
    courseData: Module[];
}
const ProgressModal: React.FC<ProgressModalProps> = ({ model, onClose, courseData }) => {
    // Le contenu de la modale reste identique
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">...
                </header>
                <main className="p-6 overflow-y-auto flex-grow">...
                </main>
            </div>
        </div>
    );
};

export default AdminClassroomProgress;
